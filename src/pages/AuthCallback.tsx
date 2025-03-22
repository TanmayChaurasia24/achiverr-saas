
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login?error=auth-failed');
        } else if (data?.session) {
          // Successful authentication - redirect to dashboard
          toast.success('Successfully signed in!');
          navigate('/dashboard');
        } else {
          // No session found
          toast.error('Authentication failed. Please try again.');
          navigate('/login?error=no-session');
        }
      } catch (error) {
        console.error('Unexpected error during auth:', error);
        toast.error('An unexpected error occurred during authentication.');
        navigate('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
        <div className="text-lg text-foreground">
          Completing login process...
        </div>
      </div>
    </Layout>
  );
};

export default AuthCallback;
