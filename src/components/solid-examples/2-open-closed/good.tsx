import { Mail, Bell, MessageSquare, type LucideIcon } from 'lucide-react';
import type React from 'react';

/**
 * ✅ 遵守开闭原则 (OCP)
 *
 * 优点：
 * 1. 对扩展开放：添加新的通知类型只需添加新的配置，无需修改现有代码
 * 2. 对修改封闭：现有代码保持稳定，不会因为新功能而改变
 * 3. 使用策略模式和配置化设计
 * 4. 代码可维护性强，不易引入bug
 */

interface BaseNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string;
}

// 通知类型配置接口
interface NotificationConfig {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  backgroundColor: string;
  actionText: string;
  actionColor: string;
  onAction?: () => void;
}

// 通知配置注册表 - 扩展新类型只需在这里添加配置
const notificationConfigs: Record<string, NotificationConfig> = {
  email: {
    icon: Mail,
    iconColor: 'text-blue-500',
    title: '📧 邮件通知',
    backgroundColor: 'bg-blue-50',
    actionText: '查看邮件',
    actionColor: 'text-blue-600',
    onAction: () => console.log('打开邮件'),
  },
  sms: {
    icon: MessageSquare,
    iconColor: 'text-green-500',
    title: '📱 短信通知',
    backgroundColor: 'bg-green-50',
    actionText: '查看短信',
    actionColor: 'text-green-600',
    onAction: () => console.log('打开短信'),
  },
  push: {
    icon: Bell,
    iconColor: 'text-orange-500',
    title: '🔔 推送通知',
    backgroundColor: 'bg-orange-50',
    actionText: '打开应用',
    actionColor: 'text-orange-600',
    onAction: () => console.log('打开应用'),
  },
  wechat: {
    icon: MessageSquare,
    iconColor: 'text-green-600',
    title: '💬 微信通知',
    backgroundColor: 'bg-green-50',
    actionText: '打开微信',
    actionColor: 'text-green-600',
    onAction: () => console.log('打开微信'),
  },
  // 🎉 添加新类型只需在这里添加配置，无需修改任何其他代码！
  // dingtalk: {
  //   icon: MessageSquare,
  //   iconColor: 'text-blue-600',
  //   title: '💼 钉钉通知',
  //   backgroundColor: 'bg-blue-50',
  //   actionText: '打开钉钉',
  //   actionColor: 'text-blue-600',
  //   onAction: () => console.log('打开钉钉'),
  // },
  // slack: {
  //   icon: MessageSquare,
  //   iconColor: 'text-purple-600',
  //   title: '💬 Slack通知',
  //   backgroundColor: 'bg-purple-50',
  //   actionText: '打开Slack',
  //   actionColor: 'text-purple-600',
  //   onAction: () => console.log('打开Slack'),
  // },
};

// 默认配置
const defaultConfig: NotificationConfig = {
  icon: Bell,
  iconColor: 'text-gray-500',
  title: '通知',
  backgroundColor: 'bg-gray-50',
  actionText: '查看',
  actionColor: 'text-gray-600',
};

// 通知配置工厂 - 获取配置的单一入口
class NotificationConfigFactory {
  static getConfig(type: string): NotificationConfig {
    return notificationConfigs[type] || defaultConfig;
  }

  // 🎉 如果需要动态注册新类型，可以添加这个方法
  static register(type: string, config: NotificationConfig): void {
    notificationConfigs[type] = config;
  }
}

// 通知项组件 - 不需要修改，自动支持所有类型
const NotificationItemGood: React.FC<{ notification: BaseNotification }> = ({ notification }) => {
  // 通过配置获取所有需要的信息
  const config = NotificationConfigFactory.getConfig(notification.type);
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg ${config.backgroundColor} mb-2`}>
      <div className="flex items-start gap-3">
        <Icon className={config.iconColor} size={24} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{config.title}</h3>
            <span className="text-xs text-gray-500">{notification.timestamp}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
          <div className="mt-2">
            <button
              type="button"
              className={`${config.actionColor} hover:underline`}
              onClick={config.onAction}
            >
              {config.actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationListGood: React.FC = () => {
  const notifications: BaseNotification[] = [
    {
      id: 1,
      type: 'email',
      title: '新邮件',
      message: '您收到了一封来自管理员的邮件',
      timestamp: '2分钟前',
    },
    {
      id: 2,
      type: 'sms',
      title: '验证码',
      message: '您的验证码是: 123456',
      timestamp: '5分钟前',
    },
    {
      id: 3,
      type: 'push',
      title: '系统更新',
      message: '发现新版本，点击更新',
      timestamp: '10分钟前',
    },
    {
      id: 4,
      type: 'wechat',
      title: '微信消息',
      message: '您有一条新的微信消息',
      timestamp: '15分钟前',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">通知中心</h2>
      <div>
        {notifications.map((notification) => (
          <NotificationItemGood key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationListGood;

/**
 * 为什么这符合OCP？
 *
 * 添加新的通知类型"钉钉通知"只需：
 * 1. 在notificationConfigs中添加dingtalk配置（取消注释即可）
 * 2. 不需要修改NotificationItemGood组件
 * 3. 不需要修改NotificationListGood组件
 * 4. 不需要修改任何现有代码
 *
 * 扩展方式：
 * - 静态扩展：直接在notificationConfigs中添加配置
 * - 动态扩展：使用NotificationConfigFactory.register()方法
 *
 * 这就是"对扩展开放，对修改封闭"！
 */

// 示例：运行时动态注册新类型
// NotificationConfigFactory.register('dingtalk', {
//   icon: MessageSquare,
//   iconColor: 'text-blue-600',
//   title: '💼 钉钉通知',
//   backgroundColor: 'bg-blue-50',
//   actionText: '打开钉钉',
//   actionColor: 'text-blue-600',
//   onAction: () => console.log('打开钉钉'),
// });
