# Formily Grid 响应式网格布局使用文档

## 简介

Formily Grid 是一个用于创建响应式网格布局的工具库，它能够根据容器宽度、断点设置和各种配置选项自动调整网格列数和元素布局。这个库特别适合需要在不同屏幕尺寸下自适应的表单或布局系统。

## 核心功能

- 响应式布局：根据容器宽度自动调整网格列数
- 断点系统：支持多断点响应式设计
- 自动调整元素跨度：根据可用空间智能调整元素跨度
- DOM 变化监听：自动响应子元素的添加、删除和属性变化
- 尺寸变化监听：响应容器尺寸变化并重新计算布局

## 安装

```bash
npm install @formily/grid
```

或

```bash
yarn add @formily/grid
```

## 基本用法

```typescript
import { Grid } from '@formily/grid'

// 创建网格实例
const grid = new Grid({
  // 配置选项
  breakpoints: [720, 1280, 1920],
  columnGap: 10,
  rowGap: 5,
  minWidth: 100,
  maxWidth: 300
})

// 连接到容器元素
const container = document.querySelector('#grid-container')
const dispose = grid.connect(container)

// 不再需要时清理资源
// dispose()
```

## 配置选项

`Grid` 构造函数接受一个 `IGridOptions` 对象，包含以下配置项：

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `maxRows` | `number` | `Infinity` | 最大行数 |
| `maxColumns` | `number \| number[]` | `Infinity` | 最大列数，可以为数组以对应不同断点 |
| `minColumns` | `number \| number[]` | `1` | 最小列数，可以为数组以对应不同断点 |
| `maxWidth` | `number \| number[]` | `Infinity` | 列的最大宽度，可以为数组以对应不同断点 |
| `minWidth` | `number \| number[]` | `100` | 列的最小宽度，可以为数组以对应不同断点 |
| `breakpoints` | `number[]` | `[720, 1280, 1920]` | 断点宽度数组 |
| `columnGap` | `number \| number[]` | `8` | 列间距，可以为数组以对应不同断点 |
| `rowGap` | `number \| number[]` | `4` | 行间距，可以为数组以对应不同断点 |
| `colWrap` | `boolean \| boolean[]` | `true` | 是否允许列换行，可以为数组以对应不同断点 |
| `strictAutoFit` | `boolean` | `false` | 是否严格按照配置的宽度限制自动适应 |
| `shouldVisible` | `(node: GridNode, grid: Grid<HTMLElement>) => boolean` | - | 自定义元素可见性的函数 |
| `onDigest` | `(grid: Grid<HTMLElement>) => void` | - | 布局计算完成后的回调 |
| `onInitialized` | `(grid: Grid<HTMLElement>) => void` | - | 网格初始化完成后的回调 |

每个子元素在网格中被表示为一个 `GridNode` 对象，包含以下属性：

```typescript
interface GridNode {
  index?: number // 节点索引
  visible?: boolean // 是否可见
  column?: number // 列位置
  shadowColumn?: number // 包含不可见元素时的列位置
  row?: number // 行位置
  shadowRow?: number // 包含不可见元素时的行位置
  span?: number // 当前跨度
  originSpan?: number // 原始跨度
  element?: HTMLElement // DOM 元素
}
```

## Grid实例属性

`Grid` 实例提供了多个计算属性，可用于获取网格的当前状态：

- `width`：容器宽度
- `height`：容器高度
- `columns`：当前列数
- `rows`：当前行数
- `templateColumns`：CSS grid-template-columns 值
- `gap`：CSS gap 值
- `breakpoint`：当前断点索引
- 以及其他配置属性的计算值

## 元素跨度设置

可以通过设置元素的 `data-grid-span` 属性来指定元素的跨度：

```html
<div id="grid-container">
  <div data-grid-span="1">跨度为1</div>
  <div data-grid-span="2">跨度为2</div>
  <div data-grid-span="3">跨度为3</div>
</div>
```

## 监听机制

该库使用两种观察者来实现响应式功能：

1. `ChildListMutationObserver`：监听子元素的变化（添加、删除、属性修改）
2. `ResizeObserver`：监听容器尺寸变化

当这些变化发生时，网格会自动重新计算布局。

## 示例

### 基本响应式网格

```html
<div id="grid-container" style="width: 100%;">
  <div data-grid-span="1">Item 1</div>
  <div data-grid-span="2">Item 2</div>
  <div data-grid-span="1">Item 3</div>
  <div data-grid-span="3">Item 4</div>
</div>

<script>
import { Grid } from '@formily/grid'

const grid = new Grid({
  breakpoints: [576, 768, 992, 1200],
  columnGap: 16,
  rowGap: 16,
  minWidth: 120,
  maxWidth: 300
})

grid.connect(document.getElementById('grid-container'))
</script>
```

### 自定义可见性

```typescript
const grid = new Grid({
  shouldVisible: (node, grid) => {
    // 在小屏幕上隐藏某些元素
    if (grid.width < 768 && node.originSpan > 2) {
      return false
    }
    return true
  }
})
```

### 监听网格变化

```typescript
const grid = new Grid({
  onDigest: (grid) => {
    console.log('网格已更新', {
      columns: grid.columns,
      rows: grid.rows,
      width: grid.width
    })
  },
  onInitialized: (grid) => {
    console.log('网格已初始化')
  }
})
```

## 高级用法

### 断点响应式配置

可以为多个属性提供数组值，对应不同断点下的配置：

```typescript
const grid = new Grid({
  breakpoints: [576, 768, 992, 1200],
  minColumns: [1, 2, 3, 4], // 不同断点下的最小列数
  maxWidth: [200, 250, 300, 350], // 不同断点下的最大列宽
  columnGap: [8, 12, 16, 20] // 不同断点下的列间距
})
```

### 动态更新配置

可以在运行时更新网格配置：

```typescript
// 更新列间距
grid.columnGap = 20

// 更新断点
grid.breakpoints = [600, 900, 1200, 1600]

// 更新最大列数
grid.maxColumns = [2, 4, 6, 8]
```

## 注意事项

1. 确保容器元素具有明确的宽度，可以是固定值或百分比
2. 如果使用严格自动适应模式 (`strictAutoFit: true`)，元素可能不会完全按照指定的跨度显示
3. 当容器宽度变化或子元素添加/删除时，网格会自动重新计算布局

## 性能优化

对于包含大量子元素的网格，可以考虑以下优化：

1. 限制最大行数和列数
2. 在不需要网格时调用 `dispose()` 函数释放资源
3. 避免频繁更改配置选项
