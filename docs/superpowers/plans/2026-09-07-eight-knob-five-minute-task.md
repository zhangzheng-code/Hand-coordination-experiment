# 八圆盘五分钟任务实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将单圆盘十轮任务改为 8 个独立圆盘持续点击 5 分钟的低认知负荷任务。

**架构：** `App` 只管理介绍、任务、结束三态及一个可清理的 5 分钟定时器；`KnobGrid` 根据集中配置渲染 8 个圆盘；每个 `Knob` 独立保存累计角度并在点击时增加 90°。

**技术栈：** React、TypeScript、Vite、Vitest、Testing Library、原生 CSS。

---

### 任务 1：用测试定义八圆盘行为

**文件：**
- 修改：`src/App.test.tsx`

- [ ] **步骤 1：编写失败测试**

```tsx
it('显示八个独立圆盘且单击只旋转对应圆盘 90°', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '开始任务' }));
  const knobs = screen.getAllByRole('button', { name: /旋转圆盘/ });
  expect(knobs).toHaveLength(8);
  fireEvent.click(knobs[2]);
  expect(knobs[2]).toHaveAttribute('aria-valuenow', '90');
  expect(knobs[0]).toHaveAttribute('aria-valuenow', '0');
});
```

- [ ] **步骤 2：运行测试确认红灯**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，现有页面只包含一个名为“旋转中央旋钮”的按钮。

### 任务 2：实现独立圆盘网格

**文件：**
- 修改：`src/config.ts`
- 修改：`src/components/Knob.tsx`
- 创建：`src/components/KnobGrid.tsx`
- 修改：`src/App.tsx`

- [ ] **步骤 1：集中配置常量**

```ts
export const KNOB_COUNT = 8;
export const ROTATION_STEP = 90;
export const TASK_DURATION_MS = 5 * 60 * 1000;
```

- [ ] **步骤 2：简化圆盘组件**

`Knob` 接收 `index`，点击时直接将本地角度增加 `ROTATION_STEP`；按钮名称为 `旋转圆盘 ${index}`，不锁定、不显示成功文字。

- [ ] **步骤 3：创建网格组件**

`KnobGrid` 使用 `Array.from({ length: KNOB_COUNT })` 渲染 8 个 `Knob`，容器类名为 `knob-grid`。

- [ ] **步骤 4：更新任务页面**

删除轮次状态、进度胶囊、进度轨道与单圆盘完成回调；显示静态 5 分钟说明和 `KnobGrid`。

- [ ] **步骤 5：运行测试确认绿灯**

运行：`npm test -- --run src/App.test.tsx`

预期：8 个圆盘存在，独立点击累计角度测试通过。

### 任务 3：实现五分钟自动结束

**文件：**
- 修改：`src/App.test.tsx`
- 修改：`src/App.tsx`

- [ ] **步骤 1：编写失败测试**

使用 Vitest 假定时器进入任务页，推进 `TASK_DURATION_MS - 1` 时断言仍在任务页，再推进 1ms 后断言显示“本次实验已结束”且页面没有按钮。

- [ ] **步骤 2：运行测试确认红灯**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，现有页面没有五分钟定时跳转。

- [ ] **步骤 3：实现定时器**

用 `useEffect` 仅在任务状态启动 `window.setTimeout`，到时设置结束状态；effect 清理函数调用 `window.clearTimeout`。

- [ ] **步骤 4：运行测试确认绿灯**

运行：`npm test -- --run src/App.test.tsx`

预期：五分钟边界、无按钮结束页测试通过。

### 任务 4：适配网格视觉并验证

**文件：**
- 修改：`src/styles.css`

- [ ] **步骤 1：设置网格和圆盘尺寸**

桌面端 `.knob-grid` 使用 4 列 × 2 行；圆盘使用紧凑尺寸与轻微 hover/active 反馈；删除方向环、成功反馈和进度相关样式。

- [ ] **步骤 2：设置窄屏布局**

680px 以下改为 2 列 × 4 行，卡片高度自动增长且无横向溢出。

- [ ] **步骤 3：完整验证**

运行：`npm test -- --run`、`npm run build`，并在浏览器中验证 8 个独立圆盘、90° 累计、隐藏计时和响应式布局。
