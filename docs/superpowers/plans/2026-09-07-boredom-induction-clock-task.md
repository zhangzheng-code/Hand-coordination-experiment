# 无聊诱发钟表点击任务实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将八圆盘任务改造成单表盘无聊诱发范式，支持空格启动、90°点击旋转、两阶段无操作退出和隐藏的五分钟结束。

**架构：** `App` 管理页面状态、总任务计时器和无操作警告状态，`ClockDial` 只负责渲染四刻度表盘及上报交互。所有时长和旋转步长集中在 `config.ts`，计时器通过 React effect 创建并在依赖变化或卸载时清理。

**技术栈：** React 19、TypeScript、Vite、原生 CSS、Vitest、Testing Library

---

## 文件结构

- 创建 `src/components/ClockDial.tsx`：单一四刻度钟表和可点击指针。
- 修改 `src/App.tsx`：介绍页空格启动、任务流程、双计时器和结束页。
- 修改 `src/config.ts`：90°、30 秒和 5 分钟配置。
- 修改 `src/styles.css`：介绍页、表盘、警告指针和响应式样式。
- 修改 `src/App.test.tsx`：覆盖完整实验状态机。
- 删除 `src/components/Knob.tsx`、`src/components/KnobGrid.tsx`：移除八圆盘实现。

### 任务 1：建立新流程的失败测试

**文件：**
- 修改：`src/App.test.tsx`

- [ ] **步骤 1：替换介绍页和启动行为测试**

测试应断言完整说明出现、没有开始按钮、普通空格无效，以及在起始指针触发 `mouseEnter` 后空格进入任务。

```tsx
render(<App />);
expect(screen.queryByRole('button', { name: '开始任务' })).not.toBeInTheDocument();
fireEvent.keyDown(window, { code: 'Space' });
expect(screen.queryByLabelText('实验钟表')).not.toBeInTheDocument();
fireEvent.mouseEnter(screen.getByLabelText('将鼠标移到指针上并按空格键开始'));
fireEvent.keyDown(window, { code: 'Space' });
expect(screen.getByLabelText('实验钟表')).toBeInTheDocument();
```

- [ ] **步骤 2：添加旋转、警告和结束测试**

使用假计时器断言点击后的角度、第一次 30 秒警告、警告后点击恢复、第二次 30 秒结束，以及持续点击时五分钟结束。

```tsx
act(() => vi.advanceTimersByTime(INACTIVITY_LIMIT_MS));
expect(pointer).toHaveClass('clock-hand--warning');
fireEvent.click(pointer);
expect(pointer).not.toHaveClass('clock-hand--warning');
act(() => vi.advanceTimersByTime(INACTIVITY_LIMIT_MS));
expect(screen.getByText('感谢您参与本次实验！')).toBeInTheDocument();
```

- [ ] **步骤 3：运行测试并验证失败**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，因为新表盘和空格启动尚未实现。

### 任务 2：实现配置与单表盘组件

**文件：**
- 修改：`src/config.ts`
- 创建：`src/components/ClockDial.tsx`
- 删除：`src/components/Knob.tsx`
- 删除：`src/components/KnobGrid.tsx`

- [ ] **步骤 1：集中实验参数**

```ts
export const ROTATION_STEP = 90;
export const INACTIVITY_LIMIT_MS = 30 * 1000;
export const TASK_DURATION_MS = 5 * 60 * 1000;
```

- [ ] **步骤 2：创建受控钟表组件**

组件接口固定为：

```ts
type ClockDialProps = {
  angle?: number;
  warning?: boolean;
  startTarget?: boolean;
  onActivate?: () => void;
  onHoverChange?: (hovered: boolean) => void;
};
```

任务模式渲染一个 `aria-label="旋转指针"` 的按钮，点击调用 `onActivate`；起始模式渲染不可点击但能报告悬停状态的目标。SVG/CSS 只表现圆形边框、四个线刻度、中心轴和一根指针。

- [ ] **步骤 3：运行组件相关测试**

运行：`npm test -- --run src/App.test.tsx`

预期：App 流程测试仍失败，但新组件可被导入且 TypeScript 无组件错误。

### 任务 3：实现页面状态与计时器

**文件：**
- 修改：`src/App.tsx`

- [ ] **步骤 1：实现介绍页空格启动**

维护 `startTargetHovered`；仅当页面为介绍页且该值为真时，窗口 `keydown` 的 `Space` 才切换为任务页。effect 必须移除监听器。

- [ ] **步骤 2：实现指针累计旋转**

每次点击执行：

```ts
setAngle((current) => current + ROTATION_STEP);
setWarningVisible(false);
setInactivityCycle((current) => current + 1);
```

其中 `inactivityCycle` 仅用于可靠重启 30 秒计时器，第一次警告记录独立保留。

- [ ] **步骤 3：实现两个独立计时器**

总计时器只在进入任务页时启动一次，五分钟后切换结束页。无操作计时器在进入任务或每次点击后启动；第一次触发设置 `hasWarned=true` 和 `warningVisible=true`，第二次触发切换结束页。所有 timeout 都返回清理函数。

- [ ] **步骤 4：实现无按钮结束页**

结束页仅渲染 `感谢您参与本次实验！`，不显示结束原因或任何交互控件。

- [ ] **步骤 5：运行完整测试**

运行：`npm test -- --run`

预期：全部测试 PASS。

### 任务 4：完成低刺激视觉样式

**文件：**
- 修改：`src/styles.css`

- [ ] **步骤 1：删除八圆盘与可见时间样式**

移除 `.knob-grid`、`.knob-item`、`.knob`、`.task-meta` 等不再使用的规则。

- [ ] **步骤 2：实现介绍页与单表盘布局**

介绍页使用不超过 760px 的白色卡片；任务页让 280–340px 表盘在视口中央附近呈现。四个刻度为细灰线，指针为深色线段和圆心。

- [ ] **步骤 3：实现警告和响应式状态**

`.clock-hand--warning` 使用低饱和暗红色；小于 680px 时缩小表盘和页面内边距，确保没有横向滚动。

### 任务 5：最终验证

**文件：**
- 检查：`src/App.tsx`
- 检查：`src/components/ClockDial.tsx`
- 检查：`src/styles.css`
- 检查：`dist/`

- [ ] **步骤 1：扫描禁止出现的时间和旧界面文本**

运行：`rg -n "约 5 分钟|任务时长|1 / 10|重新开始|开始任务" src`

预期：业务页面中无匹配；测试中的否定断言允许出现。

- [ ] **步骤 2：运行自动化测试**

运行：`npm test -- --run`

预期：所有测试通过，0 failures。

- [ ] **步骤 3：运行生产构建**

运行：`npm run build`

预期：退出码 0，`dist/index.html` 和带哈希的 CSS/JS 文件生成。

- [ ] **步骤 4：浏览器检查**

检查介绍页空格启动、90°旋转、首次警告颜色、结束页文案以及窄屏不溢出。计时逻辑由假计时器自动化测试验证，不在浏览器中实际等待五分钟。

> 根据项目所有者要求，本计划不执行 `git commit` 或 `git push`。
