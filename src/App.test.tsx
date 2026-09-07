import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { INACTIVITY_LIMIT_MS, TASK_DURATION_MS } from './config';

function startTask() {
  const startTarget = screen.getByLabelText('将鼠标移到中央区域并按空格键开始');
  fireEvent.mouseEnter(startTarget);
  fireEvent.keyDown(window, { code: 'Space', key: ' ' });
}

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('介绍页显示完整说明且只能悬停指针后按空格开始', () => {
    render(<App />);

    expect(screen.getByText(/欢迎参加本实验。本实验旨在考察视觉注意与手部动作的协调性/)).toBeInTheDocument();
    expect(screen.getByText(/请以稳定、均匀的节奏持续点击/)).toBeInTheDocument();
    expect(screen.getByText(/请始终保持注意力集中在指针上/)).toBeInTheDocument();
    expect(screen.getByText(/任务将持续一段时间/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '开始任务' })).not.toBeInTheDocument();
    expect(screen.queryByText(/5 分钟|30 秒|任务时长|倒计时/)).not.toBeInTheDocument();

    fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    expect(screen.queryByLabelText('实验钟表')).not.toBeInTheDocument();

    startTask();
    expect(screen.getByLabelText('实验钟表')).toBeInTheDocument();
  });

  it('点击固定中央区域后指针累计顺时针旋转 90°', () => {
    render(<App />);
    startTask();
    const centerControl = screen.getByRole('button', { name: '点击中央区域' });
    const hand = screen.getByTestId('clock-hand');

    fireEvent.click(centerControl);
    expect(centerControl).toHaveAttribute('aria-valuenow', '90');
    expect(hand).toHaveAttribute('data-angle', '90');
    expect(centerControl).not.toHaveStyle({ transform: 'rotate(90deg)' });

    fireEvent.click(centerControl);
    expect(centerControl).toHaveAttribute('aria-valuenow', '180');
    expect(hand).toHaveAttribute('data-angle', '180');

    expect(screen.queryByText(/5 分钟|30 秒|任务时长|进度/)).not.toBeInTheDocument();
  });

  it('第一次连续 30 秒未点击时指针变红，点击后恢复黑色', () => {
    vi.useFakeTimers();
    render(<App />);
    startTask();
    const centerControl = screen.getByRole('button', { name: '点击中央区域' });
    const hand = screen.getByTestId('clock-hand');

    act(() => vi.advanceTimersByTime(INACTIVITY_LIMIT_MS));
    expect(hand).toHaveClass('clock-hand-visual--warning');
    expect(screen.getByLabelText('实验钟表')).toBeInTheDocument();

    fireEvent.click(centerControl);
    expect(hand).not.toHaveClass('clock-hand-visual--warning');
  });

  it('第一次警告记录保留，第二次连续 30 秒未点击时结束', () => {
    vi.useFakeTimers();
    render(<App />);
    startTask();

    act(() => vi.advanceTimersByTime(INACTIVITY_LIMIT_MS));
    fireEvent.click(screen.getByRole('button', { name: '点击中央区域' }));
    act(() => vi.advanceTimersByTime(INACTIVITY_LIMIT_MS));

    expect(screen.getByText('感谢您参与本次实验！')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('持续点击避免无操作退出，但五分钟后仍自动结束', () => {
    vi.useFakeTimers();
    render(<App />);
    startTask();

    for (let index = 0; index < 10; index += 1) {
      act(() => vi.advanceTimersByTime(29_000));
      fireEvent.click(screen.getByRole('button', { name: '点击中央区域' }));
    }

    act(() => vi.advanceTimersByTime(TASK_DURATION_MS - 290_000 - 1));
    expect(screen.getByLabelText('实验钟表')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('感谢您参与本次实验！')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
