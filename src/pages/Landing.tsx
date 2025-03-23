
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Target, 
  CheckCircle, 
  BarChart, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Brain,
  ChevronDown
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardHover = {
  rest: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  hover: { 
    scale: 1.05, 
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <div className="text-xl font-semibold tracking-tight">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent"
          >
            Achiverr
          </motion.span>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors duration-300">
            Pricing
          </Link>
          <Button asChild variant="outline" size="sm" className="hover:scale-105 transition-transform duration-300">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hover:scale-105 transition-transform duration-300">
            <Link to="/login">Sign In</Link>
          </Button>
        </motion.div>
      </motion.header>
      
      <section className="bg-gradient-to-b from-background to-secondary/20 py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, rgba(123, 97, 255, 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(97, 218, 251, 0.4) 0%, transparent 40%)"
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto space-y-6"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              Set Goals. Get Roadmaps.
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-accent bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent"
              >
                Achieve Success.
              </motion.span>
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              DreamPlan helps you turn your dreams into actionable plans with AI-powered roadmaps and daily tasks tailored to your goals.
            </motion.p>
            <motion.div 
              variants={fadeIn}
              className="pt-4 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="gap-2 group transition-all duration-300 hover:bg-accent/90">
                <Link to="/dashboard">
                  Get Started 
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="transition-all duration-300 hover:border-accent">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 p-4 bg-card border rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden glass"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="aspect-video rounded-md overflow-hidden bg-gradient-to-br from-accent/20 to-secondary flex items-center justify-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-center p-8 glass rounded-xl"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-accent" />
                </motion.div>
                <h3 className="text-xl font-medium">Smart Goal Planning Demo</h3>
                <p className="text-muted-foreground mt-2">Interactive preview coming soon</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-muted-foreground cursor-pointer"
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Turn Your Dreams Into Reality
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              DreamPlan's AI-powered platform breaks down your goals into achievable steps
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div 
              variants={fadeIn}
              whileHover="hover"
              initial="rest"
              animate="rest"
              whileTap="rest"
              variants={cardHover}
              className="bg-card border rounded-lg p-6 transition-all"
            >
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Target className="h-10 w-10 text-accent mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2">Goal Setting</h3>
              <p className="text-muted-foreground">
                Define clear objectives with customizable timeframes that fit your unique aspirations
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              whileHover="hover"
              initial="rest"
              animate="rest"
              whileTap="rest"
              variants={cardHover}
              className="bg-card border rounded-lg p-6 transition-all"
            >
              <motion.div
                animate={{ 
                  rotateZ: [0, 10, 0, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 6,
                  ease: "easeInOut"
                }}
              >
                <Brain className="h-10 w-10 text-accent mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2">AI Roadmaps</h3>
              <p className="text-muted-foreground">
                Get personalized action plans generated by advanced AI to guide your journey
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              whileHover="hover"
              initial="rest"
              animate="rest"
              whileTap="rest"
              variants={cardHover}
              className="bg-card border rounded-lg p-6 transition-all"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              >
                <Calendar className="h-10 w-10 text-accent mb-4" />
              </motion.div>
              <h3 className="text-xl font-medium mb-2">Daily Tasks</h3>
              <p className="text-muted-foreground">
                Track progress with adaptive daily task lists that adjust to your pace
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="py-20 bg-gradient-to-tr from-secondary/30 to-accent/10"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            variants={fadeIn}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of successful goal-achievers today
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/dashboard">Start Your Journey</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="py-12 bg-muted/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-xl font-semibold mb-4 md:mb-0"
            >
              <span className="bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent">
                Achiverr
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex gap-8 text-sm text-muted-foreground"
            >
              <Link to="/pricing" className="hover:text-foreground transition-colors duration-300">
                Pricing
              </Link>
              <a href="#" className="hover:text-foreground transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors duration-300">
                Privacy
              </a>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            © {new Date().getFullYear()} Achiverr. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Landing;
