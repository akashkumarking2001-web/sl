import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Users, Play, CheckCircle2, Award, Shield, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Course data - would typically come from a database
const coursesData: Record<string, {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  image: string;
  color: string;
  recommendedPlan: string;
  mrp: number;
  price: number;
  modules: number;
  syllabus: { title: string; lessons: string[] }[];
  whatYouLearn: string[];
  requirements: string[];
  instructor: { name: string; title: string; image: string };
}> = {
  "web-development": {
    id: "web-development",
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, and modern frameworks to build real-world websites and web applications.",
    fullDescription: "This comprehensive bootcamp takes you from absolute beginner to confident web developer. You'll learn the fundamentals of web development including HTML5, CSS3, JavaScript ES6+, and modern frameworks like React. Through hands-on projects, you'll build real websites and web applications that you can add to your portfolio.",
    rating: 4.9,
    students: 2500,
    duration: "40 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    color: "from-blue-500 to-blue-600",
    recommendedPlan: "VELOCITY",
    mrp: 4999,
    price: 1399,
    modules: 12,
    syllabus: [
      { title: "HTML Fundamentals", lessons: ["Introduction to HTML", "Text & Links", "Images & Media", "Forms & Tables"] },
      { title: "CSS Mastery", lessons: ["CSS Basics", "Flexbox & Grid", "Responsive Design", "CSS Animations"] },
      { title: "JavaScript Essentials", lessons: ["Variables & Data Types", "Functions & Loops", "DOM Manipulation", "Event Handling"] },
      { title: "React Framework", lessons: ["React Basics", "Components & Props", "State Management", "Building Full Apps"] },
    ],
    whatYouLearn: [
      "Build complete websites from scratch",
      "Create responsive designs for all devices",
      "Master JavaScript programming",
      "Build React applications",
      "Deploy websites to the internet",
      "Work with APIs and databases",
    ],
    requirements: ["Basic computer skills", "Willingness to learn", "No prior coding experience needed"],
    instructor: { name: "Rahul Sharma", title: "Senior Web Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  },
  "python-beginners": {
    id: "python-beginners",
    title: "Python for Beginners",
    description: "Master Python programming from scratch and start building applications, scripts, and automation tools.",
    fullDescription: "Learn Python, one of the most versatile and in-demand programming languages. This course covers everything from basic syntax to advanced concepts like object-oriented programming and working with APIs. You'll build practical projects including automation scripts, data analysis tools, and simple web applications.",
    rating: 4.8,
    students: 3200,
    duration: "35 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop",
    color: "from-emerald-500 to-teal-600",
    recommendedPlan: "APEX",
    mrp: 5999,
    price: 2800,
    modules: 10,
    syllabus: [
      { title: "Python Basics", lessons: ["Setup & Installation", "Variables & Data Types", "Operators & Expressions", "Control Flow"] },
      { title: "Functions & Modules", lessons: ["Defining Functions", "Parameters & Returns", "Built-in Modules", "Creating Modules"] },
      { title: "Data Structures", lessons: ["Lists & Tuples", "Dictionaries & Sets", "List Comprehensions", "Working with Files"] },
      { title: "Advanced Python", lessons: ["OOP Concepts", "Error Handling", "APIs & Web Scraping", "Automation Projects"] },
    ],
    whatYouLearn: ["Python fundamentals", "Object-oriented programming", "File handling", "API integration", "Automation scripts", "Data analysis basics"],
    requirements: ["Basic computer skills", "No programming experience needed"],
    instructor: { name: "Priya Patel", title: "Python Developer & Educator", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  },
  "digital-marketing": {
    id: "digital-marketing",
    title: "Digital Marketing Mastery",
    description: "Become an expert in SEO, Social Media, Paid Ads & Analytics to grow any business online.",
    fullDescription: "Master the complete digital marketing landscape. From SEO and content marketing to paid advertising and analytics, this comprehensive course covers everything you need to know to grow any business online. Learn practical strategies used by top marketers and agencies worldwide.",
    rating: 4.9,
    students: 4100,
    duration: "50 hours",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    color: "from-amber-500 to-orange-500",
    recommendedPlan: "ZENITH",
    mrp: 9999,
    price: 4499,
    modules: 15,
    syllabus: [
      { title: "Marketing Fundamentals", lessons: ["Digital Marketing Overview", "Customer Journey", "Building Your Strategy", "Setting Goals & KPIs"] },
      { title: "SEO & Content", lessons: ["Keyword Research", "On-Page SEO", "Content Strategy", "Link Building"] },
      { title: "Paid Advertising", lessons: ["Google Ads", "Facebook Ads", "Instagram Marketing", "Retargeting Campaigns"] },
      { title: "Analytics & Optimization", lessons: ["Google Analytics", "Conversion Tracking", "A/B Testing", "Reporting & Insights"] },
    ],
    whatYouLearn: ["SEO strategies that rank", "Paid advertising mastery", "Content marketing", "Social media growth", "Analytics & data", "Marketing automation"],
    requirements: ["Basic internet skills", "Interest in marketing", "Willingness to learn"],
    instructor: { name: "Amit Kumar", title: "Digital Marketing Expert", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  },
  "ai-prompt": {
    id: "ai-prompt",
    title: "AI & Prompt Engineering",
    description: "Learn to leverage AI tools like ChatGPT, Midjourney, and more to supercharge your productivity.",
    fullDescription: "The AI revolution is here. Learn how to harness the power of AI tools to 10x your productivity and create value. This course covers prompt engineering, AI content creation, image generation, and automation. Stay ahead of the curve and future-proof your career.",
    rating: 4.9,
    students: 1800,
    duration: "25 hours",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    color: "from-violet-500 to-purple-600",
    recommendedPlan: "ZENITH",
    mrp: 7999,
    price: 4499,
    modules: 8,
    syllabus: [
      { title: "AI Fundamentals", lessons: ["Understanding AI", "Types of AI Tools", "Ethics & Best Practices", "Getting Started"] },
      { title: "ChatGPT Mastery", lessons: ["Basic Prompts", "Advanced Techniques", "Use Cases", "API Integration"] },
      { title: "Image Generation", lessons: ["Midjourney Basics", "DALL-E", "Prompt Crafting", "Commercial Use"] },
      { title: "AI Automation", lessons: ["Workflow Automation", "AI for Business", "Building AI Products", "Future Trends"] },
    ],
    whatYouLearn: ["Master ChatGPT", "Create AI images", "Automation workflows", "AI for business", "Prompt engineering", "Stay future-ready"],
    requirements: ["Basic computer skills", "Curiosity about AI"],
    instructor: { name: "Neha Singh", title: "AI Specialist", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  },
  "ecommerce": {
    id: "ecommerce",
    title: "E-commerce & Dropshipping",
    description: "Build and scale your online store from zero. Learn product sourcing, marketing, and fulfillment.",
    fullDescription: "Start your own profitable e-commerce business. This course covers everything from finding winning products to setting up your store, marketing, and fulfillment. Learn dropshipping, print-on-demand, and traditional e-commerce models. Build a business that generates income while you sleep.",
    rating: 4.7,
    students: 2900,
    duration: "45 hours",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    color: "from-rose-500 to-pink-600",
    recommendedPlan: "APEX",
    mrp: 5999,
    price: 2800,
    modules: 14,
    syllabus: [
      { title: "E-commerce Basics", lessons: ["Business Models", "Niche Selection", "Market Research", "Legal Setup"] },
      { title: "Store Setup", lessons: ["Shopify Basics", "Product Listings", "Payment Setup", "Store Design"] },
      { title: "Product Sourcing", lessons: ["Dropshipping", "Print on Demand", "Wholesale", "Private Label"] },
      { title: "Marketing & Growth", lessons: ["Facebook Ads", "Instagram Marketing", "Email Marketing", "Scaling Strategies"] },
    ],
    whatYouLearn: ["Build Shopify stores", "Find winning products", "Dropshipping mastery", "E-commerce marketing", "Order fulfillment", "Scaling strategies"],
    requirements: ["Basic internet skills", "Small budget to start", "Entrepreneurial mindset"],
    instructor: { name: "Vikram Joshi", title: "E-commerce Entrepreneur", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  },
  "cryptocurrency": {
    id: "cryptocurrency",
    title: "Cryptocurrency Fundamentals",
    description: "Understand blockchain, trading strategies, DeFi, and how to navigate the crypto ecosystem safely.",
    fullDescription: "Navigate the exciting world of cryptocurrency with confidence. Learn blockchain technology, understand different cryptocurrencies, and master trading strategies. This course covers everything from basic concepts to advanced DeFi protocols and NFTs. Invest wisely and protect your assets.",
    rating: 4.6,
    students: 1500,
    duration: "30 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    color: "from-amber-400 to-yellow-500",
    recommendedPlan: "PINNACLE",
    mrp: 8999,
    price: 4499,
    modules: 10,
    syllabus: [
      { title: "Blockchain Basics", lessons: ["What is Blockchain", "How Bitcoin Works", "Altcoins Overview", "Wallets & Security"] },
      { title: "Trading Fundamentals", lessons: ["Reading Charts", "Technical Analysis", "Trading Strategies", "Risk Management"] },
      { title: "DeFi & NFTs", lessons: ["DeFi Explained", "Yield Farming", "NFT Basics", "NFT Trading"] },
      { title: "Advanced Concepts", lessons: ["Smart Contracts", "Layer 2 Solutions", "Future of Crypto", "Building Portfolios"] },
    ],
    whatYouLearn: ["Blockchain technology", "Safe crypto investing", "Trading strategies", "DeFi protocols", "NFT marketplace", "Portfolio management"],
    requirements: ["Basic math skills", "Interest in finance", "Small investment capital (optional)"],
    instructor: { name: "Arjun Mehta", title: "Crypto Analyst & Trader", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
  },
};

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = courseId ? coursesData[courseId] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link to="/#courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round((1 - course.price / course.mrp) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section - Fixed text contrast */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="container relative mx-auto px-4 text-white">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${course.color} text-white mb-4`}>
                {course.level}
              </span>
              <h1 className="text-3xl lg:text-5xl font-bold font-display text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/70 mb-6">
                {course.fullDescription}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-bold text-white">{course.rating}</span>
                  <span>rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.modules} modules</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <img 
                  src={course.instructor.image} 
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary"
                />
                <div>
                  <p className="text-white font-medium">{course.instructor.name}</p>
                  <p className="text-white/60 text-sm">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="glass-card bg-card/90 p-6 rounded-2xl shadow-2xl">
              <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl font-bold">₹{course.price.toLocaleString()}</span>
                  <span className="text-xl text-muted-foreground line-through">₹{course.mrp.toLocaleString()}</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-lg bg-emerald/20 text-emerald font-bold text-sm">
                  {discount}% OFF - Limited Time Offer!
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  <span>Lifetime access</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  <span>24/7 mentor support</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald" />
                  <span>Downloadable resources</span>
                </li>
              </ul>

              <Link to={`/register?course=${encodeURIComponent(course.title)}&plan=${course.recommendedPlan}`}>
                <Button variant="hero" size="xl" className="w-full mb-3">
                  Enroll Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-8">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {course.whatYouLearn.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 glass-card rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-8">Course Syllabus</h2>
          <div className="space-y-4 max-w-3xl">
            {course.syllabus.map((module, index) => (
              <div key={index} className="glass-card rounded-xl overflow-hidden">
                <div className="p-4 bg-primary/5 border-b border-border">
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm text-primary font-bold">
                      {index + 1}
                    </span>
                    {module.title}
                  </h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Play className="w-4 h-4 text-primary" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold font-display mb-8">Requirements</h2>
          <ul className="space-y-3 max-w-2xl">
            {course.requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="container relative mx-auto px-4 text-center">
          <Award className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who have transformed their careers with this course.
          </p>
          <Link to={`/register?course=${encodeURIComponent(course.title)}&plan=${course.recommendedPlan}`}>
            <Button variant="hero" size="xl" className="group">
              Enroll Now for ₹{course.price.toLocaleString()}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;
