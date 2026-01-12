import { motion } from 'framer-motion';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  progress?: number;
  delay?: number;
  onEnroll?: () => void;
  isEnrolled?: boolean;
}

const CourseCard = ({ course, progress, delay = 0, onEnroll, isEnrolled }: CourseCardProps) => {
  const levelColors = {
    beginner: 'bg-success/10 text-success border-success/20',
    intermediate: 'bg-warning/10 text-warning border-warning/20',
    advanced: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge 
          variant="outline" 
          className={cn("absolute top-3 right-3 capitalize", levelColors[course.level])}
        >
          {course.level}
        </Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white/80 text-sm">{course.category}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Progress or Enroll */}
        {progress !== undefined ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{course.enrolled_count} enrolled</span>
            </div>
            <Button 
              size="sm" 
              variant={isEnrolled ? "secondary" : "default"}
              onClick={onEnroll}
              disabled={isEnrolled}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;
