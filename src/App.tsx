import { useEffect, useState } from 'react';
import { ClockDial } from './components/ClockDial';
import { INACTIVITY_LIMIT_MS, ROTATION_STEP, TASK_DURATION_MS } from './config';

type Screen = 'intro' | 'task' | 'complete';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [startTargetHovered, setStartTargetHovered] = useState(false);
  const [angle, setAngle] = useState(0);
  const [hasWarned, setHasWarned] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);
  const [inactivityCycle, setInactivityCycle] = useState(0);

  useEffect(() => {
    if (screen !== 'intro' || !startTargetHovered) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space') return;
      event.preventDefault();
      setAngle(0);
      setHasWarned(false);
      setWarningVisible(false);
      setInactivityCycle(0);
      setScreen('task');
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, startTargetHovered]);

  useEffect(() => {
    if (screen !== 'task') return;
    const timer = window.setTimeout(() => setScreen('complete'), TASK_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== 'task') return;

    const timer = window.setTimeout(() => {
      if (hasWarned) {
        setScreen('complete');
        return;
      }
      setHasWarned(true);
      setWarningVisible(true);
    }, INACTIVITY_LIMIT_MS);

    return () => window.clearTimeout(timer);
  }, [screen, inactivityCycle, hasWarned]);

  function rotatePointer() {
    setAngle((current) => current + ROTATION_STEP);
    setWarningVisible(false);
    setInactivityCycle((current) => current + 1);
  }

  if (screen === 'intro') {
    return (
      <main className="page page--centered intro-page">
        <section className="intro-card" aria-labelledby="page-title">
          <p className="eyebrow">VISUAL ATTENTION TASK</p>
          <h1 id="page-title">实验任务说明</h1>
          <div className="intro-copy">
            <p>欢迎参加本实验。本实验旨在考察视觉注意与手部动作的协调性。在接下来的任务中，屏幕中央会出现一个钟表表盘。请使用鼠标点击表盘中央区域。每点击一次，指针会顺时针旋转 90度。</p>
            <p>请以稳定、均匀的节奏持续点击，不要停顿，不要忽快忽慢，长时间不点将会中断本次试验。</p>
            <p>请始终保持注意力集中在指针上，眼睛不要离开屏幕。</p>
            <p>任务将持续一段时间。期间请不要做其他事情，不要看手机，不要离开座位。</p>
            <p>如果你已理解上述要求，请将鼠标移到表盘中央区域，按空格键开始任务。</p>
          </div>
          <div className="start-target-wrap">
            <ClockDial startTarget onHoverChange={setStartTargetHovered} />
            <p className={startTargetHovered ? 'start-hint start-hint--ready' : 'start-hint'}>
              {startTargetHovered ? '按空格键开始' : '将鼠标移到表盘中央区域'}
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'complete') {
    return (
      <main className="page page--centered">
        <section className="complete-card" aria-label="实验结束">
          <p>感谢您参与本次实验！</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page task-page">
      <header className="task-header">
        <p className="eyebrow">VISUAL ATTENTION TASK</p>
        <h1>视觉注意与手部动作任务</h1>
        <p className="task-instruction">请以稳定、均匀的节奏持续点击表盘中央区域。</p>
      </header>
      <section className="clock-stage" aria-label="任务区域">
        <ClockDial angle={angle} warning={warningVisible} onActivate={rotatePointer} />
      </section>
    </main>
  );
}
