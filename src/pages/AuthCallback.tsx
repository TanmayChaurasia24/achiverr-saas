
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error);
        navigate('/login?error=auth-failed');
      } else {
        // Successful authentication - redirect to dashboard
        navigate('/dashboard');
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
