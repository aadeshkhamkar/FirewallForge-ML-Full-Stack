import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSplash, setShowSplash] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated && !showSplash) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      setShowSplash(true);
      // Show splash screen for 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Try: aarav.sharma@email.com",
        variant: "destructive"
      });
    }
  };

  // Demo accounts info
  const demoAccounts = [
    { role: 'Student', email: 'aarav.sharma@email.com' },
    { role: 'Instructor', email: 'priya.patel@email.com' },
    { role: 'Admin', email: 'ananya.singh@email.com' },
  ];

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center gradient-primary"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-display font-bold text-white mb-2"
              >
                Welcome to LearnHub
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/80"
              >
                Preparing your dashboard...
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-background flex"
        >
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-20">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="font-display text-2xl font-bold text-white">LearnHub</span>
              </div>
              
              <h1 className="text-5xl font-display font-bold text-white leading-tight mb-6">
                Empower Your Learning Journey
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Access world-class courses, track your progress, and achieve your goals with our AI-powered learning platform.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl transform translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <p className="text-white/60 text-sm">
                Trusted by 50+ learners across India
              </p>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-md"
            >
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="font-display text-2xl font-bold">LearnHub</span>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground">
                  Sign in to continue your learning
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base gradient-primary border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-10 p-4 rounded-xl bg-secondary">
                <p className="text-sm font-medium text-foreground mb-3">Demo Accounts (any password):</p>
                <div className="space-y-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => setEmail(account.email)}
                      className="w-full text-left p-2 rounded-lg hover:bg-background transition-colors text-sm"
                    >
                      <span className="font-medium text-primary">{account.role}:</span>{' '}
                      <span className="text-muted-foreground">{account.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;
