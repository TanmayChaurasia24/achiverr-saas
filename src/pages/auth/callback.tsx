import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (user) {
          // Save or update user profile
          const response = await fetch(`/api/profile/${user.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: user.user_metadata?.full_name,
              email: user.email,
              avatarUrl: user.user_metadata?.avatar_url
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save profile');
          }

          // Redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
    </div>
  );
} 