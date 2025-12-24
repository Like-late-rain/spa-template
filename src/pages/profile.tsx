import { useAtomValue, useSetAtom } from 'jotai';
import { BookOpen, User, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/common/CourseCard';
import { useYCToken } from '@/hooks/useYCToken';
import { updateUser } from '@/services/userApi';
import {
  accountAtom,
  balanceAtom,
  contractAtom,
  currentUserAtom,
  signerAtom,
} from '@/stores/web3Atoms';
import type { Course } from '@/types/course';
import { shortenAddress } from '@/utils/helpers';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/utils/toast';

export default function Profile() {
  const account = useAtomValue(accountAtom);
  const ethBalance = useAtomValue(balanceAtom);
  const { yctBalance, refetchBalance } = useYCToken();
  const signer = useAtomValue(signerAtom);
  const contract = useAtomValue(contractAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);

  const isConnected = !!account;

  // 课程相关状态
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]); // 我创建的课程
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]); // 我购买的课程
  const [activeTab, setActiveTab] = useState<'created' | 'purchased'>('created'); // 当前激活的 Tab

  const [nickname, setNickname] = useState(currentUser?.name || '');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 在第30行后添加
  useEffect(() => {
    // 当 currentUser 更新时，同步到 nickname
    if (currentUser?.name) {
      setNickname(currentUser.name);
    }
  }, [currentUser]);

  // 获取我创建的课程和购买的课程
  useEffect(() => {
    const fetchAllCourses = async () => {
      if (!contract || !account) {
        setCreatedCourses([]);
        setPurchasedCourses([]);
        return;
      }

      try {
        // 1️⃣ 获取我创建的课程
        // 使用 getInstructorCourses 方法直接获取我创建的课程 ID
        const createdIds = await contract.getInstructorCourses(account);
        const createdIdsArray = createdIds.map((id: bigint) => Number(id));

        const createdCoursesData = await Promise.all(
          createdIdsArray.map(async (id: number) => {
            const courseData = await contract.getCourse(id);
            return {
              id: Number(courseData.id),
              title: courseData.title,
              description: courseData.description,
              coverUrl: courseData.coverUrl,
              priceYCT: courseData.priceYCT,
              instructor: courseData.instructor,
              isActive: courseData.isActive,
              createdAt: Number(courseData.createdAt),
              totalStudents: Number(courseData.totalStudents),
            };
          })
        );
        setCreatedCourses(createdCoursesData);

        // 2️⃣ 获取我购买的课程
        const purchasedIds = await contract.getStudentCourses(account);
        const purchasedIdsArray = purchasedIds.map((id: bigint) => Number(id));

        const purchasedCoursesData = await Promise.all(
          purchasedIdsArray.map(async (id: number) => {
            const courseData = await contract.getCourse(id);
            return {
              id: Number(courseData.id),
              title: courseData.title,
              description: courseData.description,
              coverUrl: courseData.coverUrl,
              priceYCT: courseData.priceYCT,
              instructor: courseData.instructor,
              isActive: courseData.isActive,
              createdAt: Number(courseData.createdAt),
              totalStudents: Number(courseData.totalStudents),
            };
          })
        );
        setPurchasedCourses(purchasedCoursesData);

        console.log('✅ 课程加载完成:', {
          created: createdCoursesData.length,
          purchased: purchasedCoursesData.length,
        });
      } catch (error) {
        console.error('获取课程失败:', error);
        setCreatedCourses([]);
        setPurchasedCourses([]);
      }
    };

    fetchAllCourses();
  }, [contract, account]);

  // 刷新 YCT 余额
  useEffect(() => {
    // 当钱包连接且合约加载完成时，刷新 YCT 余额
    if (account && contract) {
      refetchBalance();
    }
  }, [account, contract, refetchBalance]);

  // 保存昵称
  const handleSaveNickname = async () => {
    if (!nickname || !account) {
      showErrorToast('请输入昵称');
      return;
    }

    if (nickname.length < 2 || nickname.length > 20) {
      showErrorToast('昵称长度应在 2-20 个字符之间');
      return;
    }

    if (!signer) {
      showErrorToast('请先连接钱包');
      return;
    }

    if (!currentUser) {
      showErrorToast('用户信息加载中，请稍后再试');
      return;
    }

    try {
      showLoadingToast('请在 MetaMask 中签名...');

      // 创建签名消息
      const timestamp = Date.now();
      const message = `更新个人信息\n\n名称: ${nickname}\n地址: ${account}\n时间戳: ${timestamp}`;

      // 使用 ethers.js 的 signer 进行签名
      const signature = await signer.signMessage(message);
      console.log('🚀 ~ handleSaveNickname ~ signature:', signature);
      console.log('currentUser======>>>>', currentUser);
      dismissToast();
      showLoadingToast('正在保存...');

      // 调用后端 API 更新用户信息
      const updatedUser = await updateUser(currentUser.id, {
        name: nickname,
        signature,
        timestamp,
      });

      dismissToast();
      setCurrentUser(updatedUser);
      showSuccessToast('昵称设置成功！');
      setIsEditingNickname(false);
      console.log('✅ 用户信息已更新:', updatedUser);
    } catch (error) {
      dismissToast();
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : null;

      if (errorMessage.includes('user rejected') || errorCode === 'ACTION_REJECTED') {
        showErrorToast('签名被取消');
      } else {
        showErrorToast(`更新失败: ${errorMessage}`);
      }
      console.error('更新用户信息错误:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-cyber-cyan/20 blur-2xl rounded-full"></div>
          <div className="relative glass rounded-full p-8 border border-cyber-cyan/30">
            <Wallet className="w-24 h-24 text-cyber-cyan mx-auto" />
          </div>
        </div>
        <p className="text-xl text-gray-400">请先连接钱包</p>
        <p className="text-sm text-gray-500 mt-2">连接钱包后即可查看个人中心</p>
      </div>
    );
  }

  return (
    <>
      <title>个人中心 - Web3 涂山大学</title>

      {/* 页面头部 */}
      <div className="relative mb-12">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-purple/10 blur-3xl -z-10"></div>
        <h1 className="text-5xl font-bold mb-4 gradient-text animate-slide-up text-center">
          个人中心
        </h1>
      </div>

      {/* 用户信息卡片 */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-2xl blur opacity-20"></div>
        <div className="relative glass rounded-2xl p-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6 mb-8">
            {/* 头像 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-purple rounded-full blur opacity-60 group-hover:opacity-100 transition animate-pulse-slow"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-purple rounded-full flex items-center justify-center shadow-neon-cyan">
                <User className="text-white" size={48} />
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-3 mb-3">
                {isEditingNickname ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      maxLength={20}
                      className="w-full px-4 py-2 bg-dark-card/50 border border-cyber-cyan/30 rounded-lg text-white focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/30 transition-all"
                      placeholder="输入昵称 (2-20字符)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {nickname.length}/20 字符 · 需要 MetaMask 签名确认
                    </p>
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold gradient-text">
                    {currentUser?.name || currentUser?.username || shortenAddress(account || '')}
                  </h2>
                )}
                <button
                  type="button"
                  onClick={
                    isEditingNickname ? handleSaveNickname : () => setIsEditingNickname(true)
                  }
                  className="inline-flex items-center px-4 py-2 glass rounded-lg border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition text-sm font-medium mt-2 md:mt-0"
                >
                  {isEditingNickname ? '✓ 保存' : '✏️ 编辑'}
                </button>
              </div>
              <p className="text-sm text-gray-400 font-mono mb-2">{account}</p>
            </div>
          </div>

          {/* 余额信息 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative glass rounded-xl p-5 border border-white/10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                    <Wallet size={20} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">ETH</p>
                </div>
                <p className="text-2xl font-bold text-white">{ethBalance || '0.0000'}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-40 group-hover:opacity-70 transition"></div>
              <div className="relative glass rounded-xl p-5 border border-cyber-cyan/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
                    <Wallet size={20} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">YCT</p>
                </div>
                <p className="text-2xl font-bold gradient-text">{yctBalance || '0.0000'}</p>
              </div>
            </div>
            {/* 隐藏此模块 */}
            <div className="relative group hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-green to-green-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative glass rounded-xl p-5 border border-cyber-green/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-green to-green-500 flex items-center justify-center">
                    <Wallet size={20} className="text-white" />
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">USDT</p>
                </div>
                <p className="text-2xl font-bold text-cyber-green">0.00</p>
                <p className="text-xs text-gray-500 mt-1">待实现</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 我的课程 - 带 Tab 切换 */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-2xl blur opacity-10"></div>
        <div className="relative glass rounded-2xl p-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold gradient-text">我的课程</h2>
            </div>

            {/* Tab 切换按钮 */}
            <div className="flex items-center space-x-2 glass rounded-lg p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('created')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'created'
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-white shadow-neon-cyan'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                我创建的 ({createdCourses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('purchased')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'purchased'
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-white shadow-neon-cyan'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                我购买的 ({purchasedCourses.length})
              </button>
            </div>
          </div>

          {/* 课程列表 - 根据 activeTab 显示不同内容 */}
          {activeTab === 'created' ? (
            // 我创建的课程
            createdCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
                  <div className="relative glass rounded-full p-8 border border-cyber-blue/30">
                    <BookOpen size={64} className="text-cyber-blue mx-auto" />
                  </div>
                </div>
                <p className="text-xl text-gray-400 mb-2">还没有创建任何课程</p>
                <p className="text-sm text-gray-500 mb-6">创建你的第一个课程吧</p>
                <a
                  href="/create-course"
                  className="group relative inline-flex items-center justify-center"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>
                  <div className="relative px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-white hover:scale-105 transition">
                    创建课程
                  </div>
                </a>
              </div>
            )
          ) : // 我购买的课程
          purchasedCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full"></div>
                <div className="relative glass rounded-full p-8 border border-cyber-blue/30">
                  <BookOpen size={64} className="text-cyber-blue mx-auto" />
                </div>
              </div>
              <p className="text-xl text-gray-400 mb-2">还没有购买任何课程</p>
              <p className="text-sm text-gray-500 mb-6">去课程市场看看吧</p>
              <a href="/market" className="group relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-60 group-hover:opacity-100 transition"></div>
                <div className="relative px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-white hover:scale-105 transition">
                  浏览课程
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
