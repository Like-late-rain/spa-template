import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

/**
 * 用户信息对象状态
 */
export interface UserInfo {
  name: string;
  age: number;
  email: string;
}

// 创建一个对象状态的 atom
export const userAtom = atom<UserInfo>({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
});

/**
 * 计数器对象状态
 */
export interface CounterState {
  count: number;
  step: number;
}

export const counterAtom = atom<CounterState>({
  count: 0,
  step: 1,
});

export const blank = atom<number>(1);

/**
 * 派生 atom - 只读
 * 基于 counterAtom 计算双倍值
 */
export const doubleCountAtom = atom((get) => get(counterAtom).count * 2);

/**
 * 派生 atom - 可写
 * 提供便捷的增减方法
 */
export const counterActionsAtom = atom(
  (get) => get(counterAtom),
  (get, set, action: 'increment' | 'decrement' | 'reset') => {
    const current = get(counterAtom);
    switch (action) {
      case 'increment':
        set(counterAtom, { ...current, count: current.count + current.step });
        break;
      case 'decrement':
        set(counterAtom, { ...current, count: current.count - current.step });
        break;
      case 'reset':
        set(counterAtom, { count: 0, step: 1 });
        break;
    }
  }
);

/**
 * 使用 jotai-immer 管理复杂嵌套对象
 * 待办事项列表示例
 */
export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TodoListState {
  todos: TodoItem[];
  filter: 'all' | 'active' | 'completed';
  settings: {
    showCompleted: boolean;
    sortBy: 'priority' | 'date';
  };
}

// 使用 atomWithImmer 创建支持 Immer 的 atom
export const todoListAtom = atomWithImmer<TodoListState>({
  todos: [
    {
      id: 1,
      text: '学习 Jotai',
      completed: true,
      priority: 'high',
      tags: ['学习', '前端'],
    },
    {
      id: 2,
      text: '学习 Immer',
      completed: false,
      priority: 'high',
      tags: ['学习', '状态管理'],
    },
    {
      id: 3,
      text: '构建项目',
      completed: false,
      priority: 'medium',
      tags: ['工作'],
    },
  ],
  filter: 'all',
  settings: {
    showCompleted: true,
    sortBy: 'priority',
  },
});
