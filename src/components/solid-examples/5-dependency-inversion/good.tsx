import type React from 'react';
import { useState } from 'react';

/**
 * ✅ 遵守依赖反转原则 (DIP)
 *
 * 优点：
 * 1. 高层和低层都依赖抽象（接口）
 * 2. 通过依赖注入实现解耦
 * 3. 易于测试（可以注入mock实现）
 * 4. 易于扩展（添加新实现不影响现有代码）
 */

// ✅ 抽象层：定义通知服务接口
interface NotificationService {
  send(recipient: string, message: string): void;
}

// ✅ 低层模块1：邮件服务实现
class EmailServiceGood implements NotificationService {
  send(email: string, message: string): void {
    console.log(`📧 [邮件] 发送到: ${email}`);
    console.log(`内容: ${message}`);
  }
}

// ✅ 低层模块2：短信服务实现
class SMSServiceGood implements NotificationService {
  send(phone: string, message: string): void {
    console.log(`📱 [短信] 发送到: ${phone}`);
    console.log(`内容: ${message}`);
  }
}

// ✅ 低层模块3：推送服务实现
class PushNotificationServiceGood implements NotificationService {
  send(userId: string, message: string): void {
    console.log(`🔔 [推送] 发送给用户: ${userId}`);
    console.log(`内容: ${message}`);
  }
}

// ✅ 低层模块4：微信服务实现（新增）
class WeChatServiceGood implements NotificationService {
  send(wechatId: string, message: string): void {
    console.log(`💬 [微信] 发送到: ${wechatId}`);
    console.log(`内容: ${message}`);
  }
}

// ✅ 组合通知服务：可以同时使用多个通知服务
class CompositeNotificationService implements NotificationService {
  constructor(private services: NotificationService[]) {}

  send(recipient: string, message: string): void {
    this.services.forEach((service) => service.send(recipient, message));
  }
}

// ✅ 高层模块：依赖抽象而非具体实现
class UserServiceGood {
  // 依赖注入：通过构造函数注入抽象
  constructor(private notificationService: NotificationService) {}

  notifyUser(recipient: string, message: string): void {
    // 不关心具体实现，只调用接口方法
    this.notificationService.send(recipient, message);
  }

  // 可以动态切换通知服务
  setNotificationService(service: NotificationService): void {
    this.notificationService = service;
  }
}

// ✅ 业务逻辑层：也依赖抽象
class OrderServiceGood {
  constructor(private userService: UserServiceGood) {}

  createOrder(userId: string, recipient: string): void {
    console.log('创建订单...');
    this.userService.notifyUser(recipient, '您的订单已创建');
    console.log('订单创建完成\n');
  }
}

// ✅ Mock服务：用于测试
class MockNotificationService implements NotificationService {
  public sentMessages: Array<{ recipient: string; message: string }> = [];

  send(recipient: string, message: string): void {
    this.sentMessages.push({ recipient, message });
    console.log(`🧪 [Mock] 记录消息: ${recipient} - ${message}`);
  }

  getSentCount(): number {
    return this.sentMessages.length;
  }
}

// UI组件
const UserNotificationGood: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const captureConsole = (callback: () => void) => {
    const originalLog = console.log;
    console.log = (...args) => {
      addLog(args.join(' '));
      originalLog(...args);
    };

    try {
      callback();
    } finally {
      console.log = originalLog;
    }
  };

  const testEmailNotification = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例1: 只使用邮件通知 ===\n');

      // ✅ 注入邮件服务
      const emailService = new EmailServiceGood();
      const userService = new UserServiceGood(emailService);

      userService.notifyUser('user@example.com', '欢迎注册！');
    });
  };

  const testSMSNotification = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例2: 只使用短信通知 ===\n');

      // ✅ 注入短信服务
      const smsService = new SMSServiceGood();
      const userService = new UserServiceGood(smsService);

      userService.notifyUser('13800138000', '验证码: 123456');
    });
  };

  const testCompositeNotification = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例3: 使用组合通知（邮件+短信+推送） ===\n');

      // ✅ 组合多个服务
      const compositeService = new CompositeNotificationService([
        new EmailServiceGood(),
        new SMSServiceGood(),
        new PushNotificationServiceGood(),
      ]);

      const userService = new UserServiceGood(compositeService);
      userService.notifyUser('user@example.com / 13800138000', '重要通知！');
    });
  };

  const testDynamicSwitch = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例4: 动态切换通知方式 ===\n');

      // ✅ 先用邮件
      const userService = new UserServiceGood(new EmailServiceGood());

      addLog('第一次：使用邮件');
      userService.notifyUser('user@example.com', '消息1');

      addLog('\n切换到微信...\n');

      // ✅ 动态切换到微信
      userService.setNotificationService(new WeChatServiceGood());

      addLog('第二次：使用微信');
      userService.notifyUser('wechat_id_123', '消息2');
    });
  };

  const testMockService = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例5: 使用Mock服务进行测试 ===\n');

      // ✅ 注入Mock服务
      const mockService = new MockNotificationService();
      const userService = new UserServiceGood(mockService);

      userService.notifyUser('test@example.com', '测试消息1');
      userService.notifyUser('test@example.com', '测试消息2');

      addLog(`\n✅ 测试结果: 共发送了 ${mockService.getSentCount()} 条消息`);
      addLog('✅ 无需真实发送邮件/短信，测试更快更安全');
    });
  };

  const testOrderService = () => {
    setLogs([]);
    captureConsole(() => {
      addLog('=== 示例6: 完整的订单服务 ===\n');

      // ✅ 组装依赖
      const notificationService = new CompositeNotificationService([
        new EmailServiceGood(),
        new PushNotificationServiceGood(),
      ]);

      const userService = new UserServiceGood(notificationService);
      const orderService = new OrderServiceGood(userService);

      orderService.createOrder('user789', 'customer@example.com');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">✅ 遵守依赖反转原则</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={testEmailNotification}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
        >
          📧 邮件通知
        </button>

        <button
          type="button"
          onClick={testSMSNotification}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
        >
          📱 短信通知
        </button>

        <button
          type="button"
          onClick={testCompositeNotification}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold text-sm"
        >
          🔔 组合通知
        </button>

        <button
          type="button"
          onClick={testDynamicSwitch}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold text-sm"
        >
          🔄 动态切换
        </button>

        <button
          type="button"
          onClick={testMockService}
          className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-semibold text-sm"
        >
          🧪 Mock测试
        </button>

        <button
          type="button"
          onClick={testOrderService}
          className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold text-sm"
        >
          📦 订单服务
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

          <div className="p-4 bg-green-50 rounded border border-green-200">
            <h3 className="font-semibold mb-2 text-green-800">✅ 符合DIP的优点：</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>
                <strong>依赖抽象：</strong>UserServiceGood依赖NotificationService接口
              </li>
              <li>
                <strong>依赖注入：</strong>通过构造函数注入，实现松耦合
              </li>
              <li>
                <strong>易于测试：</strong>可以注入Mock服务，无需真实发送通知
              </li>
              <li>
                <strong>灵活切换：</strong>可以在运行时动态切换通知方式
              </li>
              <li>
                <strong>易于扩展：</strong>添加WeChatServiceGood无需修改现有代码
              </li>
              <li>
                <strong>符合OCP：</strong>对扩展开放，对修改封闭
              </li>
              <li>
                <strong>组合模式：</strong>可以组合多个服务同时使用
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-800">依赖关系图：</h3>
            <div className="space-y-2 text-sm font-mono">
              <div>OrderServiceGood → UserServiceGood (具体类)</div>
              <div className="ml-4">UserServiceGood → NotificationService (抽象)</div>
              <div className="ml-8">EmailServiceGood → NotificationService (抽象)</div>
              <div className="ml-8">SMSServiceGood → NotificationService (抽象)</div>
              <div className="ml-8">WeChatServiceGood → NotificationService (抽象)</div>
              <div className="mt-2 text-green-600">✅ 高层和低层都依赖抽象</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotificationGood;

/**
 * 为什么这符合DIP？
 *
 * ✅ 满足DIP的两个要求：
 * 1. 高层模块（UserServiceGood）不依赖低层模块（EmailServiceGood等）
 *    而是都依赖抽象（NotificationService接口）
 * 2. 抽象（NotificationService）不依赖细节，细节依赖抽象
 *
 * ✅ 依赖方向正确：
 * - UserServiceGood → NotificationService（抽象）
 * - EmailServiceGood → NotificationService（抽象）
 * - SMSServiceGood → NotificationService（抽象）
 *
 * ✅ 带来的好处：
 * 1. 解耦：高层和低层通过接口解耦
 * 2. 可测试：可以注入Mock实现
 * 3. 灵活：可以运行时切换实现
 * 4. 可扩展：添加新实现不影响现有代码
 * 5. 可组合：可以组合多个服务
 *
 * ✅ 实现方式：
 * - 依赖注入（Dependency Injection）
 * - 控制反转（Inversion of Control）
 */
