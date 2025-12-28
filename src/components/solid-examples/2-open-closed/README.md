# 开闭原则 (Open-Closed Principle - OCP)

## 定义

软件实体（类、模块、函数等）应该对扩展开放，对修改封闭。

## 核心思想

- **对扩展开放**：当需求变化时，可以通过扩展代码来适应新的需求
- **对修改封闭**：已有的代码应该保持稳定，不应该因为新需求而修改

## 示例对比

### ❌ 不好的实践 (bad.tsx)

`NotificationItemBad` 组件违反了OCP：

**问题分析：**

```typescript
// 每次添加新类型都需要修改这些函数
const getIcon = () => {
  switch (notification.type) {
    case 'email': ...
    case 'sms': ...
    case 'push': ...
    case 'wechat': ...
    // 添加新类型需要在这里加case ❌
  }
}
```

**要添加"钉钉通知"需要修改：**

1. ❌ 修改 `Notification` 接口的 `type` 定义
2. ❌ 在 `getIcon()` 中添加 `case 'dingtalk'`
3. ❌ 在 `getTitle()` 中添加 `case 'dingtalk'`
4. ❌ 在 `getBackgroundColor()` 中添加 `case 'dingtalk'`
5. ❌ 在 `getActionButton()` 中添加 `case 'dingtalk'`

**缺点：**

- 每次扩展都要修改多个地方
- 容易遗漏某个switch语句
- 测试成本高（每次都要重新测试所有分支）
- 违反了"高内聚，低耦合"

### ✅ 好的实践 (good.tsx)

使用配置化设计和策略模式：

**核心设计：**

```typescript
// 1. 定义配置接口
interface NotificationConfig {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  backgroundColor: string;
  actionText: string;
  actionColor: string;
}

// 2. 配置注册表
const notificationConfigs: Record<string, NotificationConfig> = {
  email: {
    /* 配置 */
  },
  sms: {
    /* 配置 */
  },
  // 添加新类型只需在这里添加配置 ✅
};

// 3. 配置工厂
class NotificationConfigFactory {
  static getConfig(type: string): NotificationConfig {
    return notificationConfigs[type] || defaultConfig;
  }
}
```

**要添加"钉钉通知"只需：**

1. ✅ 在 `notificationConfigs` 中添加一个配置项
2. ✅ 不需要修改任何现有代码

**优点：**

- ✅ 扩展新功能只需添加配置
- ✅ 现有代码保持稳定
- ✅ 降低了引入bug的风险
- ✅ 测试成本低（只需测试新配置）
- ✅ 支持运行时动态扩展

## 实现OCP的常用模式

### 1. 策略模式 (Strategy Pattern)

将算法封装成独立的策略类，通过配置选择不同策略。

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class AlipayStrategy implements PaymentStrategy {
  pay(amount: number) {
    /* 支付宝支付 */
  }
}

class WeChatPayStrategy implements PaymentStrategy {
  pay(amount: number) {
    /* 微信支付 */
  }
}

// 添加新支付方式不需要修改现有代码
```

### 2. 工厂模式 (Factory Pattern)

通过工厂创建对象，扩展时只需注册新类型。

```typescript
class NotificationFactory {
  private static creators = new Map();

  static register(type: string, creator: () => Notification) {
    this.creators.set(type, creator);
  }

  static create(type: string) {
    return this.creators.get(type)?.();
  }
}
```

### 3. 配置化设计

将可变的部分抽取成配置，扩展时只需修改配置。

```typescript
// 本示例采用的方式
const configs = {
  type1: {
    /* 配置 */
  },
  type2: {
    /* 配置 */
  },
};
```

### 4. 插件系统

通过插件机制实现扩展。

```typescript
class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
  }
}
```

## React中的最佳实践

### 1. 使用组件组合

```typescript
// 不好：通过props控制不同渲染
<Button type="primary" />
<Button type="danger" />

// 好：通过组合扩展
<PrimaryButton />
<DangerButton />
```

### 2. 使用Render Props

```typescript
<DataProvider>
  {(data) => <CustomView data={data} />}
</DataProvider>
```

### 3. 使用高阶组件

```typescript
const withAuth = (Component) => {
  return (props) => {
    // 扩展功能
    return <Component {...props} />;
  };
};
```

### 4. 使用配置驱动

```typescript
const componentMap = {
  text: TextInput,
  number: NumberInput,
  date: DateInput,
};

<FormField type={type} Component={componentMap[type]} />
```

## 什么时候应用OCP？

### 适合场景：

- ✅ 需要频繁添加新类型/变体
- ✅ 有明确的扩展点
- ✅ 变化点相对稳定（如通知类型）
- ✅ 需要插件化/可配置化

### 不适合场景：

- ❌ 需求变化不可预测
- ❌ 过度设计（YAGNI原则）
- ❌ 简单场景（2-3个分支）

## 总结

开闭原则是软件设计的核心原则之一。通过策略模式、工厂模式、配置化等设计方法，可以在不修改现有代码的情况下扩展新功能，从而提高代码的稳定性和可维护性。

**记住：不是所有代码都要100%符合OCP，关键是识别出真正的扩展点，在合适的地方应用OCP。**
