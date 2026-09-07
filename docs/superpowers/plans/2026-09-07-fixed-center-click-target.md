# 固定中央点击区实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将随指针旋转的点击目标改为表盘中心固定的约 110px 圆形点击区。

**架构：** `ClockDial` 将视觉指针与交互按钮分离：指针仅接受角度和警告颜色，中心按钮始终固定并调用现有 `onActivate`。`App` 保留文字同步改为“中央区域”，其他计时状态机保持不变。

**技术栈：** React 19、TypeScript、原生 CSS、Vitest、Testing Library

---

### 任务 1：用失败测试锁定固定点击行为

**文件：**
- 修改：`src/App.test.tsx`

- [ ] **步骤 1：将启动目标改为中央区域**

测试通过 `aria-label="将鼠标移到中央区域并按空格键开始"` 获取固定起始区域，并验证悬停后空格启动。

- [ ] **步骤 2：将旋转操作改为中央区域**

```tsx
const centerControl = screen.getByRole('button', { name: '点击中央区域' });
fireEvent.click(centerControl);
expect(screen.getByTestId('clock-hand')).toHaveAttribute('data-angle', '90');
expect(centerControl).toHaveAttribute('aria-valuenow', '90');
```

- [ ] **步骤 3：运行测试验证失败**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，因为当前按钮仍随指针旋转且标签为“旋转指针”。

### 任务 2：分离固定按钮与旋转指针

**文件：**
- 修改：`src/components/ClockDial.tsx`
- 修改：`src/App.tsx`
- 修改：`src/styles.css`

- [ ] **步骤 1：调整组件结构**

将 `--clock-angle` 和 `data-angle` 放到无交互的 `.clock-hand-visual` 上；新增固定的 `.clock-center-control` 按钮，直径 110px、居中、点击调用 `onActivate`。

- [ ] **步骤 2：同步介绍页文案与启动热区**

把“点击指针”和“鼠标移到指针上”分别改为“点击表盘中央区域”和“鼠标移到表盘中央区域”。起始模式的悬停事件绑定到固定中央操作区。

- [ ] **步骤 3：调整视觉层级**

指针位于背景层，中心按钮位于其上方但背景默认透明；悬停时仅出现低对比浅灰圆面。警告状态仍只改变指针颜色。

- [ ] **步骤 4：运行测试验证通过**

运行：`npm test -- --run`

预期：全部测试 PASS，原有两阶段警告与五分钟结束测试继续通过。

### 任务 3：最终验证

**文件：**
- 检查：`src/App.tsx`
- 检查：`src/components/ClockDial.tsx`
- 检查：`src/styles.css`
- 检查：`dist/`

- [ ] **步骤 1：生产构建**

运行：`npm run build`

预期：退出码 0，产物生成到 `dist`。

- [ ] **步骤 2：浏览器检查**

刷新本地页面，验证鼠标可以固定停在圆心连续点击，指针依次旋转 90°，无需追随指针。

> 根据项目所有者要求，本计划不执行 `git commit` 或 `git push`。
