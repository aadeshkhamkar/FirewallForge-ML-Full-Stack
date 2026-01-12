import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Brain,
  BookOpen,
  Trophy,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { courses } from '@/data/mockData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi ${user?.full_name.split(' ')[0]} 👋

I’m your LearnHub AI Assistant.
Click a suggestion on the left or ask your own question.`,
    },
  ]);

  if (!user) return null;

  /* ===================== */
  /* SMART AI LOGIC */
  /* ===================== */
  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('progress') || q.includes('improve')) {
      return `📈 **How to Improve Your Progress**

• Study at least 1 lesson daily  
• Revise after each session  
• Attempt quizzes after 70% completion  
• Avoid skipping basics  

Your current progress: **${user.progress_percentage}%**`;
    }

    if (q.includes('quiz')) {
      return `🧠 **Quiz Preparation Tips**

• Revise weak topics first  
• Practice MCQs daily  
• Analyze wrong answers  
• Take quizzes without breaks  

Tip: Best results come after completing lessons.`;
    }

    if (q.includes('course')) {
      const recommended = courses
        .filter(c => !user.course_enrolled.includes(c.id))
        .slice(0, 2)
        .map(c => c.title)
        .join(', ');

      return `📚 **Course Guidance**

You are enrolled in **${user.course_enrolled.length} courses**.

Suggested next courses:
${recommended || 'Focus on completing your current courses.'}`;
    }

    if (q.includes('rank')) {
      return `🏆 **Rank Improvement Tips**

Rank depends on:
• Course completion
• Quiz scores
• Learning consistency

To improve:
• Complete quizzes regularly  
• Maintain daily learning streaks  
• Finish courses with high accuracy`;
    }

    if (q.includes('strategy') || q.includes('plan')) {
      return `🗺️ **Learning Strategy**

Daily:
• 45 mins learning
• 15 mins revision
• 10 mins quiz

Weekly:
• Revise all topics
• Identify weak areas

Consistency > long study hours.`;
    }

    return `🤖 I can help with:
• Progress improvement
• Quiz preparation
• Course guidance
• Rank strategy

Click a suggestion on the left 👈`;
  };

  /* ===================== */
  /* SEND MESSAGE */
  /* ===================== */
  const sendMessage = (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    const aiMsg: Message = {
      role: 'assistant',
      content: getAIResponse(text),
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

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
            AI Learning Assistant
          </h1>
          <p className="text-muted-foreground">
            Smart guidance for your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ===================== */}
          {/* SIDE QUESTIONS */}
          {/* ===================== */}
          <div className="space-y-4">
            <SideQuestion
              icon={BarChart3}
              text="How can I improve my progress?"
              onClick={sendMessage}
            />
            <SideQuestion
              icon={Brain}
              text="How should I prepare for quizzes?"
              onClick={sendMessage}
            />
            <SideQuestion
              icon={BookOpen}
              text="Which course should I focus on?"
              onClick={sendMessage}
            />
            <SideQuestion
              icon={Trophy}
              text="How can I improve my rank?"
              onClick={sendMessage}
            />
            <SideQuestion
              icon={HelpCircle}
              text="Give me a learning strategy"
              onClick={sendMessage}
            />
          </div>

          {/* ===================== */}
          {/* CHAT */}
          {/* ===================== */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Ask something else..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ===================== */
/* SIDE QUESTION CARD */
const SideQuestion = ({ icon: Icon, text, onClick }: any) => (
  <div
    onClick={() => onClick(text)}
    className="glass-card rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition"
  >
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default AIAssistant;
