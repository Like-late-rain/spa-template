# 📚 SPA 项目命令文档

## 🚀 开发与构建命令

### `yarn client:dev`

**开发模式构建**

使用 webpack 进行开发环境打包，生成未压缩的代码，方便调试。

```bash
yarn client:dev
```

**使用场景：** 当你只想打包一次，不需要热重载时使用

---

### `yarn client:prod`

**生产模式构建**

使用 webpack 进行生产环境打包，代码会被压缩优化，生成最小体积的文件。

```bash
yarn client:prod
```

**使用场景：** 部署上线前使用，会在 `dist` 目录生成优化后的文件

---

### `yarn client:server` ⭐️

**启动开发服务器（推荐）**

启动 webpack-dev-server，支持热更新（修改代码自动刷新浏览器）。

```bash
yarn client:server
```

**使用场景：** 日常开发时使用，最常用的命令

**开发流程：**

```bash
# 启动开发服务器
yarn client:server

# 浏览器访问 http://localhost:8080
# 修改代码后会自动刷新
```

---

## 🧪 测试命令

### `yarn test`

**运行单元测试**

执行 `tests/unit` 目录下的所有测试，并生成代码覆盖率报告。

```bash
yarn test
```

**使用场景：** CI/CD 流程中，或提交代码前验证功能

---

### `yarn test:e2e`

**端到端测试**

打开 Cypress 测试工具，可以在浏览器中进行可视化测试。

```bash
yarn test:e2e
```

**使用场景：** 测试完整的用户交互流程

---

### `yarn client:test:watch`

**监听模式测试**

持续监听文件变化，自动运行相关测试。

```bash
yarn client:test:watch
```

**使用场景：** 编写测试代码时使用，实时查看测试结果

---

### `yarn client:test:coverage`

**生成测试覆盖率**

运行测试并生成详细的代码覆盖率报告。

```bash
yarn client:test:coverage
```

**使用场景：** 了解测试覆盖情况，找出未测试的代码

---

## ✨ 代码质量命令

### `yarn lint`

**代码检查**

使用 Biome 检查代码质量问题（语法错误、潜在 bug、代码风格等）。

```bash
yarn lint
```

**使用场景：** 查看代码中存在的问题

---

### `yarn lint:fix`

**自动修复代码问题**

Biome 会自动修复可以修复的代码问题。

```bash
yarn lint:fix
```

**使用场景：** 提交代码前快速修复简单问题

---

### `yarn format`

**格式化代码**

使用 Prettier 格式化所有 TypeScript、JavaScript、JSON、CSS、Markdown 文件。

```bash
yarn format
```

**使用场景：** 统一代码风格

**格式化的文件类型：**

- `src/**/*.ts`
- `src/**/*.tsx`
- `src/**/*.js`
- `src/**/*.jsx`
- `src/**/*.json`
- `src/**/*.css`
- `src/**/*.md`

---

### `yarn format:check`

**检查代码格式**

检查代码格式是否符合 Prettier 规范，不会修改文件。

```bash
yarn format:check
```

**使用场景：** CI 流程中检查代码格式

---

### `yarn check`

**完整检查**

同时运行 `lint` 和 `format:check`，检查所有代码质量问题。

```bash
yarn check
```

**使用场景：** 提交前全面检查

**等价于：**

```bash
yarn lint && yarn format:check
```

---

### `yarn check:fix` ⭐️

**自动修复所有问题（推荐）**

同时运行 `lint:fix` 和 `format`，自动修复所有可修复的问题。

```bash
yarn check:fix
```

**使用场景：** 提交代码前使用，一键修复所有问题

**等价于：**

```bash
yarn lint:fix && yarn format
```

---

## 🔧 Git Hooks 命令

### `yarn prepare`

**初始化 Husky**

安装 Git hooks，确保提交代码前自动运行检查。

```bash
yarn prepare
```

**使用场景：** 第一次克隆项目后自动运行（通过 `npm install` 或 `yarn install` 触发）

**Git Hooks 工作原理：**

- 当你 `git commit` 时，会自动运行 `lint-staged`
- `lint-staged` 只检查你修改的文件（不是全部文件）
- 自动运行 `biome check --write` 和 `prettier --write`
- 如果有错误，提交会被阻止

---

## 📋 快速参考

### 日常开发三板斧

```bash
# 1️⃣ 启动开发服务器
yarn client:server

# 2️⃣ 修改代码...
# （编辑器中修改代码，浏览器会自动刷新）

# 3️⃣ 提交前修复代码问题
yarn check:fix
git add .
git commit -m "feat: 添加新功能"
```

---

### 完整的开发流程

```bash
# 1️⃣ 启动开发服务器
yarn client:server

# 2️⃣ 开发过程中运行测试（可选，新开一个终端）
yarn client:test:watch

# 3️⃣ 提交前检查和修复
yarn check:fix
yarn test

# 4️⃣ 提交代码（会自动触发 lint-staged）
git add .
git commit -m "feat: 新功能"

# 5️⃣ 部署前生产构建
yarn client:prod
```

---

### 测试工作流

```bash
# 开发时持续测试
yarn client:test:watch

# 提交前检查覆盖率
yarn client:test:coverage

# 端到端测试
yarn test:e2e
```

---

## 🆚 命令对比

### `yarn client:dev` vs `yarn client:server`

| 命令            | 功能           | 热重载          | 推荐场景        |
| --------------- | -------------- | --------------- | --------------- |
| `client:dev`    | 打包一次       | ❌ 需要手动刷新 | 只想打包测试    |
| `client:server` | 启动开发服务器 | ✅ 自动刷新     | **日常开发** ⭐️ |

---

### `yarn lint` vs `yarn format`

| 工具                | 功能         | 检查内容                     |
| ------------------- | ------------ | ---------------------------- |
| `lint` (Biome)      | 代码质量检查 | 语法错误、潜在 bug、代码逻辑 |
| `format` (Prettier) | 代码格式化   | 缩进、空格、换行、引号       |

**两者互补，都很重要！**

---

### 一键命令

| 命令             | 等价于                           | 说明                |
| ---------------- | -------------------------------- | ------------------- |
| `yarn check`     | `yarn lint && yarn format:check` | 检查所有问题        |
| `yarn check:fix` | `yarn lint:fix && yarn format`   | **修复所有问题** ⭐️ |

---

## 💡 最佳实践

### ✅ 推荐的工作流

```bash
# 每天开始工作
yarn client:server

# 提交代码前
yarn check:fix
yarn test
git commit -m "your message"

# 部署前
yarn client:prod
```

---

### ❌ 常见错误

**错误 1：提交代码前没有运行 `yarn check:fix`**

```bash
# ❌ 直接提交，可能有代码质量问题
git commit -m "fix bug"

# ✅ 先修复问题再提交
yarn check:fix
git add .
git commit -m "fix bug"
```

**错误 2：用 `client:dev` 而不是 `client:server` 开发**

```bash
# ❌ 每次修改都要重新运行命令
yarn client:dev

# ✅ 启动开发服务器，自动刷新
yarn client:server
```

**错误 3：忘记运行测试**

```bash
# ❌ 只修复格式，不运行测试
yarn check:fix
git commit

# ✅ 确保测试通过
yarn check:fix
yarn test
git commit
```

---

## 🔍 故障排查

### 问题：`yarn client:server` 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8080

# 杀死进程
kill -9 <PID>
```

---

### 问题：Git hooks 没有生效

```bash
# 重新初始化 Husky
yarn prepare

# 检查 .husky 目录是否存在
ls -la .husky
```

---

### 问题：测试失败

```bash
# 清除 Jest 缓存
yarn test --clearCache

# 重新运行测试
yarn test
```

---

## 📚 相关文档

- [Webpack 官方文档](https://webpack.js.org/)
- [Biome 官方文档](https://biomejs.dev/)
- [Prettier 官方文档](https://prettier.io/)
- [Jest 官方文档](https://jestjs.io/)
- [Cypress 官方文档](https://www.cypress.io/)
- [Husky 官方文档](https://typicode.github.io/husky/)

---

## 📝 备注

- 本文档基于 `package.json` 中的脚本生成
- 所有命令都可以用 `npm run` 替代 `yarn`，例如 `npm run client:server`
- 建议使用 `yarn` 以保持与项目配置一致

---

**最后更新：** 2025-12-23
**维护者：** 东方美人
