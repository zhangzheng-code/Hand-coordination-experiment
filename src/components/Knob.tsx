import { useState, type CSSProperties } from 'react';
import { SUCCESS_FEEDBACK_MS, TARGET_ANGLE } from '../config';

type Feedback = 'idle' | 'success';

type KnobProps = {
  disabled?: boolean;
  onComplete: () => void;
};

export function Knob({ disabled = false, onComplete }: KnobProps) {
  const [totalAngle, setTotalAngle] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const interactionLocked = disabled || feedback === 'success';

  function handleActivate() {
    if (interactionLocked) return;

    setTotalAngle((current) => current + TARGET_ANGLE);
    setFeedback('success');
    window.setTimeout(() => {
      setFeedback('idle');
      onComplete();
    }, SUCCESS_FEEDBACK_MS);
  }

  return (
    <div className="knob-task">
      <div className="direction-ring">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            className="direction-mark"
            aria-hidden="true"
            style={{ '--direction': `${index * 45}deg` } as CSSProperties}
            key={index}
          />
        ))}
        <button
          aria-label="旋转中央旋钮"
          aria-valuenow={totalAngle}
          className={`knob ${feedback === 'success' ? 'knob--success' : ''}`}
          disabled={interactionLocked}
          onClick={handleActivate}
          type="button"
        >
          <div className="knob__inner" style={{ transform: `rotate(${totalAngle}deg)` }}>
            <span className="knob__pointer" />
            <span className="knob__hub" />
          </div>
        </button>
      </div>
      <p className={`task-feedback task-feedback--${feedback}`} aria-live="polite">
        {feedback === 'success'
          ? '完成'
          : '点击中央旋钮'}
      </p>
    </div>
  );
}
