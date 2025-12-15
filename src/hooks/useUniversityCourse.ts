import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { accountAtom, contractAtom } from '@/stores/web3Atoms';
import type { Course } from '@/types/course';
import { showErrorToast } from '@/utils/toast';

export const useUniversityCourse = () => {
  const contract = useAtomValue(contractAtom);
  const account = useAtomValue(accountAtom);

  // 获取单个课程详情
  const useCourse = (courseId: number) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCourse = useCallback(async () => {
      if (!contract || courseId <= 0) return;

      try {
        setIsLoading(true);
        setError(null);
        const result = await contract.getCourse(courseId);

        // 将 ethers Result 对象转换为普通对象
        const courseData: Course = {
          id: Number(result.id),
          title: result.title,
          description: result.description,
          coverUrl: result.coverUrl,
          priceYCT: result.priceYCT,
          instructor: result.instructor,
          isActive: result.isActive,
          createdAt: Number(result.createdAt),
          totalStudents: Number(result.totalStudents),
        };

        setCourse(courseData);
      } catch (err) {
        console.error('获取课程失败:', err);
        setError(err as Error);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    }, [courseId]);

    useEffect(() => {
      fetchCourse();
    }, [fetchCourse]);

    return {
      data: course,
      isLoading,
      error,
      refetch: fetchCourse,
    };
  };

  // 购买课程
  const usePurchaseCourse = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const purchaseCourse = useCallback(async (courseId: number) => {
      if (!contract || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        console.log('📝 购买课程:', courseId);
        const tx = await contract.purchaseCourse(courseId);
        console.log('📝 交易已提交:', tx.hash);

        await tx.wait();
        console.log('✅ 交易已确认');

        setIsSuccess(true);
      } catch (err) {
        console.error('购买课程失败:', err);
        // setError(err);
        // showErrorToast(err?.message || '购买失败');
      } finally {
        setIsPending(false);
      }
    }, []);

    // 重置成功状态
    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setIsSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return {
      purchaseCourse,
      isPending,
      isSuccess,
      error,
    };
  };

  // 检查是否已购买
  const useHasPurchased = (courseId: number, userAddress?: string | null) => {
    const [hasPurchased, setHasPurchased] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHasPurchased = useCallback(async () => {
      if (!contract || !userAddress || courseId <= 0) {
        setHasPurchased(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await contract.hasUserPurchased(courseId, userAddress);
        setHasPurchased(result);
      } catch (err) {
        console.error('检查购买状态失败:', err);
        setHasPurchased(false);
      } finally {
        setIsLoading(false);
      }
    }, [courseId, userAddress]);

    useEffect(() => {
      fetchHasPurchased();
    }, [fetchHasPurchased]);

    return {
      data: hasPurchased,
      isLoading,
      refetch: fetchHasPurchased,
    };
  };

  return {
    useCourse,
    usePurchaseCourse,
    useHasPurchased,
  };
};
