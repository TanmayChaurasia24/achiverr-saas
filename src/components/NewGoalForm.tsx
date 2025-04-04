import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { saveGoal } from "@/utils/storage";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Goal } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface NewGoalFormProps {
  onGoalCreated: () => void;
}

export function NewGoalForm({ onGoalCreated }: NewGoalFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeframe, setTimeframe] = useState("30");
  const [Finalroadmap, setfinalroadmap] = useState([])
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !timeframe) {
      toast.error("Please provide a title and timeframe for your goal");
      return;
    }

    setLoading(true);

    try {
      console.log("Generating roadmap for:", {
        title,
        description,
        timeframe: parseInt(timeframe),
      });

      // Generate roadmap using AI
      const roadmap: any = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/generate`,
        {
          goalTitle: title,
          goalDescription: description,
          timeframe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Generated roadmap:", roadmap.data.data);
      
      if (!roadmap || roadmap.length === 0) {
        toast.error("Failed to generate roadmap. Please try again.");
        setLoading(false);
        return;
      }
      
      setfinalroadmap(roadmap.data.data)
      // save goal to database
      const goalResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/goal/create/${user.id}`,
        {
          title,
          description,
          timeframe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!goalResponse.data) {
        toast.error("failed to create goal!");
        setLoading(false);
        return;
      }

      console.log("final roadmap is: ", Finalroadmap);
      console.log("type of final roadmap is: ", typeof(Finalroadmap));
      
      
      // save the ai generated roadmap to the database
      const roadmapReponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/roadmap/create/${goalResponse.data.goalId}`,
        {
          roadmapitems: Finalroadmap,
        },
      );

      if (!roadmapReponse.data) {
        toast.error("failed to create roadmap!");
        setLoading(false);
        return;
      }

      toast.success("Goal with roadmap created successfully!");

      setTitle("");
      setDescription("");
      setTimeframe("30");
      setOpen(false);
      onGoalCreated();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="group animate-fade-in">
            <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Create New Goal
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Goal</DialogTitle>
          <DialogDescription>
            Define your goal and timeframe. Our AI will help create a roadmap
            for you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Learn a new programming language"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I want to learn Python to automate my daily tasks"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe (days)</Label>
            <Input
              id="timeframe"
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="30"
              min="1"
              max="365"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !title || !timeframe}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
