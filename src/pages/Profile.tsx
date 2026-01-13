import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, BookOpen, Award } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/mockData";

const Profile = () => {
  const { user } = useAuth();

  /* ===================== */
  /* SAFETY GUARD */
  /* ===================== */
  if (!user) return null;

  /* ===================== */
  /* DERIVED DATA */
  /* ===================== */
  const enrolledCourses = courses.slice(0, 3); // demo-safe
  const progress = 65; // demo progress %

  const roleColors: Record<string, string> = {
    student: "bg-primary/10 text-primary",
    instructor: "bg-accent/10 text-accent",
    admin: "bg-destructive/10 text-destructive",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* ===================== */}
        {/* PROFILE HEADER */}
        {/* ===================== */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden mb-8"
        >
          <div className="h-32 gradient-primary" />

          <div className="px-8 pb-8">
            <div className="flex items-center gap-4 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center gradient-primary text-primary-foreground text-3xl font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <Badge className={`capitalize ${roleColors[user.role]}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================== */}
        {/* CONTENT */}
        {/* ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PERSONAL INFO */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Personal Information</h2>

            <InfoRow icon={User} label="Name" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={Shield} label="Role" value={user.role} />
          </div>

          {/* LEARNING STATS */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Learning Stats</h2>

              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  icon={BookOpen}
                  value={enrolledCourses.length}
                  label="Courses"
                />
                <StatBox icon={Award} value={`${progress}%`} label="Progress" />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ENROLLED COURSES */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Enrolled Courses</h2>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-secondary"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">{course.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No courses enrolled yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ===================== */
/* SMALL COMPONENTS */
/* ===================== */
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary mb-3">
    <div className="p-2 rounded-lg bg-background">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const StatBox = ({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string | number;
  label: string;
}) => (
  <div className="p-4 rounded-xl bg-secondary text-center">
    <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
