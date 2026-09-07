import type { CSSProperties } from 'react';

type ClockDialProps = {
  angle?: number;
  warning?: boolean;
  startTarget?: boolean;
  onActivate?: () => void;
  onHoverChange?: (hovered: boolean) => void;
};

export function ClockDial({
  angle = 0,
  warning = false,
  startTarget = false,
  onActivate,
  onHoverChange,
}: ClockDialProps) {
  const rotationStyle = { '--clock-angle': `${angle}deg` } as CSSProperties;

  return (
    <div
      aria-label={startTarget ? undefined : '实验钟表'}
      className={`clock-dial ${startTarget ? 'clock-dial--start' : ''}`}
      role={startTarget ? undefined : 'group'}
    >
      <span className="clock-mark clock-mark--twelve" aria-hidden="true" />
      <span className="clock-mark clock-mark--three" aria-hidden="true" />
      <span className="clock-mark clock-mark--six" aria-hidden="true" />
      <span className="clock-mark clock-mark--nine" aria-hidden="true" />

      <span
        aria-hidden="true"
        className={`clock-hand-visual ${warning ? 'clock-hand-visual--warning' : ''}`}
        data-angle={angle}
        data-testid={startTarget ? undefined : 'clock-hand'}
        style={rotationStyle}
      >
        <span className="clock-hand" />
      </span>

      {startTarget ? (
        <span
          aria-label="将鼠标移到中央区域并按空格键开始"
          className="clock-center-control clock-center-control--start"
          onMouseEnter={() => onHoverChange?.(true)}
          onMouseLeave={() => onHoverChange?.(false)}
          role="img"
        />
      ) : (
        <button
          aria-label="点击中央区域"
          aria-valuenow={angle}
          className="clock-center-control"
          onClick={onActivate}
          type="button"
        />
      )}

      <span className="clock-hub" aria-hidden="true" />
    </div>
  );
}
