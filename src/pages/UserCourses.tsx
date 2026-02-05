import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Play,
  Star,
  Clock,
  Users,
  CheckCircle,
  Lock,
  Crown,
  Gem,
  Trophy,
  Sparkles,
  Award,
  Search,
  ChevronRight,
  ShoppingCart,
  Zap,
  ArrowUpRight,
  LockKeyhole
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import { packages } from "@/data/packages";
import CourseViewer from "@/components/CourseViewer";
import CourseQuiz from "@/components/CourseQuiz";
import CourseCertificate from "@/components/CourseCertificate";
import { useAllCourseProgress } from "@/hooks/useCourseProgress";
import NativeHeader from "@/components/layout/NativeHeader";

// Sample course data with modules and episodes
const courseData = {
  "Digital Marketing Mastery": {
    id: "dm-001",
    title: "Digital Marketing Mastery",
    description: "Master SEO, Social Media, Paid Ads & Analytics",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    duration: "50 hours",
    students: 4100,
    rating: 4.9,
    progress: 75,
    enrolled: false,
    modules: [
      {
        id: "mod1",
        title: "Module 1: Digital Marketing Foundations",
        description: "Build a solid foundation in digital marketing principles and strategy.",
        episodes: [
          { id: "dm-ep1", title: "What is Digital Marketing?", description: "Understand the digital marketing landscape and its importance in today's business world.", duration: "18 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Course Notes", url: "#" }, { label: "Glossary PDF", url: "#" }], completed: true },
          { id: "dm-ep2", title: "Building Your Digital Strategy", description: "Learn to create a comprehensive digital marketing strategy aligned with business goals.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Strategy Template", url: "#" }], completed: true },
          { id: "dm-ep3", title: "Understanding Your Target Audience", description: "Master customer personas and audience segmentation techniques.", duration: "22 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
        ]
      },
      {
        id: "mod2",
        title: "Module 2: Search Engine Optimization (SEO)",
        description: "Master the art and science of ranking higher on search engines.",
        episodes: [
          { id: "dm-ep4", title: "SEO Fundamentals", description: "Learn how search engines work and the basics of SEO.", duration: "30 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "SEO Checklist", url: "#" }], completed: true },
          { id: "dm-ep5", title: "Keyword Research Mastery", description: "Discover powerful keyword research techniques and tools.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Keyword Tools List", url: "#" }], completed: true },
          { id: "dm-ep6", title: "On-Page SEO Optimization", description: "Optimize your website content for better search rankings.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "dm-ep7", title: "Link Building Strategies", description: "Build high-quality backlinks to boost your domain authority.", duration: "28 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      },
      {
        id: "mod3",
        title: "Module 3: Social Media Marketing",
        description: "Create and execute winning social media strategies.",
        episodes: [
          { id: "dm-ep8", title: "Social Media Landscape Overview", description: "Understand different social platforms and their unique audiences.", duration: "20 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "dm-ep9", title: "Content Creation for Social", description: "Create engaging content that resonates with your audience.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Content Calendar Template", url: "#" }], completed: false },
          { id: "dm-ep10", title: "Building Community & Engagement", description: "Grow and nurture an engaged community around your brand.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      },
      {
        id: "mod4",
        title: "Module 4: Paid Advertising",
        description: "Learn to create and optimize profitable ad campaigns.",
        episodes: [
          { id: "dm-ep11", title: "Introduction to PPC Advertising", description: "Learn the fundamentals of pay-per-click advertising.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "dm-ep12", title: "Google Ads Masterclass", description: "Create and optimize Google Ads campaigns for maximum ROI.", duration: "45 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Google Ads Guide", url: "#" }], completed: false },
          { id: "dm-ep13", title: "Facebook & Instagram Ads", description: "Master Meta advertising platform for targeted campaigns.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "dm-ep14", title: "Analytics & Campaign Optimization", description: "Track, measure, and optimize your ad campaigns.", duration: "30 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "KPI Dashboard Template", url: "#" }], completed: false },
        ]
      }
    ],
    quiz: [
      { id: "q1", question: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engine Optimization", "Search Email Optimization", "Site Engine Optimization"], correctIndex: 0 },
      { id: "q2", question: "Which platform is best for B2B marketing?", options: ["TikTok", "LinkedIn", "Snapchat", "Pinterest"], correctIndex: 1 },
      { id: "q3", question: "What is a CTA?", options: ["Click Through Action", "Call To Action", "Content To Audience", "Campaign Target Analysis"], correctIndex: 1 },
      { id: "q4", question: "What is the ideal email open rate?", options: ["5-10%", "15-25%", "50-60%", "80-90%"], correctIndex: 1 },
      { id: "q5", question: "Which metric measures ad effectiveness?", options: ["CTR", "URL", "HTML", "CSS"], correctIndex: 0 },
    ]
  },
  "AI & Prompt Engineering": {
    id: "ai-001",
    title: "AI & Prompt Engineering",
    description: "Leverage AI tools like ChatGPT & Midjourney",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    duration: "25 hours",
    students: 1800,
    rating: 4.9,
    progress: 45,
    enrolled: false,
    modules: [
      {
        id: "ai-mod1",
        title: "Module 1: Introduction to AI",
        description: "Understand the AI landscape and foundational concepts.",
        episodes: [
          { id: "ai-ep1", title: "The AI Revolution", description: "Understand how AI is transforming industries and creating new opportunities.", duration: "20 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "AI Landscape Report", url: "#" }], completed: true },
          { id: "ai-ep2", title: "How Large Language Models Work", description: "Demystify the technology behind ChatGPT and similar models.", duration: "30 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
          { id: "ai-ep3", title: "AI Ethics & Responsible Use", description: "Learn about ethical considerations when using AI tools.", duration: "18 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
        ]
      },
      {
        id: "ai-mod2",
        title: "Module 2: Mastering ChatGPT",
        description: "Become proficient in using ChatGPT for various tasks.",
        episodes: [
          { id: "ai-ep4", title: "ChatGPT Fundamentals", description: "Get started with ChatGPT and understand its capabilities.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Quick Start Guide", url: "#" }], completed: true },
          { id: "ai-ep5", title: "Prompt Engineering Basics", description: "Learn the art of crafting effective prompts for better outputs.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Prompt Templates", url: "#" }], completed: false },
          { id: "ai-ep6", title: "Advanced Prompting Techniques", description: "Master chain-of-thought, few-shot learning, and role-playing.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "ai-ep7", title: "ChatGPT for Business Applications", description: "Apply ChatGPT to real business use cases.", duration: "30 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      },
      {
        id: "ai-mod3",
        title: "Module 3: AI Image Generation",
        description: "Create stunning visuals with AI image generators.",
        episodes: [
          { id: "ai-ep8", title: "Introduction to Midjourney", description: "Get started with AI image generation using Midjourney.", duration: "22 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "ai-ep9", title: "Crafting Perfect Image Prompts", description: "Learn to write prompts that generate stunning visuals.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Style Reference Guide", url: "#" }], completed: false },
          { id: "ai-ep10", title: "DALL-E & Stable Diffusion", description: "Explore alternative AI image generation tools.", duration: "28 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      },
      {
        id: "ai-mod4",
        title: "Module 4: Building AI-Powered Products",
        description: "Create and monetize AI-powered applications.",
        episodes: [
          { id: "ai-ep11", title: "AI APIs & Integrations", description: "Connect AI capabilities to your applications.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "API Documentation", url: "#" }], completed: false },
          { id: "ai-ep12", title: "Automating Workflows with AI", description: "Build automated systems using AI tools.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "ai-ep13", title: "Monetizing AI Skills", description: "Turn your AI expertise into income streams.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      }
    ],
    quiz: [
      { id: "q1", question: "What is prompt engineering?", options: ["Building AI hardware", "Crafting effective inputs for AI", "Programming AI models", "Testing AI systems"], correctIndex: 1 },
      { id: "q2", question: "Which technique improves AI reasoning?", options: ["Random prompts", "Chain-of-thought", "Single word inputs", "No context"], correctIndex: 1 },
      { id: "q3", question: "What is a token in LLMs?", options: ["A payment method", "A piece of text", "A security key", "A model type"], correctIndex: 1 },
      { id: "q4", question: "Which is NOT an AI image generator?", options: ["Midjourney", "DALL-E", "Photoshop", "Stable Diffusion"], correctIndex: 2 },
      { id: "q5", question: "What does GPT stand for?", options: ["General Processing Tool", "Generative Pre-trained Transformer", "Global Processing Technology", "Generated Program Text"], correctIndex: 1 },
    ]
  },
  "E-commerce & Dropshipping": {
    id: "ec-001",
    title: "E-commerce & Dropshipping",
    description: "Build and scale your online store",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    duration: "45 hours",
    students: 2900,
    rating: 4.7,
    progress: 90,
    enrolled: false,
    modules: [
      {
        id: "ec-mod1",
        title: "Module 1: E-commerce Foundations",
        description: "Learn the fundamentals of online retail business.",
        episodes: [
          { id: "ec-ep1", title: "The E-commerce Landscape", description: "Understand the online retail ecosystem and opportunities.", duration: "20 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
          { id: "ec-ep2", title: "Choosing Your Business Model", description: "Evaluate dropshipping, private label, and other models.", duration: "28 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Business Model Canvas", url: "#" }], completed: true },
          { id: "ec-ep3", title: "Niche Selection & Validation", description: "Find profitable niches with proven demand.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
        ]
      },
      {
        id: "ec-mod2",
        title: "Module 2: Setting Up Your Store",
        description: "Build and configure your online store for success.",
        episodes: [
          { id: "ec-ep4", title: "Shopify Store Setup", description: "Build your store from scratch on Shopify.", duration: "45 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Shopify Checklist", url: "#" }], completed: true },
          { id: "ec-ep5", title: "Product Listing Optimization", description: "Create compelling product pages that convert.", duration: "30 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
          { id: "ec-ep6", title: "Payment & Shipping Setup", description: "Configure payments and shipping for smooth operations.", duration: "25 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
        ]
      },
      {
        id: "ec-mod3",
        title: "Module 3: Dropshipping Mastery",
        description: "Master the dropshipping business model.",
        episodes: [
          { id: "ec-ep7", title: "Finding Winning Products", description: "Discover trending products with high profit potential.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Product Research Tools", url: "#" }], completed: true },
          { id: "ec-ep8", title: "Supplier Sourcing & Management", description: "Find reliable suppliers and manage relationships.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
          { id: "ec-ep9", title: "Order Fulfillment Automation", description: "Automate your order processing workflow.", duration: "28 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: true },
        ]
      },
      {
        id: "ec-mod4",
        title: "Module 4: Marketing & Scaling",
        description: "Drive traffic and scale your e-commerce business.",
        episodes: [
          { id: "ec-ep10", title: "Facebook Ads for E-commerce", description: "Create high-converting Facebook ad campaigns.", duration: "50 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [{ label: "Ad Templates", url: "#" }], completed: true },
          { id: "ec-ep11", title: "Email Marketing Automation", description: "Build email sequences that drive repeat purchases.", duration: "35 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
          { id: "ec-ep12", title: "Scaling to 6 Figures", description: "Strategies to grow your store to six-figure revenue.", duration: "40 min", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", links: [], completed: false },
        ]
      }
    ],
    quiz: [
      { id: "q1", question: "What is dropshipping?", options: ["Selling products you store", "Selling without holding inventory", "Dropping prices", "Shipping faster"], correctIndex: 1 },
      { id: "q2", question: "Which platform is best for dropshipping?", options: ["WordPress", "Shopify", "Blogger", "Medium"], correctIndex: 1 },
      { id: "q3", question: "What is AOV?", options: ["Always Order Value", "Average Order Value", "All Orders Visible", "Actual Order Volume"], correctIndex: 1 },
      { id: "q4", question: "What is ROAS?", options: ["Return on Ad Spend", "Rate of Average Sales", "Revenue of All Stores", "Retail Order and Sales"], correctIndex: 0 },
      { id: "q5", question: "Best way to find winning products?", options: ["Random selection", "Spy tools & trends", "Only your ideas", "Copy competitors exactly"], correctIndex: 1 },
    ]
  }
};

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Creator Pack": Star,
  "Social Media Mastery": Sparkles,
  "Business & Commerce": Crown,
  "Digital Marketing Pro": Gem,
  "Financial Trading Expert": Trophy,
};

// Episode count per course for progress calculation
const courseEpisodeCounts: Record<string, number> = {
  "dm-001": 14, // Digital Marketing Mastery
  "ai-001": 13, // AI & Prompt Engineering
  "ec-001": 12, // E-commerce & Dropshipping
};

const UserCourses = () => {
  const [activeTab, setActiveTab] = useState<"enrolled" | "all">("enrolled");
  const [viewingCourse, setViewingCourse] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<string | null>(null);
  const navigate = useNavigate();
  const isNative = Capacitor.isNativePlatform() || ['8080', '5174'].includes(window.location.port);

  // Load all course progress from database
  const { progressMap, isLoading: isProgressLoading } = useAllCourseProgress();
  const { profile } = useAuth();

  // Define logic for which plans unlock which courses
  const planUnlockLevels: Record<string, number> = {
    "SPARK": 1,
    "MOMENTUM": 2,
    "SUMMIT": 3,
    "TITAN": 4,
    "LEGACY": 5
  };

  const userLevel = profile?.purchased_plan ? (planUnlockLevels[profile.purchased_plan.toUpperCase()] || 0) : 0;

  // Calculate progress percentage from database
  const getProgress = (courseId: string) => {
    const completed = progressMap[courseId] || 0;
    const total = courseEpisodeCounts[courseId] || 1;
    return Math.round((completed / total) * 100);
  };

  const courses = useMemo(() => [
    { ...courseData["Digital Marketing Mastery"], level: 1, progress: getProgress("dm-001"), enrolled: userLevel >= 1 },
    { ...courseData["AI & Prompt Engineering"], level: 2, progress: getProgress("ai-001"), enrolled: userLevel >= 2 },
    { ...courseData["E-commerce & Dropshipping"], level: 3, progress: getProgress("ec-001"), enrolled: userLevel >= 3 },
    { id: "wd-001", title: "Web Development Bootcamp", level: 4, description: "Learn HTML, CSS, JavaScript & modern frameworks", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop", duration: "40 hours", students: 2500, rating: 4.9, progress: 0, enrolled: userLevel >= 4 },
  ], [progressMap, userLevel]);

  const enrolledCourses = courses.filter(c => c.enrolled);

  // displayCourses for the original website layout
  const displayCourses = activeTab === "enrolled" ? enrolledCourses : courses;

  const handleCourseComplete = (courseId: string) => {
    setViewingCourse(null);
    setShowQuiz(courseId);
  };

  const handleQuizPass = () => {
    setShowQuiz(null);
    setShowCertificate("Digital Marketing Mastery");
  };

  if (isNative) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-primary/30">
        {/* Native Status Top Spacer */}
        <div className="h-12 bg-black w-full" />

        {/* Course Viewer Overlay */}
        {viewingCourse && courseData[viewingCourse as keyof typeof courseData] && (
          <CourseViewer
            course={courseData[viewingCourse as keyof typeof courseData]}
            onClose={() => setViewingCourse(null)}
            onComplete={handleCourseComplete}
          />
        )}

        {/* Ultra-Premium Header */}
        <NativeHeader title="My Academy" />

        <main className="flex-1 overflow-y-auto pb-32">
          {/* Section: My Courses */}
          <section className="mt-6">
            <div className="px-6 flex items-center justify-between mb-6">
              <h3 className="text-lg font-black tracking-tight italic">Purchased Courses</h3>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-primary text-black rounded-md">{enrolledCourses.length} Active</span>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="px-6 space-y-4">
                {enrolledCourses.map((course, i) => (
                  <div key={i} className="group relative rounded-[2.5rem] bg-white/[0.03] border border-white/10 overflow-hidden active:scale-[0.98] transition-all">
                    <img src={course.image} className="w-full h-40 object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                      <div className="flex-1 mr-4">
                        <h4 className="text-lg font-black tracking-tight mb-1">{course.title}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-primary">{course.progress}%</span>
                        </div>
                      </div>
                      <Button size="icon" className="w-12 h-12 rounded-2xl bg-primary text-black shadow-xl shadow-primary/20" onClick={() => setViewingCourse(course.title)}>
                        <Play className="w-5 h-5 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-6 p-10 rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10 text-center animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-primary/10 blur-2xl animate-pulse rounded-full" />
                  <BookOpen className="w-10 h-10 text-primary relative z-10" />
                </div>
                <h4 className="text-lg font-black mb-4 tracking-tight">Your Journey Starts Here</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed italic px-4">
                  "You haven't purchased any courses yet. Start your learning journey by buying a course today!"
                </p>
                <Button
                  onClick={() => navigate("/courses")}
                  className="mt-8 h-12 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Browse Library
                </Button>
              </div>
            )}
          </section>

          {/* Premium Shop Integration Box */}
          <section className="mt-16 px-6 pb-20">
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-black relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(251,191,36,0.5)]">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-[80px]" />
              <Zap className="absolute bottom-[-10px] left-[-10px] w-32 h-32 text-black/5 rotate-12" />

              <h3 className="text-3xl font-black tracking-tighter leading-none mb-4 uppercase italic">Ascend <br /> Equipment Store</h3>
              <p className="text-black/60 text-xs font-black uppercase tracking-widest mb-8 leading-tight">Master the tools of the elite. Get exclusive tech, electronics, and digital assets.</p>

              <Button onClick={() => navigate("/shopping")} className="h-14 px-8 rounded-2xl bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Enter Shopping Hub
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- RESTORED ORIGINAL WEBSITE LAYOUT ---
  return (
    <div className="min-h-screen bg-background">
      {/* Course Viewer */}
      {viewingCourse && courseData[viewingCourse as keyof typeof courseData] && (
        <CourseViewer
          course={courseData[viewingCourse as keyof typeof courseData]}
          onClose={() => setViewingCourse(null)}
          onComplete={handleCourseComplete}
        />
      )}

      {/* Quiz */}
      {showQuiz && courseData["Digital Marketing Mastery"] && (
        <CourseQuiz
          courseTitle="Digital Marketing Mastery"
          questions={courseData["Digital Marketing Mastery"].quiz}
          passingScore={60}
          onPass={handleQuizPass}
          onClose={() => setShowQuiz(null)}
        />
      )}

      {/* Certificate */}
      {showCertificate && (
        <CourseCertificate
          studentName="John Doe"
          courseName={showCertificate}
          completionDate={new Date().toLocaleDateString()}
          certificateId={`SH-${Date.now()}`}
          onClose={() => setShowCertificate(null)}
        />
      )}

      {/* Header */}
      <header className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/user-home")} className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/"><img src={logo} alt="Skill Learners" className="h-12 w-auto drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" /></Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/user-home" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/dashboard/courses" className="text-primary font-medium">Courses</Link>
            <Link to="/dashboard/affiliate" className="text-muted-foreground hover:text-foreground transition-colors">Affiliate</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Premium Combo Packages (Affiliate Unlock) */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4">
              Premium <span className="text-gradient-gold">Combo Packages</span>
            </h1>
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-primary/5 border border-primary/20 mb-6">
              <p className="text-sm text-primary font-bold flex items-center justify-center gap-2">
                <LockKeyhole className="w-4 h-4" />
                Purchasing a Combo Package is mandatory to unlock your Affiliate Wallet & earning features.
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-5">
            {packages.map((plan) => {
              const Icon = planIcons[plan.name] || Star;
              return (
                <div key={plan.name} className={`snap-center flex-shrink-0 w-72 lg:w-auto glass-card rounded-3xl p-5 ${plan.popular ? "ring-2 ring-primary shadow-glow-gold" : ""}`}>
                  {plan.popular && <span className="inline-block px-2 py-0.5 bg-gradient-gold text-primary-foreground text-xs font-bold rounded-full mb-2">Best Value</span>}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{plan.mrp.toLocaleString()}</span>
                  </div>
                  {plan.bonus && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-tight">
                        {plan.bonus}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mb-3">{plan.shortDesc}</p>
                  <Link to={`/payment?plan=${plan.name}`}>
                    <Button variant={plan.popular ? "hero" : "outline"} size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Individual Courses Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-display">Expert-Led Courses</h2>
            <div className="flex gap-2">
              <Button variant={activeTab === "enrolled" ? "hero" : "outline"} size="sm" onClick={() => setActiveTab("enrolled")}>My Courses</Button>
              <Button variant={activeTab === "all" ? "hero" : "outline"} size="sm" onClick={() => setActiveTab("all")}>All Courses</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <div key={course.title} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {course.enrolled ? <CheckCircle className="w-5 h-5 text-emerald" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                    <span className="text-sm font-medium text-white">{course.enrolled ? "Enrolled" : "Locked"}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary fill-primary" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                  </div>
                  {course.enrolled ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm"><span>Progress</span><span className="text-primary font-medium">{course.progress}%</span></div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <Button variant="hero" className="w-full" onClick={() => setViewingCourse(course.title)}>
                        <Play className="w-4 h-4 mr-2" />{course.progress > 0 ? "Continue" : "Start"} Learning
                      </Button>
                    </div>
                  ) : (
                    <Link to="/shopping">
                      <Button variant="outline" className="w-full"><Lock className="w-4 h-4 mr-2" />Unlock Course</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserCourses;
