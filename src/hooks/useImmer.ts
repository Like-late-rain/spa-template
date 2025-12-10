/**
 * 从 immer 库导入三个核心函数：
 * - Draft: 类型定义，表示可以直接修改的"草稿"对象
 * - freeze: 冻结对象，防止被意外修改
 * - produce: 基于当前状态生成新状态的核心函数
 */
import type { Draft } from 'immer';
import { freeze, produce } from 'immer';
/**
 * 从 React 导入两个 Hook：
 * - useCallback: 用于缓存函数，避免不必要的重新创建
 * - useState: React 的状态管理 Hook
 */
import { useCallback, useState } from 'react';

/**
 * DraftFunction 类型定义
 * 这是一个函数类型，接收一个 draft（草稿）参数，可以直接修改它
 * S 是泛型参数，代表状态的类型
 * 例如：(draft) => { draft.name = "新名字" }
 */
export type DraftFunction<S> = (draft: Draft<S>) => void;

/**
 * Updater 类型定义
 * 这是更新函数的类型，可以接收两种参数：
 * 1. 直接传入新的状态值（类型为 S）
 * 2. 传入一个函数（类型为 DraftFunction<S>），在函数中修改草稿
 */
export type Updater<S> = (ags: S | DraftFunction<S>) => void;

/**
 * ImmerHook 类型定义
 * 这是 useImmer Hook 返回值的类型，是一个数组（元组）：
 * [0]: 当前状态值（类型为 S）
 * [1]: 更新函数（类型为 Updater<S>）
 * 类似于 useState 返回的 [state, setState]
 */
export type ImmerHook<S> = [S, Updater<S>];

/**
 * useImmer Hook 的函数重载声明
 * 这允许 initialValue 可以是一个值或者一个返回值的函数
 */
export function useImmer<S>(initialValue: S | (() => S)): ImmerHook<S>;

/**
 * useImmer - 结合 immer 库的 React 状态管理 Hook
 *
 * 作用：提供一种更简单的方式来更新复杂的状态对象
 * 你可以直接修改状态的"草稿"，而不需要手动创建新对象
 *
 * @param initialValue - 初始状态值，可以是一个值或者返回值的函数
 * @returns 返回一个数组 [当前状态, 更新函数]
 *
 * 使用示例：
 * const [person, updatePerson] = useImmer({ name: "张三", age: 25 });
 *
 * // 方式1：传入函数，直接修改草稿
 * updatePerson(draft => { draft.age = 26 });
 *
 * // 方式2：直接传入新的状态值
 * updatePerson({ name: "李四", age: 30 });
 */
export function useImmer<T>(initialValue: T) {
  // 使用 useState 创建状态
  const [value, updateValue] = useState(
    // freeze() 冻结初始值，防止被意外修改
    freeze(
      // 如果 initialValue 是函数，就调用它获取初始值；否则直接使用它
      typeof initialValue === 'function' ? initialValue() : initialValue,
      // true 表示深度冻结（递归冻结所有嵌套对象）
      true
    )
  );

  // 返回一个数组，包含当前状态值和更新函数
  return [
    value, // 当前状态值

    // useCallback 缓存更新函数，避免每次渲染都创建新函数
    // 第二个参数 [] 表示这个函数永远不会改变
    useCallback((updater: T | DraftFunction<T>) => {
      // 判断传入的参数是函数还是直接的值
      if (typeof updater === 'function') {
        // 如果是函数，使用 produce 创建新状态
        // produce 会：
        // 1. 创建当前状态的草稿（draft）
        // 2. 把草稿传给 updater 函数
        // 3. 根据对草稿的修改生成新的不可变状态
        updateValue(produce(updater as DraftFunction<T>));
      } else {
        // 如果是直接的值，就直接更新状态
        updateValue(updater);
      }
    }, []), // 空依赖数组意味着这个函数只会创建一次
  ];
}
