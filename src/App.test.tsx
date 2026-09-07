import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { TASK_DURATION_MS } from './config';

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('进入任务后显示八个独立圆盘且不显示进度', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '开始任务' }));

    expect(screen.getAllByRole('button', { name: /旋转圆盘/ })).toHaveLength(8);
    expect(screen.queryByText('1 / 10')).not.toBeInTheDocument();
    expect(screen.queryByText('完成')).not.toBeInTheDocument();
  });

  it('点击一个圆盘只让该圆盘累计旋转 90°', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '开始任务' }));
    const knobs = screen.getAllByRole('button', { name: /旋转圆盘/ });

    fireEvent.click(knobs[2]);
    expect(knobs[2]).toHaveAttribute('aria-valuenow', '90');
    expect(knobs[0]).toHaveAttribute('aria-valuenow', '0');

    fireEvent.click(knobs[2]);
    expect(knobs[2]).toHaveAttribute('aria-valuenow', '180');
  });

  it('五分钟后自动进入无按钮结束页', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '开始任务' }));

    act(() => vi.advanceTimersByTime(TASK_DURATION_MS - 1));
    expect(screen.getByRole('heading', { name: '手部协调能力任务' })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('heading', { name: '本次实验已结束' })).toBeInTheDocument();
    expect(screen.getByText('感谢您的参与。')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
