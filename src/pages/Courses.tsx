import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Star, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/data/mockData";

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  /* ===================== */
  /* LOADING + AUTH GUARDS */
  /* ===================== */

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-muted-foreground">
          Loading courses...
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-muted-foreground">
          Please sign in to view courses.
        </div>
      </DashboardLayout>
    );
  }

  /* ===================== */
  /* SAFE USER DATA */
  /* ===================== */

  const enrolledIds = Array.isArray(user.course_enrolled)
    ? user.course_enrolled
    : [];

  /* ===================== */
  /* FILTER COURSES */
  /* ===================== */

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    const matchesLevel =
      selectedLevel === "All Levels" ||
      course.level === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  });

  /* ===================== */
  /* ACTIONS */
  /* ===================== */

  const handleEnroll = (courseId: string) => {
    if (enrolledIds.includes(courseId)) return;

    if (!Array.isArray(user.course_enrolled)) {
      user.course_enrolled = [];
    }
    user.course_enrolled.push(courseId);

    const course = courses.find((c) => c.id === courseId);

    toast({
      title: "Successfully Enrolled!",
      description: `You are now enrolled in ${course?.title}`,
    });
  };

  const openAnalytics = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  /* ===================== */
  /* RENDER */
  /* ===================== */

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Explore Courses
          </h1>
          <p className="text-muted-foreground">
            Discover new skills and advance your learning journey
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            className="border rounded-lg px-3 py-2 bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All</option>
            <option>Programming</option>
            <option>Data Science</option>
            <option>AI & ML</option>
            <option>Design</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 bg-background"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => {
            const isEnrolled = enrolledIds.includes(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {course.rating}
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Button
                      className="w-full"
                      onClick={() => openAnalytics(course.id)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No courses found matching your criteria.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
