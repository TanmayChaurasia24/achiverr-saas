
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Github, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const Login = () => {
  const { signIn } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  
  // Check if we're using fallback Supabase credentials
  const usingFallbackCredentials = 
    import.meta.env.VITE_SUPABASE_URL === undefined || 
    import.meta.env.VITE_SUPABASE_ANON_KEY === undefined;
  
  useEffect(() => {
    // Show error toast if there was an auth error
    if (error === 'auth-failed') {
      toast.error('Authentication failed. Please try again.');
    }
  }, [error]);
  
  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto mt-10 p-8 border rounded-xl shadow-sm bg-card"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to DreamPlan</h1>
          <p className="text-muted-foreground">Sign in to track your goals and progress</p>
        </motion.div>
        
        {usingFallbackCredentials && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Configuration Required</AlertTitle>
              <AlertDescription>
                Supabase credentials are not configured. Please set the VITE_SUPABASE_URL and 
                VITE_SUPABASE_ANON_KEY environment variables for authentication to work.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 h-12"
              onClick={() => signIn.withGoogle()}
              disabled={usingFallbackCredentials}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              className="w-full h-12"
              onClick={() => signIn.withGithub()}
              disabled={usingFallbackCredentials}
            >
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
          </motion.div>
          
          {usingFallbackCredentials && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm text-muted-foreground mt-4 text-center"
            >
              Authentication is disabled until Supabase is properly configured.
            </motion.p>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <Button variant="link" asChild className="text-sm">
              <Link to="/" className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Login;
