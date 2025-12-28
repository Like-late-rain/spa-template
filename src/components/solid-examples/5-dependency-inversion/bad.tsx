import type React from 'react';
import { useState } from 'react';

/**
 * ❌ 违反依赖反转原则 (DIP)
 *
 * 问题：
 * 1. 高层模块（UserService）直接依赖低层模块（EmailService、SMSService）
 * 2. 紧耦合，难以测试
 * 3. 无法轻松替换通知方式
 * 4. 违反了"依赖于抽象，而非具体实现"
 */

// ❌ 低层模块：具体的邮件服务
class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    console.log(`📧 发送邮件到 ${to}`);
    console.log(`主题: ${subject}`);
    console.log(`内容: ${body}`);
  }
}

// ❌ 低层模块：具体的短信服务
class SMSService {
  sendSMS(phone: string, message: string): void {
    console.log(`📱 发送短信到 ${phone}`);
    console.log(`内容: ${message}`);
  }
}

// ❌ 低层模块：具体的推送服务
class PushNotificationService {
  sendPush(userId: string, title: string, message: string): void {
    console.log(`🔔 发送推送给用户 ${userId}`);
    console.log(`标题: ${title}`);
    console.log(`内容: ${message}`);
  }
}

// ❌ 高层模块：直接依赖具体的低层模块
class UserServiceBad {
  // 问题1: 直接依赖具体实现
  private emailService = new EmailService();
  private smsService = new SMSService();
  private pushService = new PushNotificationService();

  // 问题2: 通知方式硬编码，无法灵活切换
  notifyUser(userId: string, email: string, phone: string, message: string): void {
    // 总是发送所有类型的通知
    this.emailService.sendEmail(email, '系统通知', message);
    this.smsService.sendSMS(phone, message);
    this.pushService.sendPush(userId, '系统通知', message);
  }

  // 问题3: 如果要添加新的通知方式（如微信），需要修改这个类
  // 问题4: 无法单独测试，因为依赖了具体实现
}

// ❌ 业务逻辑层：也直接依赖具体实现
class OrderServiceBad {
  private userService = new UserServiceBad();

  createOrder(userId: string, email: string, phone: string): void {
    console.log('创建订单...');

    // 问题: 如果UserServiceBad的构造函数需要参数，这里就要修改
    this.userService.notifyUser(userId, email, phone, '您的订单已创建');

    console.log('订单创建完成');
  }
}

// UI组件
const UserNotificationBad: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const testNotification = () => {
    setLogs([]);

    // 捕获console.log
    const originalLog = console.log;
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };

    try {
      addLog('=== 测试用户通知 ===');

      const userService = new UserServiceBad();
      userService.notifyUser('user123', 'user@example.com', '13800138000', '您有新消息');

      addLog('\n=== 测试订单服务 ===');

      const orderService = new OrderServiceBad();
      orderService.createOrder('user456', 'order@example.com', '13900139000');

      addLog('\n❌ 问题：');
      addLog('1. 无法单独使用邮件通知（总是发送所有类型）');
      addLog('2. 无法替换通知服务的实现');
      addLog('3. 难以进行单元测试（依赖具体实现）');
      addLog('4. 添加新通知方式需要修改UserServiceBad类');
    } finally {
      console.log = originalLog;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">❌ 违反依赖反转原则</h2>

      <div className="mb-6">
        <button
          type="button"
          onClick={testNotification}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
        >
          测试通知系统
        </button>
      </div>

      {logs.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
            <h3 className="font-semibold mb-2 text-white">执行日志：</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <h3 className="font-semibold mb-2 text-yellow-800">❌ 违反DIP的问题：</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>
                <strong>紧耦合：</strong>UserServiceBad直接创建EmailService、SMSService等实例
              </li>
              <li>
                <strong>难以测试：</strong>无法mock EmailService，必须使用真实的邮件服务
              </li>
              <li>
                <strong>不灵活：</strong>无法在运行时切换通知方式（如只发邮件）
              </li>
              <li>
                <strong>难以扩展：</strong>添加微信通知需要修改UserServiceBad类
              </li>
              <li>
                <strong>违反OCP：</strong>每次扩展都要修改现有代码
              </li>
              <li>
                <strong>依赖方向错误：</strong>高层模块依赖低层模块的具体实现
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-50 rounded border border-red-200">
            <h3 className="font-semibold mb-2 text-red-800">依赖关系图：</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>OrderServiceBad → UserServiceBad (具体类)</div>
              <div className="ml-4">UserServiceBad → EmailService (具体类)</div>
              <div className="ml-4">UserServiceBad → SMSService (具体类)</div>
              <div className="ml-4">UserServiceBad → PushNotificationService (具体类)</div>
              <div className="mt-2 text-red-600">❌ 高层直接依赖低层的具体实现</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotificationBad;

/**
 * 为什么这违反了DIP？
 *
 * DIP的两个核心要求：
 * 1. 高层模块不应该依赖低层模块，两者都应该依赖抽象
 * 2. 抽象不应该依赖细节，细节应该依赖抽象
 *
 * 本例的问题：
 * ❌ UserServiceBad（高层）直接依赖EmailService、SMSService（低层具体实现）
 * ❌ 没有抽象层，无法替换实现
 * ❌ 紧耦合，难以测试和扩展
 *
 * 依赖方向：
 * OrderServiceBad → UserServiceBad → EmailService/SMSService/PushService
 * （高层）    → （高层）     → （低层具体实现）
 *
 * 解决方案：见good.tsx
 */
