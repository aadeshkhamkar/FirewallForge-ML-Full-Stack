export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  course_enrolled: string[];
  progress_percentage: number;
  last_login: string;
  created_at: string;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  enrolled_count: number;
  rating: number;
  category: string;
  thumbnail: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseProgress {
  course_id: string;
  user_id: string;
  progress: number;
  last_accessed: string;
  completed_lessons: number;
  total_lessons: number;
}

export interface MLInsight {
  user_id: string;
  completion_probability: number;
  engagement_score: number;
  dropout_risk: 'low' | 'medium' | 'high';
  recommended_actions: string[];
}

export interface AnalyticsData {
  total_users: number;
  active_users: number;
  total_courses: number;
  avg_completion_rate: number;
  monthly_enrollments: { month: string; count: number }[];
  course_distribution: { category: string; count: number }[];
  engagement_trend: { date: string; score: number }[];
}
