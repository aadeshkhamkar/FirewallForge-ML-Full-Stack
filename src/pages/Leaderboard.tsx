import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Star,
  User,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { users } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

/* ===================== */
/* RANK CALCULATION */
/* ===================== */
const rankedUsers = [...users]
  .filter(u => u.role === 'student')
  .sort((a, b) => b.progress_percentage - a.progress_percentage)
  .map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

const getRankBadge = (rank: number) => {
  if (rank === 1)
    return { label: 'Gold', icon: Trophy, color: 'bg-yellow-400 text-black' };
  if (rank === 2)
    return { label: 'Silver', icon: Medal, color: 'bg-gray-300 text-black' };
  if (rank === 3)
    return { label: 'Bronze', icon: Medal, color: 'bg-orange-400 text-black' };
  if (rank <= 10)
    return { label: 'Top Performer', icon: Star, color: 'bg-primary text-primary-foreground' };

  return null;
};

const Leaderboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Ranked by overall learning progress
          </p>
        </motion.div>

        {/* DESKTOP TABLE */}
        <div className="glass-card rounded-2xl p-6 hidden md:block">
          <div className="grid grid-cols-5 font-semibold text-sm text-muted-foreground mb-4">
            <span>Rank</span>
            <span>User</span>
            <span>Role</span>
            <span>Progress</span>
            <span>Badge</span>
          </div>

          <div className="space-y-3">
            {rankedUsers.map(user => {
              const badge = getRankBadge(user.rank);

              return (
                <motion.div
                  key={user.user_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: user.rank * 0.02 }}
                  className={`grid grid-cols-5 items-center p-4 rounded-xl ${
                    user.rank <= 3
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-secondary'
                  }`}
                >
                  <span className="font-bold">#{user.rank}</span>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">
                      {user.full_name}
                    </span>
                  </div>

                  <span className="capitalize text-sm">
                    {user.role}
                  </span>

                  <span className="font-semibold">
                    {user.progress_percentage}%
                  </span>

                  <div>
                    {badge ? (
                      <Badge className={badge.color}>
                        <badge.icon className="w-3 h-3 mr-1" />
                        {badge.label}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Learner</Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-4 md:hidden">
          {rankedUsers.map(user => {
            const badge = getRankBadge(user.rank);

            return (
              <motion.div
                key={user.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-4 ${
                  user.rank <= 3
                    ? 'border border-primary/20 bg-primary/10'
                    : ''
                }`}
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-lg">
                    #{user.rank}
                  </span>

                  {badge ? (
                    <Badge className={badge.color}>
                      <badge.icon className="w-3 h-3 mr-1" />
                      {badge.label}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Learner</Badge>
                  )}
                </div>

                {/* USER */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-muted-foreground">
                    Progress
                  </span>
                  <span className="font-semibold">
                    {user.progress_percentage}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
