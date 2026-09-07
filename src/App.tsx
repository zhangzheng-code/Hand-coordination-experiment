import { useEffect, useState } from 'react';
import { KnobGrid } from './components/KnobGrid';
import { ROTATION_STEP, TASK_DURATION_MS } from './config';

type Screen = 'intro' | 'task' | 'complete';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');

  useEffect(() => {
    if (screen !== 'task') return;
    const timer = window.setTimeout(() => setScreen('complete'), TASK_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [screen]);

  if (screen === 'intro') {
    return (
      <main className="page page--centered">
        <section className="intro-card" aria-labelledby="page-title">
          <p className="eyebrow">COORDINATION TASK</p>
          <h1 id="page-title">手部协调能力任务</h1>
          <div className="intro-copy">
            <p>接下来，您将完成一项简单的手眼协调任务。</p>
            <p>任务约持续 5 分钟。请反复点击圆盘，尽可能准确地完成操作。</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setScreen('task')}>开始任务</button>
        </section>
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="page page--centered">
        <section className="complete-card" aria-labelledby="complete-title">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <h1 id="complete-title">本次实验已结束</h1>
          <p>感谢您的参与。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page task-page">
      <header className="task-header">
        <p className="eyebrow">COORDINATION TASK</p>
        <h1>手部协调能力任务</h1>
        <p className="task-instruction">请重复点击任意圆盘。每次点击，指针将顺时针旋转 {ROTATION_STEP}°。</p>
      </header>

      <div className="task-meta">
        <span>任务时长</span>
        <strong>约 5 分钟</strong>
      </div>

      <section className="experiment-card" aria-label="圆盘实验区域">
        <KnobGrid />
      </section>
    </main>
  );
}
