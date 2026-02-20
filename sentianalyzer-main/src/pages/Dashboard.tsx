import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PredictionResult {
  sentiment: string;
  confidence: number;
  probabilities: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

const sentimentStyles: Record<string, { bg: string; text: string; label: string }> = {
  positive: { bg: "bg-success/10", text: "text-success", label: "Positive" },
  neutral: { bg: "bg-muted", text: "text-muted-foreground", label: "Neutral" },
  negative: { bg: "bg-destructive/10", text: "text-destructive", label: "Negative" },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/auth/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Prediction failed");

      setResult({
        sentiment: (data.sentiment || data.label || "neutral").toLowerCase(),
        confidence: data.confidence ?? data.score ?? 0.85,
        probabilities: data.probabilities ?? {
          positive: data.positive ?? 0.33,
          neutral: data.neutral ?? 0.34,
          negative: data.negative ?? 0.33,
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const style = result ? sentimentStyles[result.sentiment] || sentimentStyles.neutral : null;

  return (
    <div className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">
            Welcome back, {user?.username}
          </h1>
          <p className="text-muted-foreground mb-8">Enter text below to analyze its sentiment.</p>

          {/* Analysis Card */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to analyze..."
              className="min-h-[140px] resize-none text-base mb-4"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto h-11 font-semibold gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && style && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </span>
                </div>

                <div className="space-y-4">
                  {(["positive", "neutral", "negative"] as const).map((key) => {
                    const value = result.probabilities[key];
                    const barStyle = key === "positive"
                      ? "bg-success"
                      : key === "negative"
                        ? "bg-destructive"
                        : "bg-muted-foreground/30";
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                          <span className="text-sm text-muted-foreground">{(value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${value * 100}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${barStyle}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
