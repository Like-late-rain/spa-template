/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';

// Why Did You Render (WDYR) 配置
// 用于检测 React 组件的不必要重新渲染，帮助优化性能
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    // 追踪所有使用 React.memo 包裹的纯组件
    // 当这些组件因相同的 props 重新渲染时会发出警告
    trackAllPureComponents: true,

    // 追踪 React Hooks 的变化
    // 检测 useState, useReducer, useContext 等 Hook 的不必要更新
    trackHooks: true,

    // 追踪额外的自定义 Hooks
    // 例如 Redux 的 useSelector 或 React Router 的 useParams
    trackExtraHooks: [
      // 如果使用 Redux，取消下面的注释
      // [require('react-redux/lib'), 'useSelector'],
    ],

    // 当组件因不同的 props/state 值重新渲染时记录详细信息
    // 显示新旧值的对比，便于调试
    // logOnDifferentValues: true,

    // 在控制台中折叠日志分组，使输出更简洁
    // false: 展开所有日志 | true: 折叠日志分组
    // collapseGroups: true,

    // 记录所有者组件的层级结构
    // 帮助理解组件重新渲染的原因（父组件触发）
    // logOwnerReasons: true,

    // 只追踪特定的组件（可选）
    // 如果不设置，则根据 trackAllPureComponents 决定
    // include: [/^MyComponent/],

    // 排除不想追踪的组件（可选）
    // exclude: [/^SomeLibraryComponent/],

    // 自定义通知函数（可选）
    // 可以将日志发送到其他地方，如日志服务
    // notifier: (groupByMessages) => {
    //   // 自定义日志处理逻辑
    // },

    // 只在组件挂载时通知，而不是每次重新渲染
    onlyLogs: true,

    // 为 React 元素添加显示名称，便于调试
    titleColor: 'green',
    diffNameColor: 'darkturquoise',
  });
}
