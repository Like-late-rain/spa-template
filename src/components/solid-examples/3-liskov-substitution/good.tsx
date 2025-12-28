import type React from 'react';
import { useState } from 'react';

/**
 * ✅ 遵守里氏替换原则 (LSP)
 *
 * 解决方案：
 * 1. 使用接口而非继承
 * 2. 不强制Square和Rectangle之间的继承关系
 * 3. 每个类独立实现，保持各自的约束
 * 4. 所有实现类都能正确替换接口
 */

// 方案1: 使用接口定义共同行为
interface Shape {
  getArea(): number;
  getPerimeter(): number;
  render(): React.ReactNode;
}

// 矩形类：可以独立设置宽高
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

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  render(): React.ReactNode {
    return (
      <div
        className="bg-blue-100 border-2 border-blue-500 inline-block"
        style={{ width: `${this.width * 20}px`, height: `${this.height * 20}px` }}
      />
    );
  }
}

// 正方形类：保持边长相等的约束
class Square implements Shape {
  constructor(private side: number) {}

  setSide(side: number): void {
    this.side = side;
  }

  getSide(): number {
    return this.side;
  }

  getArea(): number {
    return this.side * this.side;
  }

  getPerimeter(): number {
    return 4 * this.side;
  }

  render(): React.ReactNode {
    return (
      <div
        className="bg-green-100 border-2 border-green-500 inline-block"
        style={{ width: `${this.side * 20}px`, height: `${this.side * 20}px` }}
      />
    );
  }
}

// 圆形类：演示接口的扩展性
class Circle implements Shape {
  constructor(private radius: number) {}

  setRadius(radius: number): void {
    this.radius = radius;
  }

  getRadius(): number {
    return this.radius;
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  render(): React.ReactNode {
    return (
      <div
        className="bg-purple-100 border-2 border-purple-500 rounded-full inline-block"
        style={{ width: `${this.radius * 40}px`, height: `${this.radius * 40}px` }}
      />
    );
  }
}

// 使用示例组件
const ShapeCalculatorGood: React.FC = () => {
  const [results, setResults] = useState<Array<{ name: string; area: number; perimeter: number }>>(
    []
  );

  // ✅ 这个函数可以接受任何Shape的实现
  // 所有实现都能正确工作，不会有意外行为
  const calculateShapeMetrics = (shape: Shape, name: string) => {
    return {
      name,
      area: shape.getArea(),
      perimeter: shape.getPerimeter(),
    };
  };

  const testShapes = () => {
    const shapes = [
      { shape: new Rectangle(5, 4), name: '矩形 (5×4)' },
      { shape: new Square(5), name: '正方形 (边长5)' },
      { shape: new Circle(3), name: '圆形 (半径3)' },
    ];

    const calculatedResults = shapes.map(({ shape, name }) => calculateShapeMetrics(shape, name));

    setResults(calculatedResults);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">✅ 遵守里氏替换原则</h2>

      <div className="mb-6">
        <button
          type="button"
          onClick={testShapes}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
        >
          计算所有图形的面积和周长
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => {
            const shapes = [new Rectangle(5, 4), new Square(5), new Circle(3)];
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{result.name}</h3>
                  <div className="flex items-center gap-4">{shapes[index].render()}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <span className="text-gray-600">面积:</span>
                    <span className="ml-2 font-semibold text-blue-600">
                      {result.area.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <span className="text-gray-600">周长:</span>
                    <span className="ml-2 font-semibold text-purple-600">
                      {result.perimeter.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-green-50 rounded border border-green-200">
            <h3 className="font-semibold mb-2 text-green-800">✅ 符合LSP的优点：</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>所有Shape实现都能正确替换接口</li>
              <li>每个类保持自己的约束，不会互相干扰</li>
              <li>Rectangle可以独立设置宽高</li>
              <li>Square保持边长相等的约束</li>
              <li>Circle有自己独特的属性（半径）</li>
              <li>calculateShapeMetrics函数对所有实现都工作正常</li>
              <li>易于扩展：添加新图形（如三角形）不影响现有代码</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-800">设计原则：</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>优先使用组合而非继承</li>
          <li>使用接口定义共同行为</li>
          <li>每个类独立实现，保持各自约束</li>
          <li>不要强制"IS-A"关系（正方形不继承矩形）</li>
          <li>确保子类型能真正替换父类型</li>
        </ul>
      </div>
    </div>
  );
};

export default ShapeCalculatorGood;

/**
 * 为什么这符合LSP？
 *
 * ✅ 正确的设计：
 * 1. Shape是一个接口，定义了共同的行为
 * 2. Rectangle、Square、Circle都实现Shape接口
 * 3. 没有继承关系，避免了行为冲突
 * 4. 每个类保持自己的约束和不变量
 *
 * ✅ LSP的好处：
 * 1. 可替换性：任何Shape的实现都能用在calculateShapeMetrics中
 * 2. 可预测性：每个实现的行为都符合接口契约
 * 3. 可扩展性：容易添加新的图形类型
 * 4. 可维护性：修改一个类不影响其他类
 *
 * 关键点：
 * - 不是所有数学上的"IS-A"关系都适合用继承表达
 * - 继承应该用于行为的替换，而非概念的分类
 * - 当子类需要改变父类的行为时，考虑使用组合或接口
 */
