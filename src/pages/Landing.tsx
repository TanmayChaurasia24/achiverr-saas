
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, AnimatedGradient, HoverCard } from '@/components/ui/animations';
import { 
  Target, 
  CheckCircle, 
  BarChart, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Brain,
  ChevronDown,
  ArrowUpRight,
  Users,
  Shield
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Animated background */}
      <AnimatedGradient />
      
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
            className="gradient-text"
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
          <Link to="/pricing" className="text-sm font-medium animated-underline hover:text-primary transition-colors duration-300">
            Pricing
          </Link>
          <Button asChild variant="outline" size="sm" className="btn-hover">
            <Link to="/dashboard">Dashboardd</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="btn-hover">
            <Link to="/login">Sign In</Link>
          </Button>
        </motion.div>
      </motion.header>
      
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <StaggerContainer className="max-w-4xl mx-auto">
            <StaggerItem>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                Set Goals. Get Roadmaps.
                <span className="block gradient-text mt-2">
                  Achieve Success.
                </span>
              </h1>
            </StaggerItem>
            
            <StaggerItem>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Achiverr helps you turn your dreams into actionable plans with AI-powered roadmaps 
                and daily tasks tailored to your goals.
              </p>
            </StaggerItem>
            
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 group bg-accent hover:bg-accent/90 btn-hover">
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
                <Button asChild variant="outline" size="lg" className="btn-hover">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
          
          <FadeIn delay={0.6} className="mt-16 max-w-5xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden p-6">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glow">
                  <h3 className="text-lg font-medium mt-4">Track Progress</h3>
                  <p className="text-muted-foreground text-sm">See your goals evolve in real-time</p>
                </div>
                
                <div className="glow">
                  <h3 className="text-lg font-medium mt-4">Follow Roadmaps</h3>
                  <p className="text-muted-foreground text-sm">Clear milestones to guide your journey</p>
                </div>
                
                <div className="glow">
                  <h3 className="text-lg font-medium mt-4">Complete Tasks</h3>
                  <p className="text-muted-foreground text-sm">Daily actions toward your success</p>
                </div>
              </div>
            </div>
          </FadeIn>
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
      <section className="py-24 bg-background dots-pattern">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Turn Your Dreams Into Reality
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Achiverr's AI-powered platform breaks down your goals into achievable steps
            </p>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={0.15}>
            <StaggerItem>
              <HoverCard className="enhanced-card p-8 h-full">
                <div className="mb-6 inline-block p-3 rounded-full bg-accent/10">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">Goal Setting</h3>
                <p className="text-muted-foreground">
                  Define clear objectives with customizable timeframes that fit your unique aspirations
                </p>
              </HoverCard>
            </StaggerItem>
            
            <StaggerItem>
              <HoverCard className="enhanced-card p-8 h-full">
                <div className="mb-6 inline-block p-3 rounded-full bg-accent/10">
                  <Brain className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">AI Roadmaps</h3>
                <p className="text-muted-foreground">
                  Get personalized action plans generated by advanced AI to guide your journey
                </p>
              </HoverCard>
            </StaggerItem>
            
            <StaggerItem>
              <HoverCard className="enhanced-card p-8 h-full">
                <div className="mb-6 inline-block p-3 rounded-full bg-accent/10">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-medium mb-3">Daily Tasks</h3>
                <p className="text-muted-foreground">
                  Track progress with adaptive daily task lists that adjust to your pace
                </p>
              </HoverCard>
            </StaggerItem>
          </StaggerContainer>
          
          <FadeIn delay={0.3} className="mt-24">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <div className="glass rounded-2xl overflow-hidden">
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Visualize Your Journey</h3>
                <p className="text-muted-foreground">
                  Our interactive roadmaps give you a clear view of your progress and what's ahead.
                  Each milestone represents a key step toward achieving your goal.
                </p>
                <ul className="space-y-3">
                  {["Customized for your specific goals", "Adapts as you make progress", "Celebrate milestones along the way"].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="btn-hover" variant="outline">
                  <Link to="/dashboard" className="flex items-center">
                    Try It Now
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* CTA Section */}
      <FadeIn className="py-24 bg-gradient-to-tr from-secondary/30 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Achieve Your Goals?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of successful goal-achievers today
            </p>
            <HoverCard>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/dashboard">Start Your Journey</Link>
              </Button>
            </HoverCard>
          </div>
        </div>
      </FadeIn>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="py-12 border-t"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-xl font-semibold mb-4 md:mb-0"
            >
              <span className="gradient-text">
                Achiverr
              </span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex gap-8 text-sm text-muted-foreground"
            >
              <Link to="/pricing" className="animated-underline hover:text-foreground transition-colors duration-300">
                Pricing
              </Link>
              <a href="#" className="animated-underline hover:text-foreground transition-colors duration-300">
                Terms
              </a>
              <a href="#" className="animated-underline hover:text-foreground transition-colors duration-300">
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
