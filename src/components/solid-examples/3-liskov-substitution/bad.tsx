import type React from 'react';
import { useState } from 'react';

/**
 * ❌ 违反里氏替换原则 (LSP)
 *
 * 问题：
 * 1. 子类Square改变了父类Rectangle的行为
 * 2. 使用Square替换Rectangle会导致意外结果
 * 3. 违反了"子类必须能够替换父类"的原则
 */

// 基类：矩形
class Rectangle {
  protected width: number = 0;
  protected height: number = 0;

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// 子类：正方形
// 问题：正方形继承矩形看似合理，但实际上违反了LSP
class Square extends Rectangle {
  // 重写setWidth，同时设置height
  override setWidth(width: number): void {
    this.width = width;
    this.height = width; // 强制width和height相等
  }

  // 重写setHeight，同时设置width
  override setHeight(height: number): void {
    this.width = height; // 强制width和height相等
    this.height = height;
  }
}

// 使用示例组件
const ShapeCalculatorBad: React.FC = () => {
  const [rectangleArea, setRectangleArea] = useState<number>(0);
  const [squareArea, setSquareArea] = useState<number>(0);

  // 这个函数期望传入Rectangle，并计算面积
  const calculateArea = (rect: Rectangle): number => {
    rect.setWidth(5);
    rect.setHeight(4);
    // 期望面积 = 5 × 4 = 20
    return rect.getArea();
  };

  const testRectangle = () => {
    const rect = new Rectangle();
    const area = calculateArea(rect);
    setRectangleArea(area);
    // ✅ 结果正确: 20
  };

  const testSquare = () => {
    const square = new Square();
    const area = calculateArea(square);
    setSquareArea(area);
    // ❌ 结果错误: 16 (因为最后设置的是height=4，width也被设置为4)
    // 这违反了LSP！用Square替换Rectangle改变了程序行为
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">❌ 违反里氏替换原则</h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">矩形测试</h3>
          <button
            type="button"
            onClick={testRectangle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            计算矩形面积 (5 × 4)
          </button>
          {rectangleArea > 0 && (
            <p className="mt-2 text-green-600">✅ 结果: {rectangleArea} (正确，符合预期)</p>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">正方形测试</h3>
          <button
            type="button"
            onClick={testSquare}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            计算正方形面积 (应该也是 5 × 4 = 20)
          </button>
          {squareArea > 0 && (
            <p className="mt-2 text-red-600">
              ❌ 结果: {squareArea} (错误！应该是20，但因为Square改变了行为，结果是16)
            </p>
          )}
        </div>

        <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-800">问题分析：</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Square继承Rectangle看似合理（数学上正方形是特殊的矩形）</li>
            <li>但在编程中，Square改变了Rectangle的行为</li>
            <li>setWidth()和setHeight()的前置条件被加强了</li>
            <li>用Square替换Rectangle会导致意外结果</li>
            <li>违反了LSP：子类不能完全替换父类</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShapeCalculatorBad;

/**
 * 为什么这违反了LSP？
 *
 * LSP的核心要求：
 * 1. 前置条件不能加强
 * 2. 后置条件不能削弱
 * 3. 不变量必须保持
 * 4. 历史约束必须保持
 *
 * Square违反了这些要求：
 * - Rectangle的约束：可以独立设置width和height
 * - Square的约束：width和height必须相等（加强了前置条件）
 *
 * 结果：
 * - 代码中使用Rectangle的地方，不能安全地替换为Square
 * - calculateArea函数假设可以独立设置宽高，但Square破坏了这个假设
 *
 * 解决方案：
 * - 不要让Square继承Rectangle
 * - 使用组合而非继承
 * - 或者重新设计类层次结构（见good.tsx）
 */
