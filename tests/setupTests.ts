// Jest 测试环境配置文件
// 这个文件会在所有测试运行前自动执行

// 引入 Jest DOM 扩展，提供额外的断言方法
// 例如: expect(element).toBeInTheDocument()
import '@testing-library/jest-dom';

// Mock window.matchMedia（很多组件库需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 过时的方法
    removeListener: jest.fn(), // 过时的方法
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ethereum（MetaMask）
const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true,
};

Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: mockEthereum,
});

// Mock console 方法以减少测试输出噪音（可选）
// 如果你想看到 console 输出，可以注释掉这部分
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // 过滤掉一些已知的无害警告
  console.error = (...args: any[]) => {
    // 过滤 React 的某些警告
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    // 过滤掉一些常见的警告
    if (typeof args[0] === 'string' && args[0].includes('componentWillReceiveProps')) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  // 恢复原始的 console 方法
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// 设置测试超时时间（默认 5 秒）
jest.setTimeout(10000);

// Mock 环境变量
process.env.REACT_APP_API_BASE_URL = 'http://localhost:3000';

// 全局测试工具函数
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// 每个测试后清理
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
