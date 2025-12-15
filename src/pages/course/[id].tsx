import { useAtomValue } from 'jotai';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import addresses from '@/abis/addresses.json';
import { useUniversityCourse } from '@/hooks/useUniversityCourse';
import { useYCToken } from '@/hooks/useYCToken';
import { accountAtom } from '@/stores/web3Atoms';
import { formatEther, shortenAddress } from '@/utils/helpers';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export default function CourseDetail() {
  const { id } = useParams();
  const courseId = id ? parseInt(id as string, 10) : 0;

  const account = useAtomValue(accountAtom);
  const isConnected = !!account;

  const { useCourse, usePurchaseCourse, useHasPurchased } = useUniversityCourse();
  const { useApprove } = useYCToken();

  const { data: course, isLoading, refetch: refetchCourse } = useCourse(courseId);
  const { data: hasPurchased, refetch: refetchHasPurchased } = useHasPurchased(courseId, account);
  const {
    purchaseCourse,
    isPending: isPurchasing,
    isSuccess: purchaseSuccess,
  } = usePurchaseCourse();
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useApprove();

  const [hasProcessedApprove, setHasProcessedApprove] = useState(false);
  const [hasProcessedPurchase, setHasProcessedPurchase] = useState(false);

  // 监听授权成功
  useEffect(() => {
    if (approveSuccess && !hasProcessedApprove) {
      console.log('✅ 授权成功，准备购买课程');
      setHasProcessedApprove(true);
      purchaseCourse(courseId);
    }
  }, [approveSuccess, hasProcessedApprove, courseId, purchaseCourse]);

  // 监听购买成功
  useEffect(() => {
    if (purchaseSuccess && !hasProcessedPurchase) {
      console.log('🎉 购买成功！');
      setHasProcessedPurchase(true);
      showSuccessToast('购买成功！课程已添加到个人中心');
      // 延迟刷新，确保区块链状态已更新
      setTimeout(() => {
        refetchCourse();
        refetchHasPurchased();
      }, 2000);
    }
  }, [purchaseSuccess, hasProcessedPurchase, refetchCourse, refetchHasPurchased]);

  const handlePurchase = async () => {
    if (!isConnected) {
      showErrorToast('请先连接钱包');
      return;
    }

    if (!course) return;

    try {
      console.log('开始授权 YCT...');
      // 重置状态
      setHasProcessedApprove(false);
      setHasProcessedPurchase(false);
      // 授权 YCT
      approve(addresses.UniversityCourse, course.priceYCT);
    } catch (error) {
      console.error('购买失败:', error);
      //   showErrorToast(error.message || '购买失败');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple blur-xl opacity-50"></div>
          <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan"></div>
        </div>
        <p className="mt-6 text-gray-400 text-lg">加载课程详情...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-cyber-cyan/20 blur-2xl rounded-full"></div>
          <div className="relative glass rounded-full p-8 border border-cyber-cyan/30">
            <BookOpen className="w-24 h-24 text-cyber-cyan mx-auto" />
          </div>
        </div>
        <p className="text-xl text-gray-400">课程不存在</p>
        <p className="text-sm text-gray-500 mt-2">请检查课程ID是否正确</p>
      </div>
    );
  }

  return (
    <>
      <title>{course.title} - Web3 涂山大学</title>

      <div className="max-w-6xl mx-auto">
        {/* 课程封面 */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-2xl blur opacity-40 group-hover:opacity-60 transition"></div>
          <div className="relative h-full bg-gradient-to-br from-cyber-blue/30 via-cyber-purple/30 to-cyber-cyan/30 rounded-2xl overflow-hidden">
            {course.coverUrl ? (
              <img
                src={course.coverUrl}
                alt={course.title}
                className="object-cover mix-blend-overlay"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyber-cyan/20 blur-3xl"></div>
                  <BookOpen size={160} className="text-cyber-cyan relative animate-float" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 课程信息卡片 */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-2xl blur opacity-20"></div>
              <div className="relative glass rounded-2xl p-8 border border-white/10">
                {/* 课程标题 */}
                <h1 className="text-4xl font-bold mb-6 gradient-text animate-slide-up">
                  {course.title}
                </h1>

                {/* 课程元信息 */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">学生数</p>
                      <p className="text-white font-bold">{course.totalStudents.toString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">创建时间</p>
                      <p className="text-white font-bold">
                        {new Date(Number(course.createdAt) * 1000).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 教师信息 */}
                <div className="mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">课程讲师</p>
                  <div className="inline-flex items-center space-x-3 glass rounded-xl px-4 py-3 border border-cyber-cyan/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <span className="text-cyber-cyan font-mono font-bold">
                      {shortenAddress(course.instructor)}
                    </span>
                  </div>
                </div>

                {/* 课程描述 */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 gradient-text">课程描述</h2>
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-cyber-cyan/10 to-cyber-blue/10 rounded-xl blur"></div>
                    <div className="relative glass rounded-xl p-6 border border-white/10">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 侧边栏 - 价格和购买 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-purple via-cyber-blue to-cyber-cyan rounded-2xl blur opacity-40"></div>
                <div className="relative glass rounded-2xl p-8 border border-white/10">
                  {/* 价格 */}
                  <div className="mb-8">
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-3">课程价格</p>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-30"></div>
                      <div className="relative glass rounded-xl p-6 border border-cyber-cyan/30 text-center">
                        <p className="text-5xl font-bold gradient-text mb-2">
                          {formatEther(course.priceYCT)}
                        </p>
                        <p className="text-cyber-cyan text-sm font-bold uppercase tracking-wider">
                          YCT
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 购买按钮 */}
                  <div>
                    {hasPurchased ? (
                      <div className="relative overflow-hidden">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-green to-green-500 rounded-xl blur opacity-50"></div>
                        <button
                          type="button"
                          disabled
                          className="relative w-full px-8 py-5 bg-gradient-to-r from-cyber-green to-green-500 rounded-xl font-bold text-xl text-white cursor-not-allowed"
                        >
                          ✓ 已购买
                        </button>
                      </div>
                    ) : course.instructor.toLowerCase() === account?.toLowerCase() ? (
                      <div className="relative overflow-hidden">
                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-30"></div>
                        <button
                          type="button"
                          disabled
                          className="relative w-full px-8 py-5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl font-bold text-xl text-white cursor-not-allowed"
                        >
                          自己的课程
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePurchase}
                        disabled={!isConnected || isPurchasing || isApproving}
                        className="group relative w-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl blur opacity-60 group-hover:opacity-100 transition disabled:opacity-30"></div>
                        <div className="relative px-8 py-5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-xl text-white transition-transform group-hover:scale-[1.02] disabled:transform-none">
                          {isPurchasing || isApproving ? '处理中...' : '购买课程'}
                        </div>
                      </button>
                    )}

                    {!isConnected && (
                      <div className="mt-4 text-center">
                        <p className="text-red-400 text-sm font-medium">请先连接钱包</p>
                      </div>
                    )}
                  </div>

                  {/* 课程特点 */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan"></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">即时访问</p>
                        <p className="text-sm text-gray-400">购买后立即解锁课程内容</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-cyber-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-cyber-blue"></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">永久拥有</p>
                        <p className="text-sm text-gray-400">课程内容永久保存</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-cyber-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-cyber-purple"></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">安全可靠</p>
                        <p className="text-sm text-gray-400">基于区块链智能合约</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
