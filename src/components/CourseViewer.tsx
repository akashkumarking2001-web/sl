import { useState, useEffect } from "react";
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Award,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Folder,
  PlayCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { toast } from "sonner";

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  links?: { label: string; url: string }[];
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  episodes: Episode[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules?: Module[];
  episodes?: Episode[]; // For backward compatibility
}

interface CourseViewerProps {
  course: Course;
  onClose: () => void;
  onComplete: (courseId: string) => void;
}

const CourseViewer = ({ course, onClose, onComplete }: CourseViewerProps) => {
  // Convert flat episodes to modules if needed
  const modules: Module[] = course.modules || [{
    id: 'default',
    title: 'Course Content',
    description: course.description,
    episodes: course.episodes || []
  }];

  const allEpisodes = modules.flatMap(m => m.episodes);
  
  // Use database-backed progress tracking
  const { 
    completedEpisodes, 
    isLoading: isProgressLoading,
    markEpisodeComplete, 
    markAllComplete,
    isEpisodeComplete 
  } = useCourseProgress(course.id);
  
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentEpisodeIdx, setCurrentEpisodeIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([modules[0]?.id])
  );

  const currentModule = modules[currentModuleIdx];
  const episode = currentModule?.episodes[currentEpisodeIdx];
  const totalEpisodes = allEpisodes.length;
  const progress = Math.round((completedEpisodes.size / totalEpisodes) * 100);
  const allCompleted = completedEpisodes.size === totalEpisodes;

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectEpisode = (moduleIdx: number, episodeIdx: number) => {
    setCurrentModuleIdx(moduleIdx);
    setCurrentEpisodeIdx(episodeIdx);
    // Expand the module
    setExpandedModules(prev => new Set([...prev, modules[moduleIdx].id]));
  };

  const markComplete = async () => {
    if (!episode || isSaving) return;
    
    setIsSaving(true);
    const success = await markEpisodeComplete(episode.id);
    setIsSaving(false);
    
    if (success) {
      toast.success("Progress saved!");
      
      // Auto-advance to next episode
      if (currentEpisodeIdx < currentModule.episodes.length - 1) {
        setTimeout(() => setCurrentEpisodeIdx(currentEpisodeIdx + 1), 1000);
      } else if (currentModuleIdx < modules.length - 1) {
        // Move to next module
        setTimeout(() => {
          setCurrentModuleIdx(currentModuleIdx + 1);
          setCurrentEpisodeIdx(0);
          setExpandedModules(prev => new Set([...prev, modules[currentModuleIdx + 1].id]));
        }, 1000);
      }
    } else {
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const handleCompleteAll = async () => {
    setIsSaving(true);
    const allEpisodeIds = allEpisodes.map(e => e.id);
    const success = await markAllComplete(allEpisodeIds);
    setIsSaving(false);
    
    if (success) {
      onComplete(course.id);
    } else {
      toast.error("Failed to save progress.");
    }
  };

  const getModuleProgress = (module: Module) => {
    const completed = module.episodes.filter(e => isEpisodeComplete(e.id)).length;
    return { completed, total: module.episodes.length };
  };

  const getGlobalEpisodeNumber = (moduleIdx: number, episodeIdx: number) => {
    let count = 0;
    for (let i = 0; i < moduleIdx; i++) {
      count += modules[i].episodes.length;
    }
    return count + episodeIdx + 1;
  };

  if (!episode) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No episodes available</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg line-clamp-1">{course.title}</h1>
              <p className="text-xs text-muted-foreground">
                Episode {getGlobalEpisodeNumber(currentModuleIdx, currentEpisodeIdx)} of {totalEpisodes}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="font-bold text-primary">{progress}%</p>
            </div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="relative bg-secondary aspect-video w-full max-h-[60vh] flex-shrink-0">
            <video 
              key={episode.id}
              src={episode.videoUrl}
              className="w-full h-full object-contain"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={markComplete}
            />
          </div>

          {/* Episode Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl">
              {/* Module Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm text-primary mb-4">
                <Folder className="w-4 h-4" />
                <span className="font-medium">{currentModule.title}</span>
              </div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold font-display mb-2">{episode.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {episode.duration}
                    </span>
                    {isEpisodeComplete(episode.id) && (
                      <span className="flex items-center gap-1 text-emerald">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                {!isEpisodeComplete(episode.id) && (
                  <Button variant="hero" onClick={markComplete} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    {isSaving ? "Saving..." : "Mark Complete"}
                  </Button>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{episode.description}</p>

              {/* Resources/Links */}
              {episode.links && episode.links.length > 0 && (
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Resources & Links
                  </h3>
                  <div className="space-y-2">
                    {episode.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <span className="font-medium text-sm">{link.label}</span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Course CTA */}
              {allCompleted && (
                <div className="mt-6 glass-card p-6 rounded-2xl text-center border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
                  <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold font-display mb-2">Congratulations! 🎉</h3>
                  <p className="text-muted-foreground mb-4">You've completed all episodes in this course!</p>
                  <Button variant="hero" onClick={handleCompleteAll}>
                    <Award className="w-4 h-4 mr-2" />
                    Take Assessment & Get Certificate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module/Episode List Sidebar - Desktop */}
        <div className="hidden lg:flex lg:flex-col w-96 border-l border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm">
            <h3 className="font-bold text-lg">Course Content</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {completedEpisodes.size} of {totalEpisodes} episodes completed
            </p>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {modules.map((module, moduleIdx) => {
              const { completed, total } = getModuleProgress(module);
              const isExpanded = expandedModules.has(module.id);
              const isCurrentModule = moduleIdx === currentModuleIdx;
              
              return (
                <div key={module.id} className="mb-2">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-colors flex items-start gap-3",
                      isCurrentModule ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      completed === total ? "bg-emerald/10 text-emerald" : "bg-primary/10 text-primary"
                    )}>
                      {completed === total ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Folder className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm line-clamp-1">{module.title}</p>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {completed}/{total} episodes • {module.description?.slice(0, 40)}...
                      </p>
                    </div>
                  </button>
                  
                  {/* Episodes */}
                  {isExpanded && (
                    <div className="pl-4 mt-1 space-y-1">
                      {module.episodes.map((ep, episodeIdx) => {
                        const isCompleted = isEpisodeComplete(ep.id);
                        const isCurrent = moduleIdx === currentModuleIdx && episodeIdx === currentEpisodeIdx;
                        
                        return (
                          <button
                            key={ep.id}
                            onClick={() => selectEpisode(moduleIdx, episodeIdx)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3",
                              isCurrent ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              isCompleted 
                                ? "bg-emerald/10 text-emerald" 
                                : isCurrent 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted text-muted-foreground"
                            )}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : isCurrent ? (
                                <PlayCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-medium">{episodeIdx + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "font-medium text-sm line-clamp-2",
                                isCurrent && "text-primary"
                              )}>
                                {ep.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {ep.duration}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Episode Playlist */}
      <div className="lg:hidden border-t border-border bg-card">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm">Course Playlist</h3>
          <span className="text-xs text-muted-foreground">{completedEpisodes.size}/{totalEpisodes}</span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {modules.map((module, moduleIdx) => (
            <div key={module.id}>
              {/* Module Header - Mobile */}
              <div className="px-4 py-2 bg-muted/50 border-b border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {module.title}
                </p>
              </div>
              {module.episodes.map((ep, episodeIdx) => {
                const isCompleted = isEpisodeComplete(ep.id);
                const isCurrent = moduleIdx === currentModuleIdx && episodeIdx === currentEpisodeIdx;
                return (
                  <button
                    key={ep.id}
                    onClick={() => selectEpisode(moduleIdx, episodeIdx)}
                    className={cn(
                      "w-full text-left p-3 flex items-center gap-3 border-b border-border/50",
                      isCurrent ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      isCompleted ? "bg-emerald/10 text-emerald" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-xs font-medium">{episodeIdx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm line-clamp-1", isCurrent && "font-medium text-primary")}>
                        {ep.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{ep.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
