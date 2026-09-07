import { useState } from 'react';
import { ROTATION_STEP } from '../config';

type KnobProps = {
  index: number;
};

export function Knob({ index }: KnobProps) {
  const [totalAngle, setTotalAngle] = useState(0);

  function rotateKnob() {
    setTotalAngle((current) => current + ROTATION_STEP);
  }

  return (
    <div className="knob-item">
      <button
        aria-label={`旋转圆盘 ${index}`}
        aria-valuenow={totalAngle}
        className="knob"
        onClick={rotateKnob}
        type="button"
      >
        <span className="knob__inner" style={{ transform: `rotate(${totalAngle}deg)` }}>
          <span className="knob__pointer" />
          <span className="knob__hub" />
        </span>
      </button>
      <span className="knob-item__hint" aria-hidden="true">点击</span>
    </div>
  );
}
