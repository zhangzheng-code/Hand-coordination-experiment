import { KNOB_COUNT } from '../config';
import { Knob } from './Knob';

export function KnobGrid() {
  return (
    <div className="knob-grid">
      {Array.from({ length: KNOB_COUNT }, (_, index) => (
        <Knob index={index + 1} key={index} />
      ))}
    </div>
  );
}
