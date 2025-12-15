import { BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '@/types/course';
import { formatEther } from '@/utils/helpers';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/course/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* 课程封面 */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
          {course.coverUrl ? (
            <img src={course.coverUrl} alt={course.title} className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={64} className="text-primary-300" />
            </div>
          )}
        </div>

        {/* 课程信息 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users size={16} />
              <span>{course.totalStudents.toString()} 学生</span>
            </div>
            <div className="text-lg font-bold text-primary-600">
              {formatEther(course.priceYCT)} YCT
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
