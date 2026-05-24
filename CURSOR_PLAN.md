# 化学实验室项目规划文档

## 项目概述
个人网站中的化学仿真实验室页面，参考 nobook 实验室实现用户手动拖拽器材进行实验的功能。

## 当前状态

### 已完成
- 基础页面结构 (chem-lab.html)
- Canvas 绘制系统 (js/chem-lab.js)
- 9个初中化学实验数据定义
- 器材绘制函数（烧杯、试管、锥形瓶、酒精灯等）
- 点击选择器材 + Canvas 放置的交互模式
- 试剂添加系统
- 酒精灯点燃/熄灭交互
- 反应检测系统（加热高锰酸钾产生氧气）
- 实验步骤跟踪

### 当前问题
**拖拽器材没反应** - 用户报告器材拖拽功能无法正常工作

## 问题分析

### 当前交互逻辑
1. 用户点击侧边栏器材 → 器材高亮选中
2. 用户在 Canvas 上点击 → 放置器材
3. 用户点击已放置器材 → 选中并可以拖拽

### 可能的问题点
1. `draggedItem` 状态管理可能有问题
2. `handleMouseDown` 中的逻辑分支可能冲突
3. `isDragging` 标志位可能没有正确设置
4. Canvas 事件监听可能有问题

### 关键代码位置
- js/chem-lab.js:730-795 `setupCanvasDragEvents()` - 事件绑定
- js/chem-lab.js:824-872 `handleMouseDown()` - 鼠标按下处理
- js/chem-lab.js:903-916 `handleMouseMove()` - 拖拽移动
- js/chem-lab.js:919-925 `handleMouseUp()` - 鼠标释放

## 待修复任务

### 高优先级
1. **修复拖拽功能**
   - 检查 `draggedItem` 是否正确设置
   - 验证 `isDragging` 状态转换
   - 确保 `handleMouseMove` 能正确更新位置
   - 添加调试日志追踪问题

2. **完善器材交互**
   - 添加器材选中视觉反馈（高亮边框）
   - 实现器材删除功能（右键或拖出边界）
   - 添加器材旋转功能（部分器材需要）

### 中优先级
3. **增强反应系统**
   - 完善更多实验的反应检测
   - 添加反应动画效果（气泡、颜色变化等）
   - 实现气体收集逻辑

4. **改进用户体验**
   - 添加器材连接功能（导管连接）
   - 实现器材组合（铁架台+试管夹+试管）
   - 添加实验提示引导

### 低优先级
5. **移动端适配**
   - 添加触摸事件支持
   - 优化小屏幕布局

6. **WebAssembly 集成**
   - 完成 wasm-chem 模块
   - 实现化学计算功能

## 文件结构

```
ApTx2012.github.io/
├── chem-lab.html          # 化学实验室页面
├── css/
│   ├── chem-lab.css       # 实验室专用样式
│   ├── style.css          # 全局样式
│   └── text-light.css     # 文字发光效果
├── js/
│   └── chem-lab.js        # 实验室主逻辑 (1476行)
└── wasm-chem/             # Rust WASM 模块
    ├── src/
    │   └── lib.rs         # 化学计算逻辑
    └── pkg/               # 编译输出
```

## 关键数据结构

### canvasItems
```javascript
{
  type: 'beaker',      // 器材类型
  x: 100,              // X坐标
  y: 200,              // Y坐标
  id: 123456,          // 唯一ID
  state: {             // 状态
    filled: true,      // 是否有液体
    liquidColor: '#8B008B',
    liquidLevel: 0.5,
    burning: false     // 是否点燃（酒精灯）
  }
}
```

### EQUIPMENT_TYPES
```javascript
{
  beaker: { name: '烧杯', width: 70, height: 90 },
  testtube: { name: '试管', width: 20, height: 90 },
  flask: { name: '锥形瓶', width: 70, height: 100 },
  burner: { name: '酒精灯', width: 40, height: 70 },
  // ...
}
```

## 调试建议

1. 在 `handleMouseDown`、`handleMouseMove`、`handleMouseUp` 中添加 console.log
2. 检查 `draggedItem` 和 `isDragging` 的状态变化
3. 验证 Canvas 的 bounding rect 是否正确
4. 确保事件监听器正确绑定

## 参考资料

- 参考网站: https://hx.nobook.com/chemical/new?moduleId=10
- 当前交互模式: 点击选择 → Canvas放置 → 拖拽调整
