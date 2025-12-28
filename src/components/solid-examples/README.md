# SOLID 原则示例集合

本目录包含了SOLID五大设计原则的完整示例代码，每个原则都提供了好的和不好的案例对比，帮助理解和实践这些重要的面向对象设计原则。

## 什么是SOLID？

SOLID是由罗伯特·C·马丁（Robert C. Martin，又称Uncle Bob）在21世纪早期提出的面向对象编程和面向对象设计的五个基本原则的首字母缩略词。

这五个原则旨在使软件设计更易于理解、更灵活、更易于维护。

## SOLID五大原则

### 1. 🎯 单一职责原则 (Single Responsibility Principle - SRP)

**一个类应该只有一个引起它变化的原因。**

- **目录**: `1-single-responsibility/`
- **核心思想**: 每个模块、类或函数应该只做一件事，并把它做好
- **示例**: 用户信息组件拆分（数据获取、验证、格式化、UI展示）

```typescript
// ❌ 违反SRP：组件承担太多职责
class UserProfile {
  fetchData() {
    /* API调用 */
  }
  validateData() {
    /* 验证逻辑 */
  }
  formatDate() {
    /* 格式化 */
  }
  render() {
    /* UI渲染 */
  }
}

// ✅ 遵守SRP：职责分离
class UserApiService {
  fetchUser() {}
}
class UserValidator {
  validate() {}
}
class DateFormatter {
  format() {}
}
function UserProfile() {
  /* 只负责UI */
}
```

**何时应用**: 当一个组件/类有多个修改它的理由时

---

### 2. 🔓 开闭原则 (Open-Closed Principle - OCP)

**软件实体应该对扩展开放，对修改封闭。**

- **目录**: `2-open-closed/`
- **核心思想**: 通过扩展代码来适应新需求，而不是修改已有代码
- **示例**: 通知系统（邮件、短信、推送等通知类型）

```typescript
// ❌ 违反OCP：每次添加新类型都要修改
function getNotificationIcon(type: string) {
  switch (type) {
    case 'email': return <MailIcon />;
    case 'sms': return <SmsIcon />;
    // 添加新类型需要修改这里 ❌
  }
}

// ✅ 遵守OCP：配置化设计
const notificationConfigs = {
  email: { icon: MailIcon, ... },
  sms: { icon: SmsIcon, ... },
  // 添加新类型只需添加配置 ✅
};
```

**何时应用**: 当需要频繁添加新类型/变体时

---

### 3. 🔄 里氏替换原则 (Liskov Substitution Principle - LSP)

**子类型必须能够替换掉它们的基类型。**

- **目录**: `3-liskov-substitution/`
- **核心思想**: 子类必须能够完全替换父类，并且保持程序的行为不变
- **示例**: 图形系统（正方形不应继承矩形）

```typescript
// ❌ 违反LSP：Square改变了Rectangle的行为
class Rectangle {
  setWidth(w) {
    this.width = w;
  }
  setHeight(h) {
    this.height = h;
  }
}

class Square extends Rectangle {
  setWidth(w) {
    this.width = w;
    this.height = w;
  } // 改变了行为 ❌
}

// ✅ 遵守LSP：使用接口而非继承
interface Shape {
  getArea(): number;
}
class Rectangle implements Shape {
  /* ... */
}
class Square implements Shape {
  /* ... */
}
```

**何时应用**: 设计继承关系时，确保子类真正能替换父类

---

### 4. ✂️ 接口隔离原则 (Interface Segregation Principle - ISP)

**客户端不应该被迫依赖它不使用的方法。**

- **目录**: `4-interface-segregation/`
- **核心思想**: 使用多个专门的接口，而不是单一的总接口
- **示例**: 多功能打印机（打印、扫描、传真等功能）

```typescript
// ❌ 违反ISP：臃肿的接口
interface MultiFunctionDevice {
  print();
  scan();
  fax();
  copy();
  email();
}

class SimplePrinter implements MultiFunctionDevice {
  print() {
    /* 打印 */
  }
  scan() {
    throw new Error();
  } // 被迫实现 ❌
  fax() {
    throw new Error();
  } // 被迫实现 ❌
}

// ✅ 遵守ISP：拆分接口
interface Printable {
  print();
}
interface Scannable {
  scan();
}

class SimplePrinter implements Printable {
  print() {
    /* 只实现需要的 */
  }
}
```

**何时应用**: 当接口方法较多，且不同客户端需要不同方法子集时

---

### 5. 🔁 依赖反转原则 (Dependency Inversion Principle - DIP)

**高层模块不应该依赖低层模块，两者都应该依赖抽象。**

- **目录**: `5-dependency-inversion/`
- **核心思想**: 依赖于抽象而非具体实现，通过依赖注入实现解耦
- **示例**: 通知服务（邮件、短信等通知方式）

```typescript
// ❌ 违反DIP：直接依赖具体实现
class UserService {
  private emailService = new EmailService(); // 紧耦合 ❌

  notify(user: User) {
    this.emailService.send(user.email);
  }
}

// ✅ 遵守DIP：依赖抽象和依赖注入
interface NotificationService {
  send(recipient: string, message: string): void;
}

class UserService {
  constructor(private notificationService: NotificationService) {} // 依赖注入 ✅

  notify(user: User, message: string) {
    this.notificationService.send(user.email, message);
  }
}
```

**何时应用**: 当需要解耦、易于测试、可替换实现时

---

## 目录结构

```
solid-examples/
├── README.md                          # 本文件
├── 1-single-responsibility/           # 单一职责原则
│   ├── bad.tsx                       # ❌ 违反SRP的示例
│   ├── good.tsx                      # ✅ 遵守SRP的示例
│   └── README.md                     # 详细说明
├── 2-open-closed/                    # 开闭原则
│   ├── bad.tsx
│   ├── good.tsx
│   └── README.md
├── 3-liskov-substitution/            # 里氏替换原则
│   ├── bad.tsx
│   ├── good.tsx
│   └── README.md
├── 4-interface-segregation/          # 接口隔离原则
│   ├── bad.tsx
│   ├── good.tsx
│   └── README.md
└── 5-dependency-inversion/           # 依赖反转原则
    ├── bad.tsx
    ├── good.tsx
    └── README.md
```

## 如何使用这些示例

### 1. 学习顺序（推荐）

建议按照以下顺序学习SOLID原则：

1. **SRP** - 最基础，理解职责分离
2. **OCP** - 理解如何设计可扩展的代码
3. **DIP** - 理解依赖管理和解耦
4. **ISP** - 理解接口设计
5. **LSP** - 理解继承的正确使用（较难）

### 2. 对比学习

每个原则都包含bad.tsx和good.tsx两个文件：

- **bad.tsx**: 展示违反该原则的代码，理解"反面教材"
- **good.tsx**: 展示遵守该原则的代码，学习最佳实践
- **README.md**: 详细解释原则、问题分析、解决方案

### 3. 运行示例

```bash
# 在你的React项目中导入并使用
import UserProfileBad from '@/components/solid-examples/1-single-responsibility/bad';
import UserProfileGood from '@/components/solid-examples/1-single-responsibility/good';

// 在你的页面中使用
<UserProfileBad />
<UserProfileGood />
```

### 4. 实践建议

- 📖 先阅读README理解原则
- 👀 查看bad.tsx，识别问题
- ✨ 查看good.tsx，学习解决方案
- 🔍 对比两者，理解差异
- 💡 在自己的项目中应用

## SOLID原则的关系

SOLID五大原则不是孤立的，它们相互支持，共同构建高质量的软件设计：

```
        SRP (基础)
         ↓
    职责明确后才能...
         ↓
    ┌────┴────┐
    ↓         ↓
   OCP       ISP
    ↓         ↓
  扩展性   接口设计
    ↓         ↓
    └────┬────┘
         ↓
        DIP
         ↓
      解耦和灵活性
         ↓
        LSP
         ↓
     正确的多态
```

### 原则之间的关系：

- **SRP是基础** - 职责分离是其他原则的前提
- **OCP依赖DIP** - 依赖抽象使扩展更容易
- **ISP支持SRP** - 小接口体现单一职责
- **LSP支持OCP** - 正确的继承使多态更安全
- **DIP整合一切** - 依赖抽象是松耦合的关键

## 在React/TypeScript中应用SOLID

### React组件设计

```typescript
// ✅ 遵守多个SOLID原则
interface UserDataProps {
  userId: string;
  userService: UserService;  // DIP: 依赖注入
}

function UserData({ userId, userService }: UserDataProps) {  // ISP: 只接收需要的props
  const { user, loading } = useUserData(userId, userService);  // SRP: 逻辑分离到hook

  if (loading) return <Loading />;
  return <UserDisplay user={user} />;  // SRP: UI分离到独立组件
}
```

### 自定义Hooks

```typescript
// ✅ SRP: 每个hook只负责一件事
function useUserData(userId: string, service: UserService) {
  // 只负责数据获取
}

function useUserValidation(user: User) {
  // 只负责验证
}

function useUserFormatter(user: User) {
  // 只负责格式化
}
```

### 类型设计

```typescript
// ✅ ISP: 拆分接口
interface Readable {
  read(): Promise<Data>;
}

interface Writable {
  write(data: Data): Promise<void>;
}

// 组合使用
type ReadWrite = Readable & Writable;
```

## 何时应用SOLID？

### ✅ 适合应用的场景

- 中大型项目
- 需要长期维护的代码
- 团队协作开发
- 频繁变化的需求
- 需要高可测试性

### ⚠️ 可以适当放宽的场景

- 小型/原型项目
- 一次性脚本
- 简单的工具函数
- 明确不会扩展的代码

### 平衡原则

> **YAGNI**: You Aren't Gonna Need It（你不会需要它）
>
> **KISS**: Keep It Simple, Stupid（保持简单）

不要过度设计！应该在"遵守原则"和"保持简单"之间找到平衡。

## 识别代码异味（Code Smells）

以下是违反SOLID原则的常见信号：

### 🚨 违反SRP

- 类名很难命名（需要用"和"来描述）
- 一个类有多个修改的理由
- 类代码超过200行

### 🚨 违反OCP

- 每次添加新功能都要修改现有代码
- 充满if-else或switch语句
- 类型检查（instanceof）

### 🚨 违反LSP

- 子类抛出父类不会抛出的异常
- 需要类型检查才能使用
- 子类方法是空实现

### 🚨 违反ISP

- 接口方法超过5个
- 实现类有大量空实现
- 注释说"此方法仅在XX情况下使用"

### 🚨 违反DIP

- 类内部直接new其他类
- import具体实现而非抽象
- 无法进行单元测试

## 重构策略

当发现违反SOLID原则时，可以采用以下重构策略：

### 1. 提取方法/类 (SRP)

```typescript
// Before: 一个方法做太多事
function processUser() {
  // fetch data
  // validate
  // transform
  // save
}

// After: 拆分成多个方法
function fetchUserData() {}
function validateUser() {}
function transformUser() {}
function saveUser() {}
```

### 2. 策略模式 (OCP)

```typescript
// Before: switch语句
function calculate(type: string) {
  switch (type) {
    case 'A':
      return calcA();
    case 'B':
      return calcB();
  }
}

// After: 策略模式
const strategies = {
  A: calcA,
  B: calcB,
};

function calculate(type: string) {
  return strategies[type]();
}
```

### 3. 依赖注入 (DIP)

```typescript
// Before: 直接创建依赖
class Service {
  private db = new Database();
}

// After: 注入依赖
class Service {
  constructor(private db: Database) {}
}
```

## 总结

### SOLID的核心价值

1. **提高代码质量** - 更易理解、维护、测试
2. **降低耦合度** - 模块间独立性更强
3. **提高扩展性** - 容易添加新功能
4. **减少bug** - 修改的影响范围更小

### 记住这些原则

- **S**: 一个类一个职责
- **O**: 扩展开放，修改关闭
- **L**: 子类可替换父类
- **I**: 小接口优于大接口
- **D**: 依赖抽象，注入依赖

### 最重要的建议

> SOLID是指导原则，不是严格规则。
>
> 在实际开发中，要根据具体情况灵活应用，
>
> 在"遵守原则"和"保持简单"之间找到平衡。

---

## 参考资源

### 推荐阅读

- 《Clean Code》 by Robert C. Martin
- 《Agile Software Development》 by Robert C. Martin
- 《Head First Design Patterns》

### 在线资源

- [SOLID Principles Explained](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/)
- [Refactoring.Guru - Design Patterns](https://refactoring.guru/design-patterns)

---

**Happy Coding! 🚀**

如果你有任何问题或建议，欢迎提issue或PR！
