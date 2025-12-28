import { Printer, Scanner, Fax, Mail, Cloud, Copy } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

/**
 * ✅ 遵守接口隔离原则 (ISP)
 *
 * 优点：
 * 1. 将臃肿接口拆分成多个小接口
 * 2. 类只需要实现它们需要的接口
 * 3. 没有空实现或异常抛出
 * 4. 符合"客户端不应该依赖它不使用的接口"
 */

// ✅ 拆分成小接口 - 每个接口只负责一个功能
interface Printable {
  print(document: string): void;
}

interface Scannable {
  scan(document: string): string;
}

interface Faxable {
  fax(document: string): void;
}

interface Copyable {
  copy(document: string): void;
}

interface Emailable {
  email(document: string): void;
}

interface CloudUploadable {
  cloudUpload(document: string): void;
}

// ✅ 高端多功能打印机 - 实现所有接口
class AdvancedPrinterGood
  implements Printable, Scannable, Faxable, Copyable, Emailable, CloudUploadable
{
  print(document: string): void {
    console.log(`✅ 打印: ${document}`);
  }

  scan(document: string): string {
    console.log(`✅ 扫描: ${document}`);
    return `scanned-${document}`;
  }

  fax(document: string): void {
    console.log(`✅ 传真: ${document}`);
  }

  copy(document: string): void {
    console.log(`✅ 复印: ${document}`);
  }

  email(document: string): void {
    console.log(`✅ 发送邮件: ${document}`);
  }

  cloudUpload(document: string): void {
    console.log(`✅ 上传到云: ${document}`);
  }
}

// ✅ 简单打印机 - 只实现需要的接口
class SimplePrinterGood implements Printable {
  print(document: string): void {
    console.log(`✅ 打印: ${document}`);
  }
  // 不需要实现其他接口！
}

// ✅ 老式传真机 - 只实现传真接口
class OldFaxMachineGood implements Faxable {
  fax(document: string): void {
    console.log(`✅ 传真: ${document}`);
  }
  // 不需要实现其他接口！
}

// ✅ 扫描仪 - 只实现扫描接口
class ScannerGood implements Scannable {
  scan(document: string): string {
    console.log(`✅ 扫描: ${document}`);
    return `scanned-${document}`;
  }
}

// ✅ 现代网络打印机 - 实现部分接口
class NetworkPrinterGood implements Printable, Scannable, Emailable, CloudUploadable {
  print(document: string): void {
    console.log(`✅ 打印: ${document}`);
  }

  scan(document: string): string {
    console.log(`✅ 扫描: ${document}`);
    return `scanned-${document}`;
  }

  email(document: string): void {
    console.log(`✅ 发送邮件: ${document}`);
  }

  cloudUpload(document: string): void {
    console.log(`✅ 上传到云: ${document}`);
  }
}

// 设备信息类型
interface DeviceInfo {
  name: string;
  features: Array<{
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    available: boolean;
  }>;
}

// UI组件
const PrinterManagementGood: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);

  // 设备实例
  const devices = {
    advanced: new AdvancedPrinterGood(),
    simple: new SimplePrinterGood(),
    fax: new OldFaxMachineGood(),
    scanner: new ScannerGood(),
    network: new NetworkPrinterGood(),
  };

  // 设备信息
  const deviceInfos: DeviceInfo[] = [
    {
      name: '高端多功能打印机',
      features: [
        { name: '打印', icon: Printer, available: true },
        { name: '扫描', icon: Scanner, available: true },
        { name: '传真', icon: Fax, available: true },
        { name: '复印', icon: Copy, available: true },
        { name: '邮件', icon: Mail, available: true },
        { name: '云上传', icon: Cloud, available: true },
      ],
    },
    {
      name: '简单打印机',
      features: [
        { name: '打印', icon: Printer, available: true },
        { name: '扫描', icon: Scanner, available: false },
        { name: '传真', icon: Fax, available: false },
        { name: '复印', icon: Copy, available: false },
        { name: '邮件', icon: Mail, available: false },
        { name: '云上传', icon: Cloud, available: false },
      ],
    },
    {
      name: '老式传真机',
      features: [
        { name: '打印', icon: Printer, available: false },
        { name: '扫描', icon: Scanner, available: false },
        { name: '传真', icon: Fax, available: true },
        { name: '复印', icon: Copy, available: false },
        { name: '邮件', icon: Mail, available: false },
        { name: '云上传', icon: Cloud, available: false },
      ],
    },
    {
      name: '扫描仪',
      features: [
        { name: '打印', icon: Printer, available: false },
        { name: '扫描', icon: Scanner, available: true },
        { name: '传真', icon: Fax, available: false },
        { name: '复印', icon: Copy, available: false },
        { name: '邮件', icon: Mail, available: false },
        { name: '云上传', icon: Cloud, available: false },
      ],
    },
    {
      name: '现代网络打印机',
      features: [
        { name: '打印', icon: Printer, available: true },
        { name: '扫描', icon: Scanner, available: true },
        { name: '传真', icon: Fax, available: false },
        { name: '复印', icon: Copy, available: false },
        { name: '邮件', icon: Mail, available: true },
        { name: '云上传', icon: Cloud, available: true },
      ],
    },
  ];

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // ✅ 使用类型守卫检查功能
  const testPrint = (device: unknown, deviceName: string) => {
    if ('print' in device && typeof (device as Printable).print === 'function') {
      (device as Printable).print('文档.pdf');
      addLog(`${deviceName} - 打印成功 ✅`);
    } else {
      addLog(`${deviceName} - 不支持打印 ⚠️`);
    }
  };

  const testScan = (device: unknown, deviceName: string) => {
    if ('scan' in device && typeof (device as Scannable).scan === 'function') {
      (device as Scannable).scan('文档.pdf');
      addLog(`${deviceName} - 扫描成功 ✅`);
    } else {
      addLog(`${deviceName} - 不支持扫描 ⚠️`);
    }
  };

  const testFax = (device: unknown, deviceName: string) => {
    if ('fax' in device && typeof (device as Faxable).fax === 'function') {
      (device as Faxable).fax('文档.pdf');
      addLog(`${deviceName} - 传真成功 ✅`);
    } else {
      addLog(`${deviceName} - 不支持传真 ⚠️`);
    }
  };

  const testAllDevices = () => {
    setLogs([]);
    addLog('=== 开始测试所有设备 ===');

    testPrint(devices.advanced, '高端多功能打印机');
    testScan(devices.advanced, '高端多功能打印机');
    testFax(devices.advanced, '高端多功能打印机');

    testPrint(devices.simple, '简单打印机');
    testScan(devices.simple, '简单打印机');

    testFax(devices.fax, '老式传真机');
    testPrint(devices.fax, '老式传真机');

    testScan(devices.scanner, '扫描仪');
    testPrint(devices.scanner, '扫描仪');

    testPrint(devices.network, '现代网络打印机');
    testScan(devices.network, '现代网络打印机');

    addLog('=== 测试完成 ===');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">✅ 遵守接口隔离原则</h2>

      <div className="mb-6">
        <button
          type="button"
          onClick={testAllDevices}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
        >
          测试所有设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {deviceInfos.map((device) => (
          <div key={device.name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-3">{device.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {device.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.name}
                    className={`flex items-center gap-2 text-sm ${
                      feature.available ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{feature.name}</span>
                    <span>{feature.available ? '✅' : '❌'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {logs.length > 0 && (
        <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm">
          <h3 className="font-semibold mb-2 text-white">执行日志：</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
        <h3 className="font-semibold mb-2 text-green-800">✅ 符合ISP的优点：</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>每个接口只定义一个功能，职责单一</li>
          <li>SimplePrinterGood只实现Printable，无需实现其他接口</li>
          <li>OldFaxMachineGood只实现Faxable，无需实现其他接口</li>
          <li>没有空实现或抛出异常</li>
          <li>使用类型守卫安全地检查功能</li>
          <li>易于扩展：添加新设备或新功能不影响现有代码</li>
          <li>代码清晰、易于测试和维护</li>
        </ul>
      </div>
    </div>
  );
};

export default PrinterManagementGood;

/**
 * 为什么这符合ISP？
 *
 * ✅ 接口拆分：
 * - 将MultiFunctionDevice拆分成6个小接口
 * - 每个接口只定义一个功能
 *
 * ✅ 按需实现：
 * - SimplePrinterGood只实现Printable
 * - OldFaxMachineGood只实现Faxable
 * - NetworkPrinterGood实现4个接口
 * - AdvancedPrinterGood实现所有6个接口
 *
 * ✅ 类型安全：
 * - 使用类型守卫检查功能
 * - 不会调用不存在的方法
 * - 不会抛出异常
 *
 * ✅ 易于扩展：
 * - 添加新功能：定义新接口
 * - 添加新设备：实现需要的接口
 * - 不影响现有代码
 */
