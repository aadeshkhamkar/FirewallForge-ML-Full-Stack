import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { MLInsight } from '@/types';
import { cn } from '@/lib/utils';

interface MLInsightCardProps {
  insight: MLInsight;
  delay?: number;
}

const MLInsightCard = ({ insight, delay = 0 }: MLInsightCardProps) => {
  const riskColors = {
    low: 'text-success bg-success/10',
    medium: 'text-warning bg-warning/10',
    high: 'text-destructive bg-destructive/10',
  };

  const riskLabels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="glass-card rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg">ML Insights</h3>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-secondary">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Completion</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {insight.completion_probability}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-secondary">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Engagement</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {insight.engagement_score}
          </p>
        </div>
      </div>

      {/* Dropout Risk */}
      <div className={cn("p-4 rounded-xl flex items-center gap-3", riskColors[insight.dropout_risk])}>
        <AlertTriangle className="w-5 h-5" />
        <div>
          <p className="font-medium">Dropout Risk: {riskLabels[insight.dropout_risk]}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Lightbulb className="w-4 h-4 text-accent" />
          <span>Recommendations</span>
        </div>
        <ul className="space-y-2">
          {insight.recommended_actions.map((action, index) => (
            <li 
              key={index}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <span className="text-primary mt-1">•</span>
              {action}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default MLInsightCard;
