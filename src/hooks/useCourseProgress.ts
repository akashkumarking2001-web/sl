import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ProgressRecord {
  episode_id: string;
  completed: boolean;
}

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth();
  const [completedEpisodes, setCompletedEpisodes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id || !courseId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("course_progress")
          .select("episode_id, completed")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .eq("completed", true);

        if (error) {
          console.error("Error loading course progress:", error);
        } else if (data) {
          const completed = new Set(data.map((record: ProgressRecord) => record.episode_id));
          setCompletedEpisodes(completed);
        }
      } catch (err) {
        console.error("Failed to load course progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user?.id, courseId]);

  // Mark episode as complete
  const markEpisodeComplete = useCallback(async (episodeId: string) => {
    if (!user?.id || !courseId) return false;

    try {
      const { error } = await supabase
        .from("course_progress")
        .upsert(
          {
            user_id: user.id,
            course_id: courseId,
            episode_id: episodeId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,course_id,episode_id",
          }
        );

      if (error) {
        console.error("Error saving progress:", error);
        return false;
      }

      setCompletedEpisodes((prev) => new Set([...prev, episodeId]));
      return true;
    } catch (err) {
      console.error("Failed to save progress:", err);
      return false;
    }
  }, [user?.id, courseId]);

  // Mark all episodes as complete
  const markAllComplete = useCallback(async (episodeIds: string[]) => {
    if (!user?.id || !courseId) return false;

    try {
      const records = episodeIds.map((episodeId) => ({
        user_id: user.id,
        course_id: courseId,
        episode_id: episodeId,
        completed: true,
        completed_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("course_progress")
        .upsert(records, { onConflict: "user_id,course_id,episode_id" });

      if (error) {
        console.error("Error saving all progress:", error);
        return false;
      }

      setCompletedEpisodes(new Set(episodeIds));
      return true;
    } catch (err) {
      console.error("Failed to save all progress:", err);
      return false;
    }
  }, [user?.id, courseId]);

  // Calculate progress percentage
  const getProgressPercentage = useCallback((totalEpisodes: number) => {
    if (totalEpisodes === 0) return 0;
    return Math.round((completedEpisodes.size / totalEpisodes) * 100);
  }, [completedEpisodes]);

  return {
    completedEpisodes,
    isLoading,
    markEpisodeComplete,
    markAllComplete,
    getProgressPercentage,
    isEpisodeComplete: (episodeId: string) => completedEpisodes.has(episodeId),
  };
};

// Hook to get all course progress for a user
export const useAllCourseProgress = () => {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({}); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllProgress = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("course_progress")
          .select("course_id, episode_id")
          .eq("user_id", user.id)
          .eq("completed", true);

        if (error) {
          console.error("Error loading all course progress:", error);
        } else if (data) {
          // Count completed episodes per course
          const counts: Record<string, number> = {};
          data.forEach((record: { course_id: string }) => {
            counts[record.course_id] = (counts[record.course_id] || 0) + 1;
          });
          setProgressMap(counts);
        }
      } catch (err) {
        console.error("Failed to load all course progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProgress();
  }, [user?.id]);

  return { progressMap, isLoading };
};
