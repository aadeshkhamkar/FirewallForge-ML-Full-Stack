import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, ChevronRight } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { courses } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/* ===================== */
/* Helper: extract YouTube ID from URL or raw ID */
/* Accepts:
   - https://www.youtube.com/watch?v=VIDEOID
   - https://youtu.be/VIDEOID
   - https://www.youtube.com/embed/VIDEOID
   - raw 11-char ID 'VIDEOID'
*/
const extractYouTubeId = (input?: string) => {
  if (!input) return null;
  const str = String(input).trim();

  // If it's already the 11-char ID, accept it
  if (/^[A-Za-z0-9_-]{11}$/.test(str)) return str;

  // Try common URL patterns
  const re = /(?:v=|\/embed\/|youtu\.be\/|\/v\/)([A-Za-z0-9_-]{11})/;
  const m = str.match(re);
  return m ? m[1] : null;
};

/* ===================== */
/* Lessons with video links (Intro to Computer Networks used for lesson 1) */
/* You can change videoUrl values later to any YouTube link or raw ID */
const lessons = [
  {
    id: "l1",
    title: "Introduction to Computer Networks",
    duration: "28 min",
    completed: true,
    // chosen intro video (search source: 'Introduction to Computer Networks'). See note below.
    videoUrl: "https://www.youtube.com/watch?v=VwN91x5i25g",
  },
  {
    id: "l2",
    title: "Basic Microservices App – Part 1",
    duration: "33 min",
    completed: true,
    // example alternative videos (replace as needed)
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  },
  {
    id: "l3",
    title: "Basic Microservices App – Part 2",
    duration: "18 min",
    completed: false,
    videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
  },
  {
    id: "l4",
    title: "Service Registry & Discovery – Netflix Eureka",
    duration: "23 min",
    completed: false,
    videoUrl: "https://www.youtube.com/watch?v=l482T0yNkeo",
  },
  {
    id: "l5",
    title: "Netflix Eureka – Server II",
    duration: "16 min",
    completed: false,
    videoUrl: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
  },
];

const tabs = ["Overview", "Q&A", "Notes", "Announcements", "Reviews"];

const CourseAnalytics = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);

  /* HARD GUARD */
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
  const [activeTab, setActiveTab] = useState("Overview");

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  // Resolve ID (null if not valid)
  const videoId = extractYouTubeId(activeLesson.videoUrl);

  return (
    <DashboardLayout>
      {/* VIDEO PLAYER + CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        {/* VIDEO PLAYER */}
        <div className="xl:col-span-3 rounded-xl overflow-hidden bg-black">
          {/* Use aspect-video so the iframe occupies the correct 16:9 ratio.
              The progress bar is placed below this wrapper (no extra space). */}
          <div className="relative w-full aspect-video">
            {videoId ? (
              <iframe
                key={videoId} // force reload when id changes
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              // fallback placeholder (shouldn't normally show if videoUrl is valid)
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Play className="w-16 h-16 text-white opacity-80" />
              </div>
            )}
          </div>

          {/* Progress bar BELOW the aspect-video box so no black gap shows */}
          <div className="bg-black px-4 pb-3">
            <Progress value={progress} />
            <p className="text-xs text-white/70 mt-1">
              {completedCount}/{lessons.length} lectures completed
            </p>
          </div>
        </div>

        {/* COURSE CONTENT SIDEBAR */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-lg">Course content</h3>

          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition",
                activeLesson.id === lesson.id
                  ? "bg-primary/10"
                  : "hover:bg-secondary"
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

      {/* TABS */}
      <div className="flex gap-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-sm font-medium",
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        {activeTab === "Overview" ? (
          <>
            <h2 className="text-xl font-semibold mb-3">{course.title}</h2>
            <p className="text-muted-foreground mb-4">{course.description}</p>
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
