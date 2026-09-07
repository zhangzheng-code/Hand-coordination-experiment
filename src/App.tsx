import { useState, type CSSProperties } from 'react';
import { Knob } from './components/Knob';
import { TARGET_ANGLE, TOTAL_TRIALS } from './config';

type Screen = 'intro' | 'task' | 'complete';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [trial, setTrial] = useState(1);

  function startTask() {
    setTrial(1);
    setScreen('task');
  }

  function completeTrial() {
    if (trial >= TOTAL_TRIALS) {
      setScreen('complete');
      return;
    }
    setTrial((current) => current + 1);
  }

  if (screen === 'intro') {
    return (
      <main className="page page--centered">
        <section className="intro-card" aria-labelledby="page-title">
          <p className="eyebrow">COORDINATION TASK</p>
          <h1 id="page-title">手部协调能力任务</h1>
          <div className="intro-copy">
            <p>接下来，您将完成一项简单的手眼协调任务。</p>
            <p>请按照屏幕提示完成操作，尽可能准确完成所有步骤。</p>
          </div>
          <button className="primary-button" type="button" onClick={startTask}>开始任务</button>
        </section>
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="page page--centered">
        <section className="complete-card" aria-labelledby="complete-title">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <h1 id="complete-title">任务完成</h1>
          <p>感谢您的参与。</p>
          <button className="primary-button" type="button" onClick={startTask}>重新开始</button>
        </section>
      </main>
    );
  }

  return (
    <main className="page task-page">
      <header className="task-header">
        <div>
          <p className="eyebrow">COORDINATION TASK</p>
          <h1>手部协调能力任务</h1>
          <p className="task-instruction">请点击中央旋钮，完成本次任务。</p>
        </div>
        <div className="progress" aria-label={`任务进度 ${trial} / ${TOTAL_TRIALS}`}>
          <span>{trial} / {TOTAL_TRIALS}</span>
        </div>
      </header>

      <div className="task-meta">
        <span>本次目标</span>
        <strong>每次点击顺时针旋转 {TARGET_ANGLE}°</strong>
      </div>

      <div
        className="progress-track"
        aria-hidden="true"
        style={{ '--progress': `${((trial - 1) / TOTAL_TRIALS) * 100}%` } as CSSProperties}
      >
        <span />
      </div>

      <section className="experiment-card" aria-label="旋钮实验区域">
        <Knob onComplete={completeTrial} />
      </section>
    </main>
  );
}
