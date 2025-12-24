# 测试文档

本项目包含完整的测试套件，涵盖单元测试、组件测试和 E2E 测试。

## 📦 安装测试依赖

在运行测试之前，请先安装必要的依赖：

```bash
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom identity-obj-proxy
```

或使用 npm：

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom identity-obj-proxy
```

## 🧪 测试文件结构

```
tests/
├── unit/                      # 单元测试和组件测试
│   ├── userApi.spec.ts       # API 调用测试
│   ├── web3Atoms.spec.ts     # Jotai 状态管理测试
│   ├── profile.spec.tsx      # Profile 组件测试
│   └── index.spec.ts         # 示例测试
├── e2e/                       # E2E 端到端测试
│   ├── wallet-login.spec.ts  # 钱包登录流程测试
│   └── google.spec.js        # 示例 E2E 测试
├── __mocks__/                 # Mock 文件
│   └── fileMock.js           # 静态资源 mock
├── setupTests.ts             # 测试环境配置
└── README.md                 # 本文档
```

## 🚀 运行测试

### 运行所有单元测试

```bash
yarn test
```

### 监听模式（开发时推荐）

```bash
yarn test:watch
```

### 生成覆盖率报告

```bash
yarn test:coverage
```

覆盖率报告会生成在 `docs/jest-coverage/index.html`，用浏览器打开即可查看。

### 运行单个测试文件

```bash
# 只测试 userApi
yarn test userApi

# 只测试 web3Atoms
yarn test web3Atoms

# 只测试 Profile 组件
yarn test profile
```

## 📊 测试覆盖率要求

当前配置的覆盖率要求（jest.config.js）：

- **分支覆盖率**: 50%
- **函数覆盖率**: 95%
- **代码行覆盖率**: 95%
- **语句覆盖率**: 95%

如果测试覆盖率低于这些阈值，测试将失败。

## 📝 测试说明

### 1. userApi 测试 (tests/unit/userApi.spec.ts)

测试 API 调用功能：

- ✅ 钱包登录成功/失败
- ✅ 获取用户信息
- ✅ 更新用户信息
- ✅ 签名验证
- ✅ 错误处理

**运行**: `yarn test userApi`

### 2. web3Atoms 测试 (tests/unit/web3Atoms.spec.ts)

测试 Jotai 状态管理：

- ✅ 钱包连接（connectWalletAtom）
- ✅ 自动重连（autoConnectWalletAtom）
- ✅ 余额刷新（refreshWalletAtom, refreshYCTBalanceAtom）
- ✅ 合约实例创建
- ✅ 用户状态管理

**运行**: `yarn test web3Atoms`

### 3. Profile 组件测试 (tests/unit/profile.spec.tsx)

测试个人中心页面：

- ✅ 用户信息渲染
- ✅ 编辑功能
- ✅ 课程标签页切换
- ✅ 余额显示
- ✅ 错误处理

**运行**: `yarn test profile`

### 4. E2E 测试 (tests/e2e/wallet-login.spec.ts)

端到端测试（需要 Playwright）：

- ✅ 完整的钱包连接流程
- ✅ 用户注册/登录
- ✅ 个人资料编辑
- ✅ API 集成测试

**运行 E2E 测试**:

首先安装 Playwright：

```bash
yarn add -D @playwright/test
npx playwright install
```

然后运行：

```bash
npx playwright test tests/e2e/wallet-login.spec.ts
```

**注意**: E2E 测试需要启动开发服务器：

```bash
# 终端 1: 启动前端
yarn client:server

# 终端 2: 启动后端
cd ../koa-mpa && yarn dev

# 终端 3: 运行测试
npx playwright test
```

## 🔧 配置文件说明

### jest.config.js

Jest 主配置文件，包含：

- 测试环境设置（jsdom）
- 路径别名映射
- 覆盖率配置
- 文件转换规则

### setupTests.ts

测试环境初始化文件，自动执行：

- Mock window.ethereum（MetaMask）
- Mock window.matchMedia
- Mock localStorage/sessionStorage
- 设置全局测试工具

## 🎯 最佳实践

### 1. 编写新测试

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. Mock API 调用

```typescript
import * as userApi from '@/services/userApi';

jest.mock('@/services/userApi');

(userApi.walletLogin as jest.Mock).mockResolvedValue({
  id: '123',
  username: 'test',
});
```

### 3. 测试异步操作

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('加载完成')).toBeInTheDocument();
});
```

## 🐛 常见问题

### 问题 1: "Cannot find module '@/...' "

**解决**: 确保 jest.config.js 中的 moduleNameMapper 配置正确，并且路径别名与 webpack.config.js 一致。

### 问题 2: "ReferenceError: window is not defined"

**解决**: 确保 jest.config.js 中设置了 `testEnvironment: "jsdom"`。

### 问题 3: "fetch is not defined"

**解决**: 在测试中 mock fetch：

```typescript
global.fetch = jest.fn();
```

### 问题 4: 组件测试报错 "Not implemented: HTMLFormElement.prototype.submit"

**解决**: 这是 jsdom 的已知限制，可以在 setupTests.ts 中忽略这个警告。

## 📚 参考资料

- [Jest 官方文档](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright 文档](https://playwright.dev/)
- [Jotai 测试指南](https://jotai.org/docs/guides/testing)

## 🎉 测试报告

运行测试后，会生成两份报告：

1. **HTML 测试报告**: `docs/jest-stare/index.html`
2. **覆盖率报告**: `docs/jest-coverage/index.html`

用浏览器打开即可查看详细的测试结果和代码覆盖率。
