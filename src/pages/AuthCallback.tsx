import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error during auth callback:", error);
          toast.error("Authentication failed. Please try again.");
          navigate("/login?error=auth-failed");
        } else if (data?.session) {
          const responseProfileSave = await axios.post(
            `${import.meta.env.BACKEND_URL}/api/user/saveprofile`,
            {
              email: data.session.user.email,
              id: data.session.user.id,
              Phone: data.session.user.phone,
              user_metadata: data.session.user.user_metadata,
            }
          );
          if (responseProfileSave.status === 201) {
            toast.success("Successfully signed in!");
            navigate("/dashboard");
          } else {
            toast.error("Failed to save profile. Please try again.");
            navigate("/login?error=auth-failed");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Unexpected error during auth:", error);
        toast.error("An unexpected error occurred during authentication.");
        // Even in case of error, still redirect to dashboard
        navigate("/dashboard");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-[60vh]"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        >
          <Loader2 className="h-10 w-10 text-accent mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-foreground"
        >
          Completing login process...
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AuthCallback;
