import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  CheckCircle,
  Play,
  ClipboardList,
  Rocket,
  Terminal,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

/* ===================== */
/* PROJECT DATA */
/* ===================== */
const projects = [
  {
    id: 'PRJ001',
    title: 'AI Course Recommendation Engine',
    level: 'Intermediate',
    tech: ['Python', 'ML', 'MongoDB'],
    language: 'python',
    description:
      'Build a recommendation system that suggests courses based on user behavior and interests.',
    tasks: [
      'Analyze user enrollment data',
      'Implement content-based filtering',
      'Store recommendations in MongoDB',
      'Expose API endpoint',
    ],
  },
  {
    id: 'PRJ002',
    title: 'Learning Analytics Dashboard',
    level: 'Beginner',
    tech: ['JavaScript', 'Charts', 'UI'],
    language: 'javascript',
    description:
      'Create an analytics dashboard that visualizes student engagement and performance.',
    tasks: [
      'Design dashboard UI',
      'Integrate chart library',
      'Show progress & trends',
      'Optimize responsiveness',
    ],
  },
  {
    id: 'PRJ003',
    title: 'Quiz Performance Predictor',
    level: 'Advanced',
    tech: ['Python', 'ML', 'FastAPI'],
    language: 'python',
    description:
      'Predict quiz outcomes using historical performance and learning patterns.',
    tasks: [
      'Prepare training dataset',
      'Train ML model',
      'Build prediction API',
      'Integrate with frontend',
    ],
  },
];

/* ===================== */
/* PROGRAMIZ COMPILER URLS */
/* ===================== */
const compilerMap: Record<string, string> = {
  python: 'https://www.programiz.com/python-programming/online-compiler/',
  javascript: 'https://www.programiz.com/javascript/online-compiler/',
};

const ProjectWorkspace = () => {
  const { user } = useAuth();
  const [activeProject, setActiveProject] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Real-Time Project Workspace
          </h1>
          <p className="text-muted-foreground">
            Build, run, and test code directly inside the LMS
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PROJECT LIST */}
          <div className="space-y-4">
            {projects.map(project => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setActiveProject(project);
                  setSubmitted(false);
                }}
                className={`cursor-pointer rounded-2xl p-5 border ${
                  activeProject?.id === project.id
                    ? 'border-primary bg-primary/10'
                    : 'bg-secondary'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <Badge>{project.level}</Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {project.tech.map(t => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* WORKSPACE */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-6">
            {!activeProject ? (
              <div className="h-[500px] flex flex-col items-center justify-center text-center">
                <Rocket className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a project to start coding live
                </p>
              </div>
            ) : (
              <>
                {/* PROJECT HEADER */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {activeProject.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {activeProject.description}
                    </p>
                  </div>
                  <Badge>{activeProject.level}</Badge>
                </div>

                {/* TASKS */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Tasks
                  </h3>

                  <ul className="space-y-2">
                    {activeProject.tasks.map((task: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm bg-secondary p-3 rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* LIVE COMPILER */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Live Code Runner
                  </h3>

                  <div className="w-full h-[420px] rounded-xl overflow-hidden border">
                    <iframe
                      src={compilerMap[activeProject.language]}
                      title="Live Compiler"
                      className="w-full h-full"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Powered by Programiz Online Compiler
                  </p>
                </div>

                {/* NOTES */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Notes / Explanation
                  </h3>

                  <Textarea
                    placeholder="Explain your logic, approach, or paste important snippets..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center">
                  {submitted ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      Project Submitted Successfully
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Run code → Explain → Submit
                    </span>
                  )}

                  <Button onClick={handleSubmit}>
                    <Play className="w-4 h-4 mr-2" />
                    Submit Project
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectWorkspace;
