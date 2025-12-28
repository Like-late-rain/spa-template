# 接口隔离原则 (Interface Segregation Principle - ISP)

## 定义

客户端不应该被迫依赖它不使用的方法。

## 核心思想

- 使用多个专门的接口，而不是单一的总接口
- 接口应该小而专注
- 避免"胖接口"（Fat Interface）

## 简单来说

把大接口拆成小接口，让类只需要实现它真正需要的方法。

## 示例对比

### ❌ 不好的实践 (bad.tsx)

臃肿的多功能设备接口：

```typescript
// ❌ 胖接口 - 包含所有功能
interface MultiFunctionDevice {
  print(document: string): void;
  scan(document: string): string;
  fax(document: string): void;
  copy(document: string): void;
  email(document: string): void;
  cloudUpload(document: string): void;
}

// ❌ 简单打印机被迫实现所有方法
class SimplePrinter implements MultiFunctionDevice {
  print(document: string): void {
    console.log('打印');
  }

  // 不需要这些功能，但必须实现 ❌
  scan(_document: string): string {
    return '';
  }
  fax(_document: string): void {
    throw new Error('不支持');
  }
  copy(_document: string): void {}
  email(_document: string): void {
    throw new Error('不支持');
  }
  cloudUpload(_document: string): void {
    throw new Error('不支持');
  }
}
```

**问题：**

- ❌ SimplePrinter只需要print，却被迫实现6个方法
- ❌ 大量空实现或抛出异常
- ❌ 违反了LSP（抛出异常）
- ❌ 代码冗余，难以维护
- ❌ 添加新功能时，所有类都要修改

### ✅ 好的实践 (good.tsx)

拆分成多个小接口：

```typescript
// ✅ 小接口 - 每个接口一个功能
interface Printable {
  print(document: string): void;
}

interface Scannable {
  scan(document: string): string;
}

interface Faxable {
  fax(document: string): void;
}

interface Emailable {
  email(document: string): void;
}

// ✅ 简单打印机只实现需要的接口
class SimplePrinter implements Printable {
  print(document: string): void {
    console.log('打印');
  }
  // 不需要实现其他接口！
}

// ✅ 多功能打印机实现多个接口
class AdvancedPrinter implements Printable, Scannable, Faxable {
  print(document: string): void {
    /* ... */
  }
  scan(document: string): string {
    /* ... */
  }
  fax(document: string): void {
    /* ... */
  }
}
```

**优点：**

- ✅ 每个类只实现需要的接口
- ✅ 没有空实现或异常
- ✅ 接口职责单一，易于理解
- ✅ 易于扩展和维护
- ✅ 符合LSP

## ISP vs SRP

### 区别：

- **SRP**：关注类的职责（一个类应该只有一个职责）
- **ISP**：关注接口的设计（接口应该小而专注）

### 联系：

- ISP是SRP在接口设计上的体现
- 都强调"单一"和"专注"
- 互相支持，共同提高代码质量

## 如何识别违反ISP？

### 常见信号：

1. ❌ 接口方法过多（>5个方法要警惕）
2. ❌ 实现类有大量空实现
3. ❌ 实现类抛出"不支持"异常
4. ❌ 注释写着"此方法仅在XX情况下使用"
5. ❌ 实现类只用到接口的一部分方法

### 示例：

```typescript
// ❌ 接口过于臃肿
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  // 机器人不需要eat和sleep
  // 人类不需要charge
  charge(): void;
}

class Human implements Worker {
  work(): void {
    /* ... */
  }
  eat(): void {
    /* ... */
  }
  sleep(): void {
    /* ... */
  }
  charge(): void {
    throw new Error('人类不需要充电');
  } // ❌
}

class Robot implements Worker {
  work(): void {
    /* ... */
  }
  charge(): void {
    /* ... */
  }
  eat(): void {} // ❌ 空实现
  sleep(): void {} // ❌ 空实现
}
```

## 如何遵守ISP？

### 方案1: 接口拆分

```typescript
// ✅ 拆分成小接口
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Chargeable {
  charge(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work(): void {
    /* ... */
  }
  eat(): void {
    /* ... */
  }
  sleep(): void {
    /* ... */
  }
}

class Robot implements Workable, Chargeable {
  work(): void {
    /* ... */
  }
  charge(): void {
    /* ... */
  }
}
```

### 方案2: 接口继承

```typescript
// 基础接口
interface BasicPrinter {
  print(document: string): void;
}

// 扩展接口
interface AdvancedPrinter extends BasicPrinter {
  scan(document: string): string;
  fax(document: string): void;
}

// 简单打印机
class SimplePrinter implements BasicPrinter {
  print(document: string): void {
    /* ... */
  }
}

// 高级打印机
class AdvancedPrinter implements AdvancedPrinter {
  print(document: string): void {
    /* ... */
  }
  scan(document: string): string {
    /* ... */
  }
  fax(document: string): void {
    /* ... */
  }
}
```

### 方案3: 组合优于继承

```typescript
interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(document: string): string;
}

// 使用组合
class MultiFunctionDevice {
  constructor(
    private printer: Printer,
    private scanner: Scanner
  ) {}

  print(document: string): void {
    this.printer.print(document);
  }

  scan(document: string): string {
    return this.scanner.scan(document);
  }
}
```

## React/TypeScript中的ISP

### ❌ 违反ISP的组件Props

```typescript
// ❌ 臃肿的Props
interface FormFieldProps {
  // 文本输入用的
  placeholder?: string;
  maxLength?: number;
  // 数字输入用的
  min?: number;
  max?: number;
  step?: number;
  // 日期输入用的
  minDate?: Date;
  maxDate?: Date;
  // 下拉选择用的
  options?: Array<{ label: string; value: string }>;
  // ...其他10个属性
}

// TextInput只需要placeholder和maxLength，但要声明所有props
function TextInput(props: FormFieldProps) {
  /* ... */
}
```

### ✅ 遵守ISP的组件Props

```typescript
// ✅ 拆分成小的Props接口
interface BaseInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface TextInputProps extends BaseInputProps {
  placeholder?: string;
  maxLength?: number;
}

interface NumberInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
}

interface DateInputProps extends BaseInputProps {
  minDate?: Date;
  maxDate?: Date;
}

// 每个组件只使用需要的props
function TextInput(props: TextInputProps) {
  /* ... */
}
function NumberInput(props: NumberInputProps) {
  /* ... */
}
function DateInput(props: DateInputProps) {
  /* ... */
}
```

### ✅ React Hooks中的ISP

```typescript
// ❌ 违反ISP
interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string;
  updateUser: (user: User) => void;
  deleteUser: () => void;
  refreshUser: () => void;
  // ... 很多方法
}

// ✅ 遵守ISP - 拆分hooks
function useUserData() {
  // 只返回数据相关
  return { user, loading, error };
}

function useUserActions() {
  // 只返回操作相关
  return { updateUser, deleteUser, refreshUser };
}

// 组件按需使用
function UserProfile() {
  const { user, loading } = useUserData();
  // 不需要actions
}

function UserEditForm() {
  const { user } = useUserData();
  const { updateUser } = useUserActions();
  // 只用需要的
}
```

## 接口设计的最佳实践

### 1. 保持接口小而专注

```typescript
// ❌ 一个接口做太多事
interface DataService {
  fetch(): void;
  save(): void;
  validate(): void;
  transform(): void;
}

// ✅ 拆分成多个接口
interface Fetchable {
  fetch(): void;
}
interface Savable {
  save(): void;
}
interface Validatable {
  validate(): void;
}
interface Transformable {
  transform(): void;
}
```

### 2. 使用类型组合

```typescript
// TypeScript的类型组合非常适合ISP
type ReadWrite = Readable & Writable;
type FullAccess = Readable & Writable & Deletable;
```

### 3. 优先使用职责分离

```typescript
// 按职责分离接口
interface UserReader {
  getUser(id: string): User;
  listUsers(): User[];
}

interface UserWriter {
  createUser(user: User): void;
  updateUser(user: User): void;
  deleteUser(id: string): void;
}
```

## 什么时候应用ISP？

### 适合场景：

- ✅ 接口方法数量较多（>3个）
- ✅ 不同客户端需要不同的方法子集
- ✅ 发现有空实现或抛出"不支持"异常
- ✅ 接口在不断增长

### 不适合场景：

- ❌ 接口只有1-2个方法
- ❌ 所有实现类都需要所有方法
- ❌ 过度拆分导致接口爆炸

## 总结

### ISP的核心价值：

1. ✅ 减少不必要的依赖
2. ✅ 提高代码的灵活性
3. ✅ 降低修改的影响范围
4. ✅ 使接口更易于理解和使用

### 实践原则：

- **宁可多个小接口，不要一个大接口**
- **接口应该基于客户端需求，而非实现**
- **避免强迫客户端依赖不使用的方法**
- **接口拆分要适度，避免过度设计**

### 记住：

> 胖接口会导致类之间不必要的耦合。
> 客户端应该只依赖它真正需要的接口。
> 接口隔离是解耦的重要手段。
