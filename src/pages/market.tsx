import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from '@/components//common/SearchBar';
import CourseCard from '@/components/common/CourseCard';
import { universityCourseAtom } from '@/stores/web3Atoms';
import type { Course } from '@/types/course';

export default function Market() {
  const [searchQuery, setSearchQuery] = useState('');
  const contract = useAtomValue(universityCourseAtom);
  const [courseCount, setCourseCount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // 搜索过滤
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchQuery) return courses;

    return courses.filter(
      (course: Course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // 获取课程总数
  const handleGetCourseCount = useCallback(() => {
    if (!contract) return;

    // 💡 输入 contract. 后 IDE 会提示所有方法
    contract.courseCounter().then((count) => {
      setCourseCount(count.toString());
    });
  }, [contract]);

  // 获取活跃课程列表
  const handleGetCourse = useCallback(
    (offset: number = 0, limit: number = 10) => {
      if (!contract) return;
      setLoading(true);
      contract
        .getActiveCourses(offset, limit)
        .then((result) => {
          const list = result.map((course) => ({
            id: Number(course.id),
            title: course.title,
            description: course.description,
            coverUrl: course.coverUrl,
            priceYCT: course.priceYCT,
            instructor: course.instructor,
            isActive: course.isActive,
            createdAt: Number(course.createdAt),
            totalStudents: Number(course.totalStudents),
          }));
          setCourses(list);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [contract]
  );

  useEffect(() => {
    handleGetCourse();
  }, [handleGetCourse]);

  useEffect(() => {
    handleGetCourseCount();
  }, [handleGetCourseCount]);

  return (
    <>
      {/* 页面头部 */}
      <div className="relative mb-12">
        {/* 装饰性光晕 */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-cyan/10 blur-3xl rounded-full -z-10"></div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text animate-slide-up">课程市场</h1>
          <p className="text-xl text-gray-400 mb-8 animate-slide-up">发现并学习优质的 Web3 课程</p>
        </div>

        {/* 统计数据卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <div className="relative glass rounded-2xl p-6 border border-cyber-cyan/30">
              <p className="text-sm text-gray-400 mb-2">总课程数</p>
              <p className="text-3xl font-bold gradient-text">
                {courseCount ? courseCount.toString() : '0'}
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <div className="relative glass rounded-2xl p-6 border border-cyber-blue/30">
              <p className="text-sm text-gray-400 mb-2">可选课程</p>
              <p className="text-3xl font-bold gradient-text">{courses ? courses.length : '0'}</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-purple to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition"></div>
            <div className="relative glass rounded-2xl p-6 border border-cyber-purple/30">
              <p className="text-sm text-gray-400 mb-2">搜索结果</p>
              <p className="text-3xl font-bold gradient-text">{filteredCourses.length}</p>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* 课程列表 */}
      {loading ? (
        <div className="text-center py-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple blur-xl opacity-50"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan"></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">加载课程中...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyber-cyan/20 blur-2xl rounded-full"></div>
            <div className="relative glass rounded-full p-8 border border-cyber-cyan/30">
              <svg
                className="w-24 h-24 text-cyber-cyan mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>No courses found</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xl text-gray-400">暂无课程</p>
          <p className="text-sm text-gray-500 mt-2">尝试调整搜索条件或稍后再来</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {filteredCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}
