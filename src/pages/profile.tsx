import { useAtomValue } from 'jotai';
import { BookOpen, User, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/common/CourseCard';
import { useYCToken } from '@/hooks/useYCToken';
import { accountAtom, balanceAtom, contractAtom, signerAtom } from '@/stores/web3Atoms';
import type { Course } from '@/types/course';
import { shortenAddress } from '@/utils/helpers';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/utils/toast';

export default function Profile() {
  const account = useAtomValue(accountAtom);
  const ethBalance = useAtomValue(balanceAtom);
  const { yctBalance } = useYCToken();
  const signer = useAtomValue(signerAtom);
  const contract = useAtomValue(contractAtom);
  const isConnected = !!account;

  // 课程相关状态
  const [courses, setCourses] = useState<Course[]>([]);

  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  // 从 localStorage 加载已保存的昵称
  useEffect(() => {
    if (account) {
      const stored = localStorage.getItem(`nickname_${account}`);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setNickname(data.nickname);
        } catch (e) {
          console.error('加载昵称失败:', e);
          setNickname('');
        }
      } else {
        setNickname('');
      }
      setIsEditingNickname(false);
    }
  }, [account]);

  // 获取学生已购买的课程
  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!contract || !account) {
        setCourses([]);
        return;
      }

      try {
        // 假设合约有 getStudentCourses 方法
        const ids = await contract.getStudentCourses(account);
        const courseIdsArray = ids.map((id: bigint) => Number(id));

        // 获取每个课程的详情
        const coursesData = await Promise.all(
          courseIdsArray.map(async (id: number) => {
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
        setCourses(coursesData);
      } catch (error) {
        console.error('获取学生课程失败:', error);
        setCourses([]);
      }
    };

    fetchStudentCourses();
  }, [contract, account]);

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

    try {
      showLoadingToast('请在 MetaMask 中签名...');

      // 创建签名消息
      const timestamp = Date.now();
      const message = `设置昵称为: ${nickname}\n\n地址: ${account}\n时间戳: ${timestamp}`;

      // 使用 ethers.js 的 signer 进行签名
      const signature = await signer.signMessage(message);

      // 保存到 localStorage（在实际应用中应该发送到后端）
      const data = {
        nickname,
        address: account,
        signature,
        timestamp,
        message,
      };

      localStorage.setItem(`nickname_${account}`, JSON.stringify(data));
      setIsEditingNickname(false);

      dismissToast();
      showSuccessToast('昵称设置成功！');
    } catch (error) {
      dismissToast();
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      const errorCode = error && typeof error === 'object' && 'code' in error ? error.code : null;

      if (errorMessage.includes('user rejected') || errorCode === 'ACTION_REJECTED') {
        showErrorToast('签名被取消');
      } else {
        showErrorToast(`签名失败: ${errorMessage}`);
      }
      console.error('签名错误:', error);
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
                    {nickname || shortenAddress(account || '')}
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

      {/* 我的课程 */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-2xl blur opacity-10"></div>
        <div className="relative glass rounded-2xl p-8 border border-white/10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-bold gradient-text">我的课程</h2>
          </div>

          {courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
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
