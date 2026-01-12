import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  AlertTriangle,
  CheckCircle,
  UserX
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { analyticsData, users, generateMLInsights } from '@/data/mockData';

const COLORS = ['hsl(243, 75%, 59%)', 'hsl(38, 92%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(280, 65%, 60%)', 'hsl(200, 80%, 50%)', 'hsl(0, 84%, 60%)'];

const Analytics = () => {
  const { user } = useAuth();

  // Redirect non-admins/instructors
  if (user && user.role === 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  // Calculate ML insights for all users
  const allInsights = users.filter(u => u.role === 'student').map(generateMLInsights);
  const avgEngagement = Math.round(allInsights.reduce((acc, i) => acc + i.engagement_score, 0) / allInsights.length);
  const avgCompletion = Math.round(allInsights.reduce((acc, i) => acc + i.completion_probability, 0) / allInsights.length);
  const highRiskCount = allInsights.filter(i => i.dropout_risk === 'high').length;
  const lowRiskCount = allInsights.filter(i => i.dropout_risk === 'low').length;

  const dropoutData = [
    { name: 'Low Risk', value: lowRiskCount, color: 'hsl(142, 76%, 36%)' },
    { name: 'Medium Risk', value: allInsights.length - highRiskCount - lowRiskCount, color: 'hsl(38, 92%, 50%)' },
    { name: 'High Risk', value: highRiskCount, color: 'hsl(0, 84%, 60%)' },
  ];

  // Engagement distribution
  const engagementDistribution = [
    { range: '0-25', count: allInsights.filter(i => i.engagement_score < 25).length },
    { range: '26-50', count: allInsights.filter(i => i.engagement_score >= 25 && i.engagement_score < 50).length },
    { range: '51-75', count: allInsights.filter(i => i.engagement_score >= 50 && i.engagement_score < 75).length },
    { range: '76-100', count: allInsights.filter(i => i.engagement_score >= 75).length },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          ML-powered insights and platform analytics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analyticsData.total_users}
          subtitle={`${analyticsData.active_users} active`}
          icon={Users}
          delay={0}
        />
        <StatCard
          title="Total Courses"
          value={analyticsData.total_courses}
          icon={BookOpen}
          variant="primary"
          delay={1}
        />
        <StatCard
          title="Avg. Engagement"
          value={`${avgEngagement}%`}
          icon={TrendingUp}
          trend={{ value: 8, positive: true }}
          delay={2}
        />
        <StatCard
          title="Avg. Completion"
          value={`${avgCompletion}%`}
          icon={Award}
          variant="accent"
          delay={3}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enrollment Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Monthly Enrollments</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthly_enrollments}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Engagement Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.engagement_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Dropout Risk Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Dropout Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dropoutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dropoutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Engagement Score Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="range" type="category" stroke="hsl(var(--muted-foreground))" width={60} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-4))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Course Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-display font-semibold mb-6">Course Enrollment by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.course_distribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ category }) => category.split(' ')[0]}
                >
                  {analyticsData.course_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Risk Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-display font-semibold mb-6">ML Risk Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-success/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/20">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-success">{lowRiskCount}</p>
              <p className="text-sm text-muted-foreground">Low Risk Students</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-warning/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/20">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-warning">
                {allInsights.length - highRiskCount - lowRiskCount}
              </p>
              <p className="text-sm text-muted-foreground">Medium Risk Students</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-destructive/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/20">
              <UserX className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-destructive">{highRiskCount}</p>
              <p className="text-sm text-muted-foreground">High Risk Students</p>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
