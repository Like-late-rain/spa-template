# 依赖反转原则 (Dependency Inversion Principle - DIP)

## 定义

1. 高层模块不应该依赖低层模块，两者都应该依赖抽象
2. 抽象不应该依赖细节，细节应该依赖抽象

## 核心思想

- **依赖于抽象，而非具体实现**
- **通过依赖注入实现解耦**
- **控制反转（IoC）**

## 简单来说

不要直接创建依赖对象，而是通过接口和依赖注入的方式使用它们。

## 什么是"依赖反转"？

### 传统的依赖方向（❌ 错误）

```
高层模块 → 低层模块（具体实现）
```

### 反转后的依赖方向（✅ 正确）

```
高层模块 → 抽象 ← 低层模块
```

**关键**：依赖的方向从"向下"变成了"向上"（指向抽象），这就是"反转"的含义。

## 示例对比

### ❌ 不好的实践 (bad.tsx)

直接依赖具体实现：

```typescript
// ❌ 低层模块
class EmailService {
  sendEmail(to: string, message: string): void {
    /* ... */
  }
}

class SMSService {
  sendSMS(phone: string, message: string): void {
    /* ... */
  }
}

// ❌ 高层模块直接依赖低层具体实现
class UserService {
  // 直接创建实例，紧耦合
  private emailService = new EmailService();
  private smsService = new SMSService();

  notifyUser(email: string, phone: string, message: string): void {
    this.emailService.sendEmail(email, message);
    this.smsService.sendSMS(phone, message);
  }
}
```

**问题：**

- ❌ UserService紧耦合EmailService和SMSService
- ❌ 无法替换通知方式
- ❌ 难以测试（无法mock）
- ❌ 违反OCP（添加新通知方式要修改UserService）
- ❌ 依赖方向错误（高层依赖低层）

### ✅ 好的实践 (good.tsx)

依赖抽象和依赖注入：

```typescript
// ✅ 抽象层
interface NotificationService {
  send(recipient: string, message: string): void;
}

// ✅ 低层模块实现抽象
class EmailService implements NotificationService {
  send(email: string, message: string): void {
    /* ... */
  }
}

class SMSService implements NotificationService {
  send(phone: string, message: string): void {
    /* ... */
  }
}

// ✅ 高层模块依赖抽象
class UserService {
  // 依赖注入：通过构造函数注入抽象
  constructor(private notificationService: NotificationService) {}

  notifyUser(recipient: string, message: string): void {
    this.notificationService.send(recipient, message);
  }
}

// ✅ 使用时注入具体实现
const emailService = new EmailService();
const userService = new UserService(emailService);

// ✅ 可以轻松切换实现
const smsService = new SMSService();
const userService2 = new UserService(smsService);
```

**优点：**

- ✅ UserService依赖抽象NotificationService
- ✅ 可以注入任何实现
- ✅ 易于测试（注入Mock）
- ✅ 符合OCP（添加新实现不修改UserService）
- ✅ 依赖方向正确（都依赖抽象）

## DIP vs IoC vs DI

### 三者关系：

```
DIP（依赖反转原则）- 设计原则
    ↓
IoC（控制反转）- 设计思想
    ↓
DI（依赖注入）- 实现方式
```

### Dependency Inversion Principle (DIP)

- **是什么**：设计原则
- **核心**：依赖于抽象，而非具体实现

### Inversion of Control (IoC)

- **是什么**：设计思想
- **核心**：将控制权从调用者转移到框架/容器
- **示例**：对象创建由容器负责，而非自己new

### Dependency Injection (DI)

- **是什么**：实现IoC的技术手段
- **方式**：
  - 构造函数注入
  - Setter注入
  - 接口注入

## 依赖注入的三种方式

### 1. 构造函数注入（推荐）

```typescript
class UserService {
  constructor(private notificationService: NotificationService) {}
}

// 使用
const service = new UserService(new EmailService());
```

**优点：**

- ✅ 依赖明确，易于理解
- ✅ 保证依赖在对象创建时就已准备好
- ✅ 支持不可变性（final/readonly）

### 2. Setter注入

```typescript
class UserService {
  private notificationService?: NotificationService;

  setNotificationService(service: NotificationService): void {
    this.notificationService = service;
  }
}

// 使用
const service = new UserService();
service.setNotificationService(new EmailService());
```

**优点：**

- ✅ 可以在运行时更改依赖
- ✅ 可选依赖

**缺点：**

- ❌ 依赖可能未初始化
- ❌ 对象可能处于不完整状态

### 3. 属性注入（不推荐在TS/JS中使用）

```typescript
class UserService {
  @Inject()
  notificationService!: NotificationService;
}
```

## React中的DIP

### ❌ 违反DIP

```typescript
// ❌ 组件直接依赖具体实现
function UserProfile() {
  // 直接创建API服务
  const api = new UserApiService();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.fetchUser().then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}
```

**问题：**

- 无法在测试中使用Mock API
- 无法切换不同的数据源

### ✅ 遵守DIP

#### 方案1: Props注入

```typescript
interface UserProfileProps {
  userService: UserService; // 依赖抽象
}

function UserProfile({ userService }: UserProfileProps) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.fetchUser().then(setUser);
  }, [userService]);

  return <div>{user?.name}</div>;
}

// 使用
<UserProfile userService={new RealUserService()} />

// 测试
<UserProfile userService={new MockUserService()} />
```

#### 方案2: Context注入

```typescript
// 定义抽象
interface UserService {
  fetchUser(): Promise<User>;
}

// 创建Context
const UserServiceContext = createContext<UserService | null>(null);

// Provider组件
function UserServiceProvider({ children, service }: {
  children: React.ReactNode;
  service: UserService;
}) {
  return (
    <UserServiceContext.Provider value={service}>
      {children}
    </UserServiceContext.Provider>
  );
}

// 使用Hook注入
function useUserService() {
  const service = useContext(UserServiceContext);
  if (!service) throw new Error('UserService not provided');
  return service;
}

// 组件使用
function UserProfile() {
  const userService = useUserService(); // 注入
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.fetchUser().then(setUser);
  }, [userService]);

  return <div>{user?.name}</div>;
}

// 应用根组件
function App() {
  return (
    <UserServiceProvider service={new RealUserService()}>
      <UserProfile />
    </UserServiceProvider>
  );
}

// 测试
function TestApp() {
  return (
    <UserServiceProvider service={new MockUserService()}>
      <UserProfile />
    </UserServiceProvider>
  );
}
```

#### 方案3: 自定义Hook注入

```typescript
// 定义抽象
interface DataFetcher<T> {
  fetch(): Promise<T>;
}

// 通用Hook
function useData<T>(fetcher: DataFetcher<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetcher.fetch()
      .then(setData)
      .finally(() => setLoading(false));
  }, [fetcher]);

  return { data, loading };
}

// 组件使用
function UserList({ userFetcher }: { userFetcher: DataFetcher<User[]> }) {
  const { data: users, loading } = useData(userFetcher);

  if (loading) return <div>Loading...</div>;
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

## DIP的实际应用场景

### 1. 数据访问层

```typescript
// ❌ 直接依赖具体数据库
class UserRepository {
  private db = new MySQL();
  findById(id: string) { return this.db.query(...); }
}

// ✅ 依赖抽象
interface Database {
  query(sql: string): Promise<any>;
}

class UserRepository {
  constructor(private db: Database) {}
  findById(id: string) { return this.db.query(...); }
}
```

### 2. 日志系统

```typescript
// ❌ 直接依赖console
class OrderService {
  createOrder() {
    console.log('Creating order...');
  }
}

// ✅ 依赖抽象
interface Logger {
  log(message: string): void;
}

class OrderService {
  constructor(private logger: Logger) {}
  createOrder() {
    this.logger.log('Creating order...');
  }
}
```

### 3. 支付系统

```typescript
// ✅ 抽象
interface PaymentGateway {
  charge(amount: number): Promise<boolean>;
}

// 具体实现
class StripeGateway implements PaymentGateway {
  /* ... */
}
class PayPalGateway implements PaymentGateway {
  /* ... */
}
class AlipayGateway implements PaymentGateway {
  /* ... */
}

// 服务层
class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  processPayment(amount: number) {
    return this.gateway.charge(amount);
  }
}
```

## DIP的测试优势

### ❌ 难以测试

```typescript
class UserService {
  private api = new UserApiService(); // 硬编码依赖

  async getUser(id: string) {
    return this.api.fetchUser(id); // 总是调用真实API
  }
}

// 测试困难：必须mock全局fetch或使用真实API
```

### ✅ 易于测试

```typescript
interface UserApi {
  fetchUser(id: string): Promise<User>;
}

class UserService {
  constructor(private api: UserApi) {} // 依赖注入

  async getUser(id: string) {
    return this.api.fetchUser(id);
  }
}

// 测试简单：注入Mock
class MockUserApi implements UserApi {
  async fetchUser(id: string) {
    return { id, name: 'Test User' };
  }
}

// 测试
it('should get user', async () => {
  const mockApi = new MockUserApi();
  const service = new UserService(mockApi);

  const user = await service.getUser('123');

  expect(user.name).toBe('Test User');
});
```

## 如何识别违反DIP？

### 常见信号：

1. ❌ 类内部直接new其他类
2. ❌ 直接使用具体类型而非接口
3. ❌ import具体实现而非抽象
4. ❌ 无法进行单元测试
5. ❌ 修改低层模块导致高层模块也要改

## 总结

### DIP的核心价值：

1. ✅ **解耦**：高层和低层通过抽象解耦
2. ✅ **可测试性**：可以注入Mock实现
3. ✅ **灵活性**：可以运行时切换实现
4. ✅ **可扩展性**：添加新实现不影响现有代码
5. ✅ **可维护性**：减少连锁修改

### 实践原则：

- **定义抽象接口**：为关键依赖定义接口
- **依赖注入**：通过构造函数注入依赖
- **面向接口编程**：依赖抽象而非具体实现
- **控制反转**：让容器/框架管理依赖

### DIP与其他SOLID原则的关系：

- **SRP**：单一职责帮助识别抽象
- **OCP**：DIP使OCP更容易实现
- **LSP**：抽象的正确使用依赖LSP
- **ISP**：小接口使DIP更容易应用

### 记住：

> 依赖于抽象，而非具体实现
> 高层和低层都应该依赖抽象
> 通过依赖注入实现解耦
> DIP是实现松耦合架构的关键
