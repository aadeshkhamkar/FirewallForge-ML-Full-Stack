import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { courses } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/* ===================== */
/* MOCK LESSON DATA */
/* ===================== */
const lessons = [
  { id: 'l1', title: 'Introduction to Microservices', duration: '28 min', completed: true },
  { id: 'l2', title: 'Basic Microservices App – Part 1', duration: '33 min', completed: true },
  { id: 'l3', title: 'Basic Microservices App – Part 2', duration: '18 min', completed: false },
  { id: 'l4', title: 'Service Registry & Discovery – Netflix Eureka', duration: '23 min', completed: false },
  { id: 'l5', title: 'Netflix Eureka – Server II', duration: '16 min', completed: false },
];

const tabs = ['Overview', 'Q&A', 'Notes', 'Announcements', 'Reviews'];

const CourseAnalytics = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);

  // HARD GUARD (prevents blank screen)
  if (!course) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-muted-foreground">
          Course not found
        </div>
      </DashboardLayout>
    );
  }

  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [activeTab, setActiveTab] = useState('Overview');

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  return (
    <DashboardLayout>
      {/* ===================== */}
      {/* VIDEO PLAYER + CONTENT */}
      {/* ===================== */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        {/* VIDEO PLAYER */}
        <div className="xl:col-span-3 bg-black rounded-xl relative overflow-hidden">
          <div className="aspect-video flex items-center justify-center">
            <Play className="w-16 h-16 text-white opacity-80" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <Progress value={progress} />
            <p className="text-xs text-white/70 mt-1">
              {completedCount}/{lessons.length} lectures completed
            </p>
          </div>
        </div>

        {/* COURSE CONTENT SIDEBAR */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-lg">Course content</h3>

          {lessons.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg text-left transition',
                activeLesson.id === lesson.id
                  ? 'bg-primary/10'
                  : 'hover:bg-secondary'
              )}
            >
              {lesson.completed ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <Play className="w-4 h-4 text-muted-foreground" />
              )}

              <div className="flex-1">
                <p className="text-sm font-medium">{lesson.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* TABS */}
      {/* ===================== */}
      <div className="flex gap-6 border-b mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-3 text-sm font-medium',
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===================== */}
      {/* TAB CONTENT */}
      {/* ===================== */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        {activeTab === 'Overview' ? (
          <>
            <h2 className="text-xl font-semibold mb-3">{course.title}</h2>
            <p className="text-muted-foreground mb-4">
              {course.description}
            </p>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>Duration: {course.duration}</li>
              <li>Level: {course.level}</li>
              <li>Lessons: {course.lessons}</li>
              <li>Instructor: {course.instructor}</li>
            </ul>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            {activeTab} section coming soon.
          </p>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default CourseAnalytics;
