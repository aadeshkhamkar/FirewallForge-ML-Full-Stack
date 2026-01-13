import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Brain,
  BookOpen,
  Trophy,
  BarChart3,
  HelpCircle,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/data/mockData";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] ?? "there"} 👋

I’m your LearnHub AI Assistant.
Click a suggestion on the left or ask your own question.`,
    },
  ]);

  // Safety: never render without user
  if (!user) return null;

  /* ===================== */
  /* AI RESPONSE LOGIC */
  /* ===================== */
  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("progress") || q.includes("improve")) {
      return `📈 **How to Improve Your Progress**

• Study consistently every day  
• Revise after each lesson  
• Attempt quizzes after learning  
• Focus on weak areas  

Consistency matters more than speed.`;
    }

    if (q.includes("quiz")) {
      return `🧠 **Quiz Preparation Tips**

• Revise key concepts  
• Practice MCQs regularly  
• Analyze mistakes  
• Avoid rushing quizzes  

Tip: Accuracy beats attempts.`;
    }

    if (q.includes("course")) {
      const recommended = courses
        .slice(0, 3)
        .map((c) => `• ${c.title}`)
        .join("\n");

      return `📚 **Course Guidance**

Based on popular learning paths, you can focus on:

${recommended}

Finish one course properly before starting another.`;
    }

    if (q.includes("rank")) {
      return `🏆 **Rank Improvement Tips**

Your rank improves by:
• Completing courses
• Scoring well in quizzes
• Maintaining learning streaks

Small daily progress compounds fast.`;
    }

    if (q.includes("strategy") || q.includes("plan")) {
      return `🗺️ **Suggested Learning Strategy**

Daily:
• 45 mins learning  
• 15 mins revision  

Weekly:
• Review completed topics  
• Take at least 1 quiz  

Consistency > Long study hours.`;
    }

    return `🤖 I can help you with:
• Improving progress
• Quiz preparation
• Course suggestions
• Learning strategies

Click a suggestion on the left 👈`;
  };

  /* ===================== */
  /* SEND MESSAGE */
  /* ===================== */
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    const aiMsg: Message = {
      role: "assistant",
      content: getAIResponse(text),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">AI Learning Assistant</h1>
          <p className="text-muted-foreground">
            Smart guidance for your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT QUICK QUESTIONS */}
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

          {/* CHAT AREA */}
          <div className="lg:col-span-3 glass-card rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              />
              <Button onClick={() => sendMessage(input)}>
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
const SideQuestion = ({
  icon: Icon,
  text,
  onClick,
}: {
  icon: any;
  text: string;
  onClick: (text: string) => void;
}) => (
  <div
    onClick={() => onClick(text)}
    className="glass-card rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition"
  >
    <Icon className="w-5 h-5 text-primary" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

export default AIAssistant;
