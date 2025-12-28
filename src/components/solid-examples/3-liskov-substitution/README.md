# 里氏替换原则 (Liskov Substitution Principle - LSP)

## 定义

子类型必须能够替换掉它们的基类型，而不影响程序的正确性。

## 核心思想

如果S是T的子类型，那么类型T的对象可以被类型S的对象替换，而不会改变程序的任何期望属性（正确性、任务完成等）。

## 简单来说

子类必须能够完全替换父类，并且保持程序的行为不变。

## 示例对比

### ❌ 不好的实践 (bad.tsx)

经典的"正方形-矩形"问题：

```typescript
class Rectangle {
  setWidth(width: number): void {
    this.width = width;
  }
  setHeight(height: number): void {
    this.height = height;
  }
  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  // ❌ 改变了父类的行为
  override setWidth(width: number): void {
    this.width = width;
    this.height = width; // 强制相等
  }

  override setHeight(height: number): void {
    this.width = height;
    this.height = height; // 强制相等
  }
}

// 测试
const rect: Rectangle = new Rectangle();
rect.setWidth(5);
rect.setHeight(4);
console.log(rect.getArea()); // ✅ 20

const square: Rectangle = new Square(); // 子类替换父类
square.setWidth(5);
square.setHeight(4);
console.log(square.getArea()); // ❌ 16 (预期20，但实际16)
```

**违反LSP的原因：**

1. Square改变了Rectangle的行为
2. Rectangle的约定：可以独立设置宽高
3. Square的约定：宽高必须相等（加强了前置条件）
4. 用Square替换Rectangle导致意外结果

### ✅ 好的实践 (good.tsx)

使用接口和组合：

```typescript
// 定义共同行为
interface Shape {
  getArea(): number;
  getPerimeter(): number;
}

// 矩形：独立实现
class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}

  setWidth(width: number): void {
    this.width = width;
  }
  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// 正方形：独立实现
class Square implements Shape {
  constructor(private side: number) {}

  setSide(side: number): void {
    this.side = side;
  }

  getArea(): number {
    return this.side * this.side;
  }
  getPerimeter(): number {
    return 4 * this.side;
  }
}

// ✅ 任何Shape的实现都能正确工作
function calculateArea(shape: Shape): number {
  return shape.getArea();
}

calculateArea(new Rectangle(5, 4)); // ✅ 20
calculateArea(new Square(5)); // ✅ 25
```

**符合LSP的原因：**

1. ✅ 没有继承关系，避免了行为冲突
2. ✅ 每个类保持自己的约束
3. ✅ 所有实现都能正确替换Shape接口
4. ✅ 行为可预测，没有意外结果

## LSP的四个约束

### 1. 前置条件不能加强

```typescript
// ❌ 违反
class Base {
  process(value: number): void {
    // 接受任何数字
  }
}

class Derived extends Base {
  override process(value: number): void {
    if (value < 0) throw new Error('Must be positive'); // 加强了前置条件
  }
}
```

### 2. 后置条件不能削弱

```typescript
// ❌ 违反
class Base {
  getValue(): number {
    return 1; // 保证返回正数
  }
}

class Derived extends Base {
  override getValue(): number {
    return -1; // 可能返回负数，削弱了后置条件
  }
}
```

### 3. 不变量必须保持

```typescript
// ❌ 违反
class Rectangle {
  // 不变量：width和height可以独立变化
  setWidth(w: number): void {
    this.width = w;
  }
  setHeight(h: number): void {
    this.height = h;
  }
}

class Square extends Rectangle {
  // 破坏了不变量：width和height必须相等
  override setWidth(w: number): void {
    this.width = w;
    this.height = w;
  }
}
```

### 4. 历史约束（不能添加父类不允许的修改）

```typescript
// ❌ 违反
class ImmutablePoint {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}
}

class MutablePoint extends ImmutablePoint {
  setX(x: number): void {
    (this as any).x = x;
  } // 违反了不可变约束
}
```

## 如何识别LSP违反？

### 常见信号：

1. ❌ 子类抛出父类不会抛出的异常
2. ❌ 子类需要类型检查 (`instanceof`)
3. ❌ 子类返回null或空对象（而父类不会）
4. ❌ 子类方法什么都不做（空实现）
5. ❌ 需要注释说明"仅在某些子类中有效"

### 示例：

```typescript
// ❌ 违反LSP的信号
class Bird {
  fly(): void {
    /* 飞行逻辑 */
  }
}

class Penguin extends Bird {
  override fly(): void {
    throw new Error('Penguins cannot fly!'); // 信号1: 抛出异常
  }
}

class Ostrich extends Bird {
  override fly(): void {
    // 信号4: 空实现
  }
}

// 使用时需要类型检查
function makeBirdFly(bird: Bird): void {
  if (bird instanceof Penguin || bird instanceof Ostrich) {
    // 信号2
    console.log('This bird cannot fly');
  } else {
    bird.fly();
  }
}
```

## 如何遵守LSP？

### 方案1: 使用接口而非继承

```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Sparrow implements Flyable {
  fly(): void {
    /* 飞行 */
  }
}

class Penguin implements Swimmable {
  swim(): void {
    /* 游泳 */
  }
}
```

### 方案2: 重新设计继承层次

```typescript
class Bird {
  eat(): void {
    /* 吃 */
  }
}

class FlyingBird extends Bird {
  fly(): void {
    /* 飞 */
  }
}

class FlightlessBird extends Bird {
  // 不实现fly
}

class Sparrow extends FlyingBird {}
class Penguin extends FlightlessBird {}
```

### 方案3: 使用组合

```typescript
class Bird {
  constructor(private ability: BirdAbility) {}

  move(): void {
    this.ability.move();
  }
}

interface BirdAbility {
  move(): void;
}

class FlyingAbility implements BirdAbility {
  move(): void {
    /* 飞行 */
  }
}

class SwimmingAbility implements BirdAbility {
  move(): void {
    /* 游泳 */
  }
}
```

## React中的LSP

### ❌ 违反LSP

```typescript
interface ButtonProps {
  onClick: () => void;
  text: string;
}

function Button({ onClick, text }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

// 子组件改变了行为
function DisabledButton({ onClick, text }: ButtonProps) {
  // onClick不会被调用，违反了父组件的契约
  return <button disabled>{text}</button>;
}
```

### ✅ 遵守LSP

```typescript
interface BaseButtonProps {
  text: string;
}

interface ClickableButtonProps extends BaseButtonProps {
  onClick: () => void;
}

function Button({ onClick, text }: ClickableButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

function DisabledButton({ text }: BaseButtonProps) {
  return <button disabled>{text}</button>;
}
```

## 总结

### LSP的重要性：

1. ✅ 保证代码的可预测性
2. ✅ 提高代码的可维护性
3. ✅ 避免意外的bug
4. ✅ 使多态更安全

### 核心原则：

- **不是所有"IS-A"关系都适合用继承**
- **继承是为了行为的替换，不是概念的分类**
- **优先使用组合和接口**
- **子类不应该破坏父类的契约**

### 记住：

> 如果你需要检查类型才能调用方法，说明你违反了LSP。
> 如果子类改变了父类的行为，说明你违反了LSP。
> 如果使用子类会导致意外结果，说明你违反了LSP。
