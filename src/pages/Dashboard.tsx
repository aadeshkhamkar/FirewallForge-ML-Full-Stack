import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Brain,
  FileText,
  Award,
  Activity,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";

import { courses, analyticsData } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard: React.FC = () => {
  /* ===================================================== */
  /* AUTHENTICATED USER */
  /* ===================================================== */
  const { user, isLoading } = useAuth();

  /* ===================================================== */
  /* DERIVED DATA */
  /* ===================================================== */
  const enrolledCourses = user
    ? courses.filter((course) => user.course_enrolled?.includes(course.id))
    : [];

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-muted-foreground">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  /* ===================================================== */
  /* RENDER */
  /* ===================================================== */
  return (
    <DashboardLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold mb-2">
          {getGreeting()},{" "}
          {(user?.full_name || user?.name || "Learner").split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Track learning performance, engagement, and AI insights
        </p>
      </motion.div>

      {/* ===================================================== */}
      {/* TOP STATS – 2 × 4 GRID */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analyticsData.total_users}
          icon={Users}
        />
        <StatCard
          title="Active Learners"
          value={analyticsData.active_users}
          icon={Activity}
        />
        <StatCard
          title="Total Courses"
          value={analyticsData.total_courses}
          icon={BookOpen}
        />
        <StatCard
          title="Avg Completion"
          value={`${analyticsData.avg_completion_rate}%`}
          icon={TrendingUp}
        />

        <StatCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          icon={Award}
        />
        <StatCard title="Avg Study Time" value="14 hrs" icon={Clock} />
        <StatCard title="AI Accuracy" value="96%" icon={Brain} />
        <StatCard title="Resources Viewed" value="18,000" icon={FileText} />
      </div>

      {/* ===================================================== */}
      {/* CHARTS SECTION */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* LINE CHART */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">Engagement Trend</h3>
              <p className="text-sm text-muted-foreground">
                Last 7 weeks learning activity
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              Live Analytics
            </span>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.engagement_trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-1">Course Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Learners by domain
          </p>

          <div className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.course_distribution}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {analyticsData.course_distribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* ML INSIGHTS */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
