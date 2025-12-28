import { Printer, Scanner, Fax, Wifi } from 'lucide-react';
import type React from 'react';

/**
 * ❌ 违反接口隔离原则 (ISP)
 *
 * 问题：
 * 1. 臃肿的接口强迫类实现它们不需要的方法
 * 2. 简单设备被迫实现所有功能
 * 3. 导致大量空实现或抛出异常
 * 4. 违反了"客户端不应该依赖它不使用的接口"
 */

// ❌ 臃肿的多功能设备接口
interface MultiFunctionDevice {
  print(document: string): void;
  scan(document: string): string;
  fax(document: string): void;
  copy(document: string): void;
  email(document: string): void;
  cloudUpload(document: string): void;
}

// ❌ 高端多功能打印机 - 可以实现所有功能
class AdvancedPrinterBad implements MultiFunctionDevice {
  print(document: string): void {
    console.log(`打印: ${document}`);
  }

  scan(document: string): string {
    console.log(`扫描: ${document}`);
    return `scanned-${document}`;
  }

  fax(document: string): void {
    console.log(`传真: ${document}`);
  }

  copy(document: string): void {
    console.log(`复印: ${document}`);
  }

  email(document: string): void {
    console.log(`发送邮件: ${document}`);
  }

  cloudUpload(document: string): void {
    console.log(`上传到云: ${document}`);
  }
}

// ❌ 简单打印机 - 被迫实现不需要的功能
class SimplePrinterBad implements MultiFunctionDevice {
  print(document: string): void {
    console.log(`打印: ${document}`);
  }

  // ❌ 问题1: 空实现，浪费代码
  scan(_document: string): string {
    return '';
  }

  // ❌ 问题2: 抛出异常，破坏了接口契约
  fax(_document: string): void {
    throw new Error('该设备不支持传真功能');
  }

  // ❌ 问题3: 空实现
  copy(_document: string): void {
    // 什么都不做
  }

  // ❌ 问题4: 抛出异常
  email(_document: string): void {
    throw new Error('该设备不支持邮件功能');
  }

  // ❌ 问题5: 抛出异常
  cloudUpload(_document: string): void {
    throw new Error('该设备不支持云上传功能');
  }
}

// ❌ 老式传真机 - 也被迫实现所有功能
class OldFaxMachineBad implements MultiFunctionDevice {
  fax(document: string): void {
    console.log(`传真: ${document}`);
  }

  // ❌ 其他功能都不支持，但必须实现
  print(_document: string): void {
    throw new Error('该设备不支持打印功能');
  }

  scan(_document: string): string {
    throw new Error('该设备不支持扫描功能');
  }

  copy(_document: string): void {
    throw new Error('该设备不支持复印功能');
  }

  email(_document: string): void {
    throw new Error('该设备不支持邮件功能');
  }

  cloudUpload(_document: string): void {
    throw new Error('该设备不支持云上传功能');
  }
}

// UI组件
const PrinterManagementBad: React.FC = () => {
  const devices = [
    { name: '高端多功能打印机', device: new AdvancedPrinterBad() },
    { name: '简单打印机', device: new SimplePrinterBad() },
    { name: '老式传真机', device: new OldFaxMachineBad() },
  ];

  const testDevice = (device: MultiFunctionDevice, deviceName: string) => {
    const operations = [
      { name: '打印', fn: () => device.print('文档.pdf') },
      { name: '扫描', fn: () => device.scan('文档.pdf') },
      { name: '传真', fn: () => device.fax('文档.pdf') },
      { name: '复印', fn: () => device.copy('文档.pdf') },
      { name: '发邮件', fn: () => device.email('文档.pdf') },
      { name: '云上传', fn: () => device.cloudUpload('文档.pdf') },
    ];

    console.log(`\n测试设备: ${deviceName}`);
    operations.forEach(({ name, fn }) => {
      try {
        fn();
        console.log(`✅ ${name} 成功`);
      } catch (error) {
        console.log(`❌ ${name} 失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">❌ 违反接口隔离原则</h2>

      <div className="space-y-4">
        {devices.map(({ name, device }) => (
          <div key={name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Printer className="text-gray-600" size={24} />
              <h3 className="font-semibold text-lg">{name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Printer size={16} />
                <span>打印</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Scanner size={16} />
                <span>扫描</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Fax size={16} />
                <span>传真</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wifi size={16} />
                <span>云上传</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => testDevice(device, name)}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              测试所有功能
            </button>
          </div>
        ))}

        <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-800">❌ 问题分析：</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>MultiFunctionDevice接口太臃肿，包含6个方法</li>
            <li>SimplePrinterBad只需要print，却被迫实现其他5个方法</li>
            <li>OldFaxMachineBad只需要fax，却被迫实现其他5个方法</li>
            <li>大量空实现或抛出异常的方法</li>
            <li>违反了接口隔离原则：客户端被迫依赖它不使用的方法</li>
            <li>难以维护：添加新功能时，所有实现类都要修改</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrinterManagementBad;

/**
 * 为什么这违反了ISP？
 *
 * 1. 接口过于臃肿
 *    - MultiFunctionDevice包含了6个方法
 *    - 不是所有设备都需要所有功能
 *
 * 2. 强迫实现不需要的方法
 *    - SimplePrinterBad只需要打印，却要实现扫描、传真等
 *    - OldFaxMachineBad只需要传真，却要实现打印、扫描等
 *
 * 3. 导致的问题
 *    - 大量空实现（违反LSP）
 *    - 抛出异常（破坏接口契约）
 *    - 代码冗余
 *    - 难以测试和维护
 *
 * 解决方案：见good.tsx
 */
