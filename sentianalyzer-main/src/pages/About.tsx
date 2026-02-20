import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            About SentimentAI
          </h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              SentimentAI is a modern sentiment analysis platform built for developers and teams who need to understand the emotional tone of text data at scale.
            </p>
            <p>
              Our API leverages state-of-the-art natural language processing models to classify text as positive, neutral, or negative — with detailed confidence scores and probability breakdowns.
            </p>
            <p>
              Whether you're monitoring customer feedback, analyzing social media, or building intelligent applications, SentimentAI provides the accuracy and speed you need.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
