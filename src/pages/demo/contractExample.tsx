import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { accountAtom, contractAtom } from '@/stores/web3Atoms';

/**
 * 示例组件：展示如何在其他组件中使用全局合约实例
 * 💡 在 IDE 中输入 contract. 后会自动提示所有可用的方法！
 */
const ContractExample = () => {
  // 直接从全局获取合约实例，无需手动创建
  const contract = useAtomValue(contractAtom);
  const account = useAtomValue(accountAtom);
  const [courseCount, setCourseCount] = useState<string>('');

  // ========== 读取方法示例 (view/pure，不消耗 gas) ==========

  // 示例1: 获取课程总数
  const handleGetCourseCount = async () => {
    if (!contract) {
      alert('请先连接钱包');
      return;
    }

    try {
      // 💡 输入 contract. 后 IDE 会提示所有方法
      const count = await contract.courseCounter();
      setCourseCount(count.toString());
      console.log('课程总数:', count.toString());
    } catch (error) {
      console.error('读取失败:', error);
    }
  };

  // 示例2: 获取活跃课程列表
  const handleGetActiveCourses = async () => {
    if (!contract) return;

    try {
      // offset: 0, limit: 10 - 获取前10个课程
      const courses = await contract.getActiveCourses(0, 10);
      console.log('活跃课程:', courses);
    } catch (error) {
      console.error('读取失败:', error);
    }
  };

  // 示例3: 获取单个课程信息
  const handleGetCourse = async () => {
    if (!contract) return;

    try {
      const courseId = 1;
      const course = await contract.getCourse(courseId);
      console.log('课程信息:', {
        id: course.id.toString(),
        title: course.title,
        description: course.description,
        priceYCT: course.priceYCT.toString(),
        instructor: course.instructor,
      });
    } catch (error) {
      console.error('读取失败:', error);
    }
  };

  // ========== 写入方法示例 (需要交易确认，消耗 gas) ==========

  // 示例4: 创建课程
  const handleCreateCourse = async () => {
    if (!contract) return;

    try {
      // 会弹出 MetaMask 确认交易
      const tx = await contract.createCourse(
        'Web3 开发入门',
        '学习智能合约开发',
        'https://example.com/cover.jpg',
        100
      );

      console.log('交易已发送:', tx.hash);
      const receipt = await tx.wait();
      console.log('交易已确认!', receipt);
    } catch (error) {
      console.error('创建课程失败:', error);
    }
  };

  // 示例5: 购买课程
  const handlePurchaseCourse = async () => {
    if (!contract) return;

    try {
      const courseId = 1;
      const tx = await contract.purchaseCourse(courseId);
      console.log('购买交易:', tx.hash);
      await tx.wait();
      console.log('购买成功!');
    } catch (error) {
      console.error('购买失败:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>合约操作示例</h2>

      {!contract ? (
        <p>⚠️ 请先连接钱包</p>
      ) : (
        <div>
          <h3>📖 读取方法（不消耗 gas）</h3>
          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={handleGetCourseCount}>
              获取课程总数
            </button>
            {courseCount && <span> → 总数: {courseCount}</span>}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={handleGetActiveCourses}>
              获取活跃课程
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button type="button" onClick={handleGetCourse}>
              获取课程详情
            </button>
          </div>

          <h3>✍️ 写入方法（需要交易，消耗 gas）</h3>
          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={handleCreateCourse}>
              创建课程
            </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button type="button" onClick={handlePurchaseCourse}>
              购买课程
            </button>
          </div>

          <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>当前账户: {account}</p>
        </div>
      )}
    </div>
  );
};

export default ContractExample;
