# 点击固定旋转交互实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将旋钮从自由拖动改为每次点击固定顺时针旋转 30°，并优化任务页视觉层次。

**架构：** `Knob` 改用原生 `button`，内部保存累计角度；一次激活立即增加 `TARGET_ANGLE` 并进入 350ms 成功锁定。`App` 保持三态流程，仅调整提示文案和进度呈现。

**技术栈：** React、TypeScript、Vite、Vitest、Testing Library、原生 CSS。

---

### 任务 1：用测试定义点击行为

**文件：**
- 修改：`src/App.test.tsx`

- [ ] **步骤 1：将拖动测试替换为点击测试**

```tsx
it('每次点击固定旋转 30°，反馈期间忽略重复点击', () => {
  vi.useFakeTimers();
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '开始任务' }));
  const knob = screen.getByRole('button', { name: '旋转中央旋钮' });
  fireEvent.click(knob);
  fireEvent.click(knob);
  expect(knob).toHaveAttribute('aria-valuenow', '30');
  act(() => vi.advanceTimersByTime(350));
  expect(screen.getByText('2 / 10')).toBeInTheDocument();
});
```

- [ ] **步骤 2：运行测试确认红灯**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，现有控件角色仍为 `slider`，不存在名为“旋转中央旋钮”的按钮。

### 任务 2：实现点击固定旋转

**文件：**
- 修改：`src/components/Knob.tsx`
- 修改：`src/App.tsx`
- 修改：`src/config.ts`
- 删除：`src/rotation.ts`
- 删除：`src/rotation.test.ts`

- [ ] **步骤 1：用原生按钮替代拖动容器**

按钮激活时执行 `totalAngle + TARGET_ANGLE`，显示“完成”，设置 350ms 锁定；定时结束后调用 `onComplete`。按钮暴露 `aria-valuenow` 供状态验证。

- [ ] **步骤 2：更新页面文案**

任务提示改为“请点击中央旋钮，完成本次任务。”，目标说明改为“每次点击顺时针旋转 30°”。

- [ ] **步骤 3：运行测试确认绿灯**

运行：`npm test -- --run src/App.test.tsx`

预期：点击、重复点击锁定、进度推进和累计角度测试全部通过。

### 任务 3：视觉优化和完整流程验证

**文件：**
- 修改：`src/styles.css`
- 修改：`src/App.test.tsx`

- [ ] **步骤 1：优化视觉**

增加克制的进度轨道、旋钮 hover/active 状态和点击提示徽标；删除抓取光标和拖动相关样式。

- [ ] **步骤 2：测试十次点击与重新开始**

使用假定时器连续执行十次点击与反馈等待，断言出现“任务完成”；点击“重新开始”后断言进度为 `1 / 10` 且角度为 0。

- [ ] **步骤 3：浏览器与构建验证**

运行：`npm test -- --run` 与 `npm run build`。浏览器中实际点击十次，确认每次固定增加 30°、重复点击锁定、结束页和窄屏无溢出。
