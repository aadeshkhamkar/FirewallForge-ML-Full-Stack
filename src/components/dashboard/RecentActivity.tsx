import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckCircle, Trophy } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'lesson_complete' | 'course_start' | 'achievement' | 'login';
  title: string;
  description: string;
  timestamp: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'lesson_complete',
    title: 'Completed Lesson',
    description: 'Neural Networks Introduction - ML Essentials',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'Completed 10 lessons this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'course_start',
    title: 'Started New Course',
    description: 'Data Science & Analytics',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '4',
    type: 'lesson_complete',
    title: 'Completed Lesson',
    description: 'React Hooks Deep Dive - Web Development',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

const activityIcons = {
  lesson_complete: CheckCircle,
  course_start: BookOpen,
  achievement: Trophy,
  login: Clock,
};

const activityColors = {
  lesson_complete: 'bg-success/10 text-success',
  course_start: 'bg-primary/10 text-primary',
  achievement: 'bg-accent/10 text-accent',
  login: 'bg-secondary text-muted-foreground',
};

const RecentActivity = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg">Recent Activity</h3>
        <span className="text-sm text-muted-foreground">Last 7 days</span>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`p-2 rounded-lg ${activityColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
