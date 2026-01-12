import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ===================== */
/* QUIZ QUESTIONS */
/* ===================== */
const questions = [
  {
    id: 1,
    question: 'What does ML stand for?',
    options: ['Multi Logic', 'Machine Learning', 'Meta Language', 'Main Loop'],
    correct: 1,
  },
  {
    id: 2,
    question: 'Which algorithm is supervised?',
    options: ['K-Means', 'Linear Regression', 'Apriori', 'PCA'],
    correct: 1,
  },
  {
    id: 3,
    question: 'Which language is most used for ML?',
    options: ['Java', 'Python', 'C', 'PHP'],
    correct: 1,
  },
  {
    id: 4,
    question: 'What is overfitting?',
    options: [
      'Model performs well on new data',
      'Model learns noise',
      'Model is too simple',
      'Data is too large',
    ],
    correct: 1,
  },
  {
    id: 5,
    question: 'Which library is used for deep learning?',
    options: ['NumPy', 'Pandas', 'TensorFlow', 'Matplotlib'],
    correct: 2,
  },
];

const Quiz = () => {
  const { user } = useAuth();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;

  /* ===================== */
  /* ANSWERS */
  /* ===================== */
  const handleAnswer = (index: number) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent(prev => prev + 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  /* ===================== */
  /* RESULTS */
  /* ===================== */
  const correctCount = answers.filter(
    (ans, i) => ans === questions[i]?.correct
  ).length;

  const wrongCount = total - correctCount;
  const scorePercent = Math.round((correctCount / total) * 100);

  const chartData = [
    { name: 'Correct', value: correctCount },
    { name: 'Wrong', value: wrongCount },
  ];

  /* ===================== */
  /* DOWNLOAD REPORT */
  /* ===================== */
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text(`Quiz Report - ${user?.full_name}`, 20, 20);
    doc.text(`Score: ${scorePercent}%`, 20, 40);
    doc.save(`Quiz_Report_${user?.full_name}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 rounded-3xl bg-gradient-to-r from-primary/90 to-accent/90 p-8 text-primary-foreground">
          <h1 className="text-3xl font-display font-bold mb-1">
            ML Assessment Quiz
          </h1>
          <p className="opacity-90">
            Answer carefully and track your learning progress
          </p>
        </div>

        {!submitted ? (
          /* ===================== */
          /* QUIZ CARD */
          /* ===================== */
          <div className="glass-card rounded-3xl p-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                Question {current + 1} of {total}
              </span>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>

            <Progress value={((current + 1) / total) * 100} />

            <h2 className="text-xl font-semibold mt-8 mb-6">
              {questions[current].question}
            </h2>

            <div className="space-y-4">
              {questions[current].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    answers[current] === idx
                      ? 'border-primary bg-primary/10 shadow'
                      : 'hover:bg-secondary'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                disabled={current === total - 1}
                onClick={handleNext}
              >
                Next
              </Button>

              {current === total - 1 && (
                <Button onClick={handleSubmit}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* ===================== */
          /* RESULT */
          /* ===================== */
          <div className="space-y-8">
            <div className="glass-card rounded-3xl p-8 text-center">
              <Brain className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold mb-2">
                Quiz Completed
              </h2>

              <div className="flex justify-center gap-10 mt-6">
                <ResultStat icon={CheckCircle} value={correctCount} label="Correct" />
                <ResultStat icon={XCircle} value={wrongCount} label="Wrong" />
              </div>

              <p className="mt-6 text-3xl font-bold">
                {scorePercent}%
              </p>

              <Button onClick={downloadReport} className="mt-6">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Performance">
                <BarChartView data={chartData} />
              </ChartCard>

              <ChartCard title="Accuracy">
                <PieChartView data={chartData} />
              </ChartCard>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

/* ===================== */
/* UI HELPERS */
/* ===================== */
const ResultStat = ({ icon: Icon, value, label }: any) => (
  <div>
    <Icon className="w-7 h-7 mx-auto text-primary" />
    <p className="text-xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const ChartCard = ({ title, children }: any) => (
  <div className="glass-card rounded-3xl p-6">
    <h3 className="font-semibold mb-4 flex items-center gap-2">
      <BarChart3 className="w-4 h-4" />
      {title}
    </h3>
    <div className="h-[250px]">{children}</div>
  </div>
);

const BarChartView = ({ data }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="value" fill="hsl(var(--primary))" />
    </BarChart>
  </ResponsiveContainer>
);

const PieChartView = ({ data }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={60}
        outerRadius={90}
      >
        <Cell fill="hsl(var(--success))" />
        <Cell fill="hsl(var(--destructive))" />
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default Quiz;
