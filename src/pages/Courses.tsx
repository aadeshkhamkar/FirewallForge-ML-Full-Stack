import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '@/components/layout/DashboardLayout';
import CourseCard from '@/components/dashboard/CourseCard';
import { courses } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const categories = [
  'All',
  'Computer Science',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Design',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // ✅ IMPORTANT

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  if (!user) return null;

  /* ===================== */
  /* FILTER COURSES */
  /* ===================== */
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === 'All Levels' ||
      course.level === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  /* ===================== */
  /* ENROLL (SOURCE OF TRUTH) */
  /* ===================== */
  const handleEnroll = (courseId: string) => {
    if (user.course_enrolled.includes(courseId)) return;

    user.course_enrolled.push(courseId); // ✅ KEY FIX

    const course = courses.find(c => c.id === courseId);
    toast({
      title: 'Successfully Enrolled!',
      description: `You are now enrolled in ${course?.title}`,
    });
  };

  const openAnalytics = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold mb-2">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover courses tailored to your learning goals
        </p>
      </motion.div>

      {/* SEARCH */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="flex items-center gap-4 mb-6">
        <BookOpen className="w-5 h-5 text-muted-foreground" />
        <span>{filteredCourses.length} courses found</span>

        {user.course_enrolled.length > 0 && (
          <Badge variant="secondary" className="bg-success/10 text-success">
            {user.course_enrolled.length} enrolled
          </Badge>
        )}
      </div>

      {/* COURSES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            onClick={() => openAnalytics(course.id)}
            className="cursor-pointer"
          >
            <CourseCard
              course={course}
              delay={index}
              isEnrolled={user.course_enrolled.includes(course.id)}
              onEnroll={(e?: React.MouseEvent) => {
                e?.stopPropagation(); // prevent navigation
                handleEnroll(course.id);
              }}
            />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
