// Jest 测试框架配置文件
// Jest 是 JavaScript 的单元测试框架，用于测试你的代码是否按预期工作

module.exports = {
  // testEnvironment: 测试运行环境
  // jsdom 提供浏览器环境模拟，用于测试 React 组件
  testEnvironment: 'jsdom',

  // testMatch: 定义哪些文件会被视为测试文件
  // 这里匹配所有以 .spec.js、.test.js、.spec.jsx、.test.jsx 结尾的文件
  // 例如：app.test.js, user.spec.jsx 等都会被识别为测试文件
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],

  // setupFilesAfterEnv: 在每个测试文件运行之前执行的配置文件
  // 通常用于设置全局的测试环境，比如配置测试库、添加自定义匹配器等
  // <rootDir> 代表项目根目录
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],

  // rootDir: 项目根目录路径
  // 空字符串表示使用 jest.config.js 所在的目录作为根目录
  // 可以设置为具体路径，如 "./src"
  rootDir: '',

  // transform: 代码转换器配置
  // 告诉 Jest 如何转换不同类型的文件
  // 这里配置：所有 .ts 和 .tsx 文件使用 @swc/jest 进行转换
  // SWC 是一个快速的 TypeScript/JavaScript 编译器
  transform: {
    '.(ts|tsx)': '@swc/jest',
  },

  // moduleNameMapper: 模块路径映射
  // 用于将导入路径映射到实际的文件路径
  // 这里配置了所有 webpack 中定义的路径别名
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@layouts(.*)$': '<rootDir>/src/layouts$1',
    '^@routes(.*)$': '<rootDir>/src/routes$1',
    '^@assets(.*)$': '<rootDir>/src/assets$1',
    '^@states(.*)$': '<rootDir>/src/states$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@lib(.*)$': '<rootDir>/src/lib$1',
    '^@constants(.*)$': '<rootDir>/src/constants$1',
    '^@connections(.*)$': '<rootDir>/src/connections$1',
    '^@stores(.*)$': '<rootDir>/src/stores$1',
    '^@abis(.*)$': '<rootDir>/src/abis$1',
    '^@types(.*)$': '<rootDir>/src/types$1',
    // Mock CSS 和图片文件
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|woff|woff2|eot|ttf|otf)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
  },

  reporters: [
    'default', // 保留默认的命令行输出
    [
      'jest-stare', // 使用 jest-stare 生成 HTML 报告
      {
        resultDir: './docs/jest-stare', // 输出到 docs 目录
        reportTitle: '测试报告', // 报告标题
        reportHeadline: 'Jest 测试结果', // 报告标题
        reportSummary: true, // 显示摘要
        coverageLink: '../jest-coverage/index.html', // 链接到覆盖率报告
      },
    ],
  ],

  // coverageThreshold: 代码覆盖率阈值
  // 设置测试必须达到的最低覆盖率要求，低于此值测试将失败
  coverageThreshold: {
    global: {
      branches: 50, // 分支覆盖率至少 50%（if/else 等分支）
      functions: 95, // 函数覆盖率至少 95%（所有函数都被测试）
      lines: 95, // 行覆盖率至少 95%（代码行被执行）
      statements: 95, // 语句覆盖率至少 95%（所有语句被执行）
    },
  },

  // watchAll: 是否监视所有文件的变化
  // false 表示不自动监视，需要手动运行测试
  // 设为 true 会在文件改变时自动重新运行测试
  watchAll: false,

  // collectCoverage: 是否收集代码覆盖率信息
  // true 表示运行测试时会生成覆盖率报告
  // 覆盖率显示哪些代码被测试执行了，哪些没有
  collectCoverage: true,

  // coverageDirectory: 覆盖率报告的输出目录
  // 测试完成后，覆盖率报告（HTML等格式）会保存在这个目录
  coverageDirectory: './docs/jest-coverage',

  // coveragePathIgnorePatterns: 计算覆盖率时忽略的文件/目录
  // 这些目录下的文件不会被包含在覆盖率统计中
  // 通常忽略 node_modules（第三方库）和测试文件本身
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],

  // moduleFileExtensions: Jest 识别的文件扩展名
  // Jest 会按这个顺序查找模块文件
  // 支持 TypeScript (.ts, .tsx)、JavaScript (.js, .jsx)、JSON 和 Node 模块
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
