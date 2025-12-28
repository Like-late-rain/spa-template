import { Mail, Bell, MessageSquare } from 'lucide-react';
import type React from 'react';

/**
 * ❌ 违反开闭原则 (OCP)
 *
 * 问题：
 * 1. 每次添加新的通知类型，都需要修改现有代码
 * 2. NotificationBad组件中充满了if-else或switch语句
 * 3. 违反了"对扩展开放，对修改封闭"的原则
 * 4. 代码可维护性差，容易引入bug
 */

interface Notification {
  id: number;
  type: 'email' | 'sms' | 'push' | 'wechat'; // 如果要添加新类型，需要修改这里
  title: string;
  message: string;
  timestamp: string;
}

// 每次添加新的通知类型，都需要修改这个组件
const NotificationItemBad: React.FC<{ notification: Notification }> = ({ notification }) => {
  // 问题1: 需要为每种类型写不同的图标逻辑
  const getIcon = () => {
    switch (notification.type) {
      case 'email':
        return <Mail className="text-blue-500" size={24} />;
      case 'sms':
        return <MessageSquare className="text-green-500" size={24} />;
      case 'push':
        return <Bell className="text-orange-500" size={24} />;
      case 'wechat':
        return <MessageSquare className="text-green-600" size={24} />;
      // 如果要添加新类型（如钉钉、Slack等），需要在这里添加case
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  // 问题2: 需要为每种类型写不同的标题逻辑
  const getTitle = () => {
    switch (notification.type) {
      case 'email':
        return '📧 邮件通知';
      case 'sms':
        return '📱 短信通知';
      case 'push':
        return '🔔 推送通知';
      case 'wechat':
        return '💬 微信通知';
      // 又要在这里添加case
      default:
        return '通知';
    }
  };

  // 问题3: 需要为每种类型写不同的样式逻辑
  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'email':
        return 'bg-blue-50';
      case 'sms':
        return 'bg-green-50';
      case 'push':
        return 'bg-orange-50';
      case 'wechat':
        return 'bg-green-50';
      // 还要在这里添加case
      default:
        return 'bg-gray-50';
    }
  };

  // 问题4: 需要为每种类型写不同的操作按钮
  const getActionButton = () => {
    switch (notification.type) {
      case 'email':
        return <button className="text-blue-600 hover:underline">查看邮件</button>;
      case 'sms':
        return <button className="text-green-600 hover:underline">查看短信</button>;
      case 'push':
        return <button className="text-orange-600 hover:underline">打开应用</button>;
      case 'wechat':
        return <button className="text-green-600 hover:underline">打开微信</button>;
      // 继续在这里添加case...
      default:
        return <button className="text-gray-600 hover:underline">查看</button>;
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getBackgroundColor()} mb-2`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{getTitle()}</h3>
            <span className="text-xs text-gray-500">{notification.timestamp}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
          <div className="mt-2">{getActionButton()}</div>
        </div>
      </div>
    </div>
  );
};

const NotificationListBad: React.FC = () => {
  const notifications: Notification[] = [
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
          <NotificationItemBad key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationListBad;

/**
 * 为什么这是违反OCP的？
 *
 * 假设现在要添加一个新的通知类型"钉钉通知"，需要：
 * 1. 修改Notification接口的type定义
 * 2. 在getIcon()中添加新的case
 * 3. 在getTitle()中添加新的case
 * 4. 在getBackgroundColor()中添加新的case
 * 5. 在getActionButton()中添加新的case
 *
 * 这意味着每次扩展功能都要修改现有代码，违反了开闭原则！
 */
