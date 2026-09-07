# 手部协调能力任务实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 构建一个简洁正式、支持连续累积鼠标旋转的手部协调能力实验网页。

**架构：** `App` 管理介绍、任务和完成三态；`Knob` 用 Pointer Events 采集指针位置；纯函数模块负责角度归一化与完成判断，确保 ±180° 边界可测试。成功后只清零当前轮增量，旋钮总角度保持不变。

**技术栈：** React 19、TypeScript、Vite、Vitest、Testing Library、原生 CSS、SVG/CSS 图形。

---

## 文件结构

- `package.json`：项目命令与依赖。
- `vite.config.ts`、`tsconfig*.json`、`index.html`：Vite/TypeScript 最小配置。
- `src/config.ts`：任务次数、目标角度、容差和反馈时长。
- `src/rotation.ts`：角度差归一化、坐标转角度、完成判断。
- `src/rotation.test.ts`：角度边界与判定测试。
- `src/components/Knob.tsx`：连续拖动、跨多次按压累计、反馈和旋钮结构。
- `src/App.tsx`：三态页面、轮次推进、重新开始。
- `src/App.test.tsx`：页面主流程与累计拖动集成测试。
- `src/styles.css`：完整视觉和响应式样式。
- `src/main.tsx`、`src/test/setup.ts`：应用入口与测试环境。

### 任务 1：搭建最小项目与测试环境

**文件：**
- 创建：`package.json`
- 创建：`index.html`
- 创建：`vite.config.ts`
- 创建：`tsconfig.json`
- 创建：`tsconfig.app.json`
- 创建：`tsconfig.node.json`
- 创建：`src/main.tsx`
- 创建：`src/test/setup.ts`

- [ ] **步骤 1：创建项目配置**

`package.json` 提供 `dev`、`build`、`test` 命令，依赖限制为 React、Vite、TypeScript、Vitest、jsdom 和 Testing Library。

- [ ] **步骤 2：安装依赖**

运行：`npm install`

预期：退出码为 0，生成 `node_modules` 与锁文件。

- [ ] **步骤 3：验证测试运行器**

运行：`npm test -- --run`

预期：测试环境可启动；在测试文件尚未创建时提示没有测试文件。

- [ ] **步骤 4：提交配置**

运行：`git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json src/main.tsx src/test/setup.ts && git commit -m "chore: 搭建 React 实验项目"`

### 任务 2：以 TDD 实现连续角度算法

**文件：**
- 创建：`src/config.ts`
- 创建：`src/rotation.test.ts`
- 创建：`src/rotation.ts`

- [ ] **步骤 1：编写失败测试**

```ts
import { describe, expect, it } from 'vitest';
import { isTargetReached, normalizeAngleDelta } from './rotation';

describe('normalizeAngleDelta', () => {
  it('保留普通相邻角度差', () => expect(normalizeAngleDelta(20)).toBe(20));
  it('从 179° 到 -179° 时得到顺时针 2°', () => expect(normalizeAngleDelta(-358)).toBe(2));
  it('从 -179° 到 179° 时得到逆时针 -2°', () => expect(normalizeAngleDelta(358)).toBe(-2));
});

describe('isTargetReached', () => {
  it.each([25, 30, 35])('接受容差内角度 %s°', (angle) => expect(isTargetReached(angle)).toBe(true));
  it.each([24.9, 35.1, -30])('拒绝容差外角度 %s°', (angle) => expect(isTargetReached(angle)).toBe(false));
});
```

- [ ] **步骤 2：运行测试并确认红灯**

运行：`npm test -- --run src/rotation.test.ts`

预期：FAIL，原因是 `./rotation` 模块不存在。

- [ ] **步骤 3：编写最少实现**

```ts
import { ANGLE_TOLERANCE, TARGET_ANGLE } from './config';

export function normalizeAngleDelta(delta: number) {
  if (delta > 180) return delta - 360;
  if (delta < -180) return delta + 360;
  return delta;
}

export function isTargetReached(angle: number) {
  return angle >= TARGET_ANGLE - ANGLE_TOLERANCE && angle <= TARGET_ANGLE + ANGLE_TOLERANCE;
}
```

- [ ] **步骤 4：运行测试并确认绿灯**

运行：`npm test -- --run src/rotation.test.ts`

预期：6 个测试全部通过。

- [ ] **步骤 5：提交角度算法**

运行：`git add src/config.ts src/rotation.ts src/rotation.test.ts && git commit -m "feat: 实现连续旋转角度算法"`

### 任务 3：以 TDD 实现页面流程与旋钮交互

**文件：**
- 创建：`src/App.test.tsx`
- 创建：`src/App.tsx`
- 创建：`src/components/Knob.tsx`

- [ ] **步骤 1：编写介绍页与主流程失败测试**

```tsx
it('从介绍页进入任务并显示初始进度', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: '开始任务' }));
  expect(screen.getByText('1 / 10')).toBeInTheDocument();
  expect(screen.getByRole('slider', { name: '旋转控制旋钮' })).toBeInTheDocument();
});
```

- [ ] **步骤 2：运行测试并确认红灯**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，原因是 `App` 尚未导出可用页面。

- [ ] **步骤 3：实现最小三态页面和 Knob 接口**

`Knob` 接收 `onComplete` 与 `disabled`；按下时记录边界框中心和原始角度，移动时累加归一化差值，松手时使用 `isTargetReached` 判断。成功后调用 `onComplete(totalAngle)`，失败时保留当前轮累计值。

- [ ] **步骤 4：补充累计与不复位集成测试**

用 PointerEvent 模拟两段约 15° 的拖动，断言第一次松手不推进、第二次松手出现“完成”，并使用假定时器推进 350ms 后断言进度变为 `2 / 10` 且旋钮的 `aria-valuenow` 保持约 30。

- [ ] **步骤 5：运行组件测试并确认绿灯**

运行：`npm test -- --run src/App.test.tsx`

预期：介绍页、累计拖动、进度推进和保持总角度测试全部通过。

- [ ] **步骤 6：提交页面交互**

运行：`git add src/App.tsx src/App.test.tsx src/components/Knob.tsx && git commit -m "feat: 完成旋钮任务交互"`

### 任务 4：实现视觉样式与响应式

**文件：**
- 创建：`src/styles.css`
- 修改：`src/App.tsx`
- 修改：`src/components/Knob.tsx`

- [ ] **步骤 1：添加已确认的视觉结构**

使用 900px 内容容器、约 600×420px 自适应实验卡片、156px 双层旋钮、短指针、中心点及八个 CSS 细线方向标记；设置固定高度反馈区域避免布局跳动。

- [ ] **步骤 2：添加交互细节**

旋钮添加 `cursor: grab/grabbing`、`touch-action: none`；成功态在约 300ms 内加深外边框；按钮仅增加轻微颜色和位移反馈。

- [ ] **步骤 3：添加窄屏规则**

在 680px 以下缩减页面边距和卡片高度，卡片宽度保持 `width: 100%`，确保无横向溢出。

- [ ] **步骤 4：运行自动化测试与构建**

运行：`npm test -- --run`

预期：全部测试通过。

运行：`npm run build`

预期：TypeScript 与 Vite 构建退出码为 0。

- [ ] **步骤 5：提交视觉实现**

运行：`git add src/styles.css src/App.tsx src/components/Knob.tsx && git commit -m "style: 完成实验页面视觉设计"`

### 任务 5：浏览器验收

**文件：**
- 仅在发现问题时修改相关实现和测试文件。

- [ ] **步骤 1：启动项目**

运行：`npm run dev -- --host 127.0.0.1`

预期：Vite 输出本地访问地址且无启动错误。

- [ ] **步骤 2：检查完整流程**

在浏览器中点击开始，实际拖动旋钮，检查普通拖动、跨 ±180°、松手续拖、成功后不复位、10 次后完成页、重新开始。

- [ ] **步骤 3：检查响应式与控制台**

分别检查桌面宽度和窄窗口，确认无横向溢出、无控制台错误。

- [ ] **步骤 4：执行最终验证**

运行：`npm test -- --run && npm run build`

预期：测试零失败，构建退出码为 0。
