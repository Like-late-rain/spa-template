import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import {
  counterActionsAtom,
  counterAtom,
  doubleCountAtom,
  todoListAtom,
  userAtom,
} from '@/stores/demoAtoms';

/**
 * Jotai 状态管理演示组件
 */
const JotaiDemo = () => {
  // 方式1：使用 useAtom - 同时获取值和更新函数
  const [user, setUser] = useAtom(userAtom);

  // 方式2：使用 useAtomValue - 只读取值
  const counter = useAtomValue(counterAtom);
  const doubleCount = useAtomValue(doubleCountAtom);

  // 方式3：使用 useSetAtom - 只获取更新函数
  const dispatchCounter = useSetAtom(counterActionsAtom);
  const setCounter = useSetAtom(counterAtom);

  // 使用 jotai-immer 的 atom
  const [todoList, setTodoList] = useAtom(todoListAtom);

  useEffect(() => {
    console.log('JotaiDemo 渲染');
    // console.trace('渲染调用栈');
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold gradient-text">Jotai 状态管理演示</h1>

      {/* 用户信息示例 */}
      <div className="glass p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">1. 基础对象状态</h2>
        <div className="space-y-4">
          <div className="text-gray-300">
            <p>姓名: {user.name}</p>
            <p>年龄: {user.age}</p>
            <p>邮箱: {user.email}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="px-4 py-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan rounded-lg transition"
              onClick={() => {
                // ✅ 正确：创建新对象
                setUser({
                  ...user,
                  age: user.age + 1,
                });
              }}
            >
              年龄 +1
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple rounded-lg transition"
              onClick={() => {
                setUser({
                  ...user,
                  name: user.name === '张三' ? '李四' : '张三',
                });
              }}
            >
              切换姓名
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue rounded-lg transition"
              onClick={() => {
                setUser({
                  name: '张三',
                  age: 25,
                  email: 'zhangsan@example.com',
                });
              }}
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 计数器示例 */}
      <div className="glass p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">2. 派生状态 (Derived State)</h2>
        <div className="space-y-4">
          <div className="text-gray-300">
            <p className="text-2xl">
              计数: <span className="text-cyber-cyan font-bold">{counter.count}</span>
            </p>
            <p className="text-lg">
              双倍值: <span className="text-cyber-purple">{doubleCount}</span>
            </p>
            <p className="text-sm text-gray-400">步长: {counter.step}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              className="px-4 py-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan rounded-lg transition"
              onClick={() => dispatchCounter('increment')}
            >
              +{counter.step}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple rounded-lg transition"
              onClick={() => dispatchCounter('decrement')}
            >
              -{counter.step}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue rounded-lg transition"
              onClick={() => dispatchCounter('reset')}
            >
              重置
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded-lg transition"
              onClick={() => {
                setCounter({
                  ...counter,
                  step: counter.step === 1 ? 5 : 1,
                });
              }}
            >
              切换步长 (当前: {counter.step})
            </button>
          </div>
        </div>
      </div>

      {/* Jotai-Immer 示例 */}
      <div className="glass p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">
          3. Jotai-Immer (简化复杂对象更新)
        </h2>
        <div className="space-y-4">
          {/* 设置区域 */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              type="button"
              className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded text-sm transition"
              onClick={() => {
                // ✅ 使用 Immer: 直接修改 draft 对象，Immer 会自动创建新对象
                setTodoList((draft) => {
                  draft.settings.showCompleted = !draft.settings.showCompleted;
                });

                // ❌ 普通方式需要这样写（更繁琐）:
                // setTodoList({
                //   ...todoList,
                //   settings: {
                //     ...todoList.settings,
                //     showCompleted: !todoList.settings.showCompleted,
                //   },
                // });
              }}
            >
              {todoList.settings.showCompleted ? '隐藏' : '显示'}已完成
            </button>

            <button
              type="button"
              className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 rounded text-sm transition"
              onClick={() => {
                setTodoList((draft) => {
                  draft.settings.sortBy =
                    draft.settings.sortBy === 'priority' ? 'date' : 'priority';
                });
              }}
            >
              排序: {todoList.settings.sortBy === 'priority' ? '优先级' : '日期'}
            </button>

            <button
              type="button"
              className="px-3 py-1 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue rounded text-sm transition"
              onClick={() => {
                // 添加新待办事项
                setTodoList((draft) => {
                  const newId = Math.max(...draft.todos.map((t) => t.id), 0) + 1;
                  draft.todos.push({
                    id: newId,
                    text: `新任务 #${newId}`,
                    completed: false,
                    priority: 'low',
                    tags: ['新建'],
                  });
                });
              }}
            >
              添加任务
            </button>
          </div>

          {/* 待办事项列表 */}
          <div className="space-y-2">
            {todoList.todos
              .filter((todo) => todoList.settings.showCompleted || !todo.completed)
              .map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {
                      // ✅ Immer 方式: 直接修改数组中的元素
                      setTodoList((draft) => {
                        const item = draft.todos.find((t) => t.id === todo.id);
                        if (item) {
                          item.completed = !item.completed;
                        }
                      });

                      // ❌ 普通方式需要这样写:
                      // setTodoList({
                      //   ...todoList,
                      //   todos: todoList.todos.map((t) =>
                      //     t.id === todo.id ? { ...t, completed: !t.completed } : t
                      //   ),
                      // });
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span
                      className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          todo.priority === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : todo.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {todo.priority}
                      </span>
                      {todo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition"
                    onClick={() => {
                      // ✅ Immer 方式: 直接 filter 数组
                      setTodoList((draft) => {
                        draft.todos = draft.todos.filter((t) => t.id !== todo.id);
                      });

                      // ❌ 普通方式:
                      // setTodoList({
                      //   ...todoList,
                      //   todos: todoList.todos.filter((t) => t.id !== todo.id),
                      // });
                    }}
                  >
                    删除
                  </button>
                  <select
                    value={todo.priority}
                    onChange={(e) => {
                      setTodoList((draft) => {
                        const item = draft.todos.find((t) => t.id === todo.id);
                        if (item) {
                          item.priority = e.target.value as 'low' | 'medium' | 'high';
                        }
                      });
                    }}
                    className="px-2 py-1 bg-black/40 text-gray-300 rounded text-sm border border-white/10"
                  >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                  </select>
                </div>
              ))}
          </div>

          {/* Immer 优势说明 */}
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 font-bold mb-2">✨ Jotai-Immer 的优势：</p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 无需使用扩展运算符 (...) 创建新对象</li>
              <li>• 可以直接修改 draft 对象，代码更简洁易读</li>
              <li>• 特别适合深层嵌套的对象和数组更新</li>
              <li>• 自动处理不可变性，减少错误</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div className="glass p-6 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold text-cyber-cyan mb-4">使用说明</h2>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <span className="text-cyber-cyan">✓</span> <strong>useAtom</strong>: 获取值 + 更新函数
            (类似 useState)
          </p>
          <p>
            <span className="text-cyber-purple">✓</span> <strong>useAtomValue</strong>: 只读取值
          </p>
          <p>
            <span className="text-cyber-blue">✓</span> <strong>useSetAtom</strong>: 只获取更新函数
          </p>
          <p>
            <span className="text-green-400">✓</span> <strong>atomWithImmer</strong>: 使用 Immer
            简化复杂对象更新
          </p>
          <p className="pt-2 border-t border-white/10">
            <span className="text-yellow-400">⚠</span> <strong>注意</strong>:
            更新对象时要创建新对象，不要直接修改原对象（使用 Immer 除外）
          </p>
        </div>
      </div>
    </div>
  );
};

export default JotaiDemo;
