
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { CheckCircle, BarChart, Shield, Sparkles, DollarSign, Zap, Diamond, Award } from 'lucide-react';
import { motion } from 'framer-motion';

import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/animations';

const PricingTier = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  popular = false,
  modelProgress = 0
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  modelProgress?: number;
}) => {
  return (
    <div className={`enhanced-card p-6 md:p-8 flex flex-col h-full ${
      popular ? 'gradient-border ring-2 ring-accent shadow-lg relative' : ''
    }`}>
      {popular && (
        <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      
      <div className="mb-5">
        <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
        <div className="mb-3 text-center">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
        </div>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        asChild 
        className={`w-full mt-auto ${popular ? 'bg-accent hover:bg-accent/90' : ''}`}
        variant={popular ? "default" : "outline"}
      >
        <Link to="/login">{buttonText}</Link>
      </Button>
    </div>
  );
};

const Pricing = () => {
  return (
    <Layout>
      <FadeIn className="py-10">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you and start your journey to achieving your goals
          </p>
        </div>
        
        <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <StaggerItem>
            <HoverCard>
              <PricingTier 
                title="Starter" 
                price="Free" 
                description="Perfect for individuals just getting started"
                features={[
                  "Up to 3 active goals",
                  "Basic AI roadmap generation",
                  "7-day task history",
                  "Email support"
                ]}
                buttonText="Get Started"
                modelProgress={25}
              />
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard>
              <PricingTier 
                title="Pro" 
                price="$9.99" 
                description="For dedicated goal-achievers wanting more"
                features={[
                  "Up to 10 active goals",
                  "Advanced AI roadmap generation",
                  "30-day task history",
                  "Goal templates library",
                  "Priority support"
                ]}
                buttonText="Upgrade to Pro"
                popular={true}
                modelProgress={65}
              />
            </HoverCard>
          </StaggerItem>
          
          <StaggerItem>
            <HoverCard>
              <PricingTier 
                title="Teams" 
                price="$19.99" 
                description="For families or small teams working together"
                features={[
                  "Unlimited goals",
                  "Premium AI roadmap generation",
                  "Unlimited task history",
                  "Team collaboration features",
                  "Shared goal tracking",
                  "24/7 dedicated support"
                ]}
                buttonText="Choose Teams"
                modelProgress={95}
              />
            </HoverCard>
          </StaggerItem>
        </StaggerContainer>
        
        <div className="mt-24">
          <FadeIn>
            <h2 className="text-2xl font-bold text-center mb-10">
              Why Choose <span className="gradient-text">Achiverr</span>?
            </h2>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StaggerItem>
              <div className="text-center enhanced-card p-6 h-full">
                <div className="inline-block p-3 rounded-full bg-accent/10 mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Advanced algorithms create personalized roadmaps tailored to your specific goals
                </p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="text-center enhanced-card p-6 h-full">
                <div className="inline-block p-3 rounded-full bg-accent/10 mb-4">
                  <BarChart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize your journey with intuitive dashboards and analytics
                </p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="text-center enhanced-card p-6 h-full">
                <div className="inline-block p-3 rounded-full bg-accent/10 mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your goals and personal data are encrypted and never shared
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
        
        <FadeIn delay={0.3} className="mt-24 text-center bg-gradient-to-r from-secondary/50 to-accent/10 py-12 px-4 rounded-xl max-w-3xl mx-auto enhanced-card">
          <h2 className="text-2xl font-bold mb-4">Ready to transform your goals into achievements?</h2>
          <p className="text-muted-foreground mb-6">
            Start with our free plan today, no credit card required.
          </p>
          <HoverCard>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/login">Get Started Now</Link>
            </Button>
          </HoverCard>
        </FadeIn>
      </FadeIn>
    </Layout>
  );
};

export default Pricing;
