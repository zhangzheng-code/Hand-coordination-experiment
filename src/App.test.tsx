import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('从介绍页进入任务并显示初始进度', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('接下来，您将完成一项简单的手眼协调任务。')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '开始任务' }));

    expect(screen.getByText('1 / 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '旋转中央旋钮' })).toBeInTheDocument();
  });

  it('每次点击固定旋转 30°，反馈期间忽略重复点击', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '开始任务' }));

    const knob = screen.getByRole('button', { name: '旋转中央旋钮' });
    fireEvent.click(knob);
    fireEvent.click(knob);

    expect(knob).toHaveAttribute('aria-valuenow', '30');
    expect(screen.getByText('完成')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getByText('2 / 10')).toBeInTheDocument();
    expect(knob).toHaveAttribute('aria-valuenow', '30');
  });

  it('连续点击十次后完成，重新开始恢复初始状态', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '开始任务' }));

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: '旋转中央旋钮' }));
      act(() => {
        vi.advanceTimersByTime(350);
      });
    }

    expect(screen.getByRole('heading', { name: '任务完成' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '重新开始' }));

    expect(screen.getByText('1 / 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '旋转中央旋钮' })).toHaveAttribute('aria-valuenow', '0');
  });
});
