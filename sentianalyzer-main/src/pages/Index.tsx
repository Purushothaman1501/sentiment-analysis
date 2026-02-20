import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "Enterprise-grade JWT authentication to keep your data safe and access controlled.",
  },
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description: "State-of-the-art NLP models deliver accurate sentiment classification in real time.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get sentiment analysis with confidence scores and probability breakdowns in seconds.",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Now in Public Beta
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-5">
              Real-Time Sentiment Analysis{" "}
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Understand the emotions behind any text. SentimentAI uses advanced machine learning to classify sentiment with high accuracy and detailed confidence scores.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/auth?tab=register">
                <Button size="lg" className="min-w-[160px] text-base font-semibold h-12 px-8">
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="min-w-[160px] text-base font-semibold h-12 px-8">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              Built for Modern Teams
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to analyze text sentiment at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
