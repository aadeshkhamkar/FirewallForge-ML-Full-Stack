import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Edit2,
  Shield,
  X,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';

import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { courses } from '@/data/mockData';

const Profile = () => {
  const { user } = useAuth();

  /* ===================== */
  /* SAFETY GUARD */
  /* ===================== */
  if (!user) return null;

  /* ===================== */
  /* LOCAL EDIT STATE */
  /* ===================== */
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.full_name);
  const [editedPhone, setEditedPhone] = useState(user.phone);

  /* ===================== */
  /* ENROLLED COURSES */
  /* ===================== */
  const enrolledCourses = courses.filter(course =>
    user.course_enrolled.includes(course.id)
  );

  const roleColors = {
    student: 'bg-primary/10 text-primary',
    instructor: 'bg-accent/10 text-accent',
    admin: 'bg-destructive/10 text-destructive',
  };

  /* ===================== */
  /* SAVE PROFILE (FRONTEND) */
  /* ===================== */
  const handleSaveProfile = () => {
    // Frontend-safe update (backend-ready)
    user.full_name = editedName;
    user.phone = editedPhone;
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* ===================== */}
        {/* PROFILE HEADER */}
        {/* ===================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden mb-8"
        >
          {/* Cover */}
          <div className="h-32 gradient-primary relative">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 relative">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background flex items-center justify-center gradient-primary text-primary-foreground text-3xl font-display font-bold shadow-lg">
                {user.full_name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-display font-bold">
                    {user.full_name}
                  </h1>
                  <Badge className={`capitalize ${roleColors[user.role]}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="hidden sm:flex"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ===================== */}
        {/* CONTENT GRID */}
        {/* ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PERSONAL INFO */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-display font-semibold mb-6">
              Personal Information
            </h2>

            <div className="space-y-4">
              <InfoRow icon={User} label="Full Name" value={user.full_name} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Phone" value={user.phone} />
              <InfoRow
                icon={Calendar}
                label="Member Since"
                value={format(new Date(user.created_at), 'MMMM d, yyyy')}
              />
              <InfoRow
                icon={Clock}
                label="Last Login"
                value={format(
                  new Date(user.last_login),
                  'MMM d, yyyy h:mm a'
                )}
              />
            </div>
          </div>

          {/* LEARNING STATS */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-display font-semibold mb-6">
                Learning Stats
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <StatBox
                  icon={BookOpen}
                  value={enrolledCourses.length}
                  label="Courses"
                />
                <StatBox
                  icon={Award}
                  value={`${user.progress_percentage}%`}
                  label="Progress"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-medium">
                    {user.progress_percentage}%
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${user.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ENROLLED COURSES */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-display font-semibold mb-4">
                Enrolled Courses
              </h2>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.map(course => (
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
                        <p className="text-sm font-medium">
                          {course.title}
                        </p>
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

      {/* ===================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ===================== */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <Input
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <Input
                  value={editedPhone}
                  onChange={e => setEditedPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>


            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

/* ===================== */
/* SMALL REUSABLE PARTS */
/* ===================== */
const InfoRow = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
    <div className="p-2 rounded-lg bg-background">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const StatBox = ({ icon: Icon, value, label }: any) => (
  <div className="p-4 rounded-xl bg-secondary text-center">
    <Icon className="w-8 h-8 mx-auto text-primary mb-2" />
    <p className="text-2xl font-display font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
