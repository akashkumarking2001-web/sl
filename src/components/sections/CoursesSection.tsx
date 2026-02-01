import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Users, Play, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    id: "web-development",
    title: "Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, and modern frameworks to build real-world websites and web applications.",
    rating: 4.9,
    students: 2500,
    duration: "40 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    color: "from-blue-500 to-blue-600",
    recommendedPlan: "VELOCITY",
    mrp: 4999,
    price: 1399,
    modules: 12,
  },
  {
    id: "python-beginners",
    title: "Python for Beginners",
    description: "Master Python programming from scratch and start building applications, scripts, and automation tools.",
    rating: 4.8,
    students: 3200,
    duration: "35 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
    color: "from-emerald-500 to-teal-600",
    recommendedPlan: "APEX",
    mrp: 5999,
    price: 2800,
    modules: 10,
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Mastery",
    description: "Become an expert in SEO, Social Media, Paid Ads & Analytics to grow any business online.",
    rating: 4.9,
    students: 4100,
    duration: "50 hours",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    color: "from-amber-500 to-orange-500",
    recommendedPlan: "ZENITH",
    mrp: 9999,
    price: 4499,
    modules: 15,
  },
  {
    id: "ai-prompt",
    title: "AI & Prompt Engineering",
    description: "Learn to leverage AI tools like ChatGPT, Midjourney, and more to supercharge your productivity.",
    rating: 4.9,
    students: 1800,
    duration: "25 hours",
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    color: "from-violet-500 to-purple-600",
    recommendedPlan: "ZENITH",
    mrp: 7999,
    price: 4499,
    modules: 8,
  },
  {
    id: "ecommerce",
    title: "E-commerce & Dropshipping",
    description: "Build and scale your online store from zero. Learn product sourcing, marketing, and fulfillment.",
    rating: 4.7,
    students: 2900,
    duration: "45 hours",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    color: "from-rose-500 to-pink-600",
    recommendedPlan: "APEX",
    mrp: 5999,
    price: 2800,
    modules: 14,
  },
  {
    id: "cryptocurrency",
    title: "Cryptocurrency Fundamentals",
    description: "Understand blockchain, trading strategies, DeFi, and how to navigate the crypto ecosystem safely.",
    rating: 4.6,
    students: 1500,
    duration: "30 hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
    color: "from-amber-400 to-yellow-500",
    recommendedPlan: "PINNACLE",
    mrp: 8999,
    price: 4499,
    modules: 10,
  },
];

const CoursesSection = () => {
  const navigate = useNavigate();

  const handleCourseClick = (course: typeof courses[0]) => {
    // Navigate to course detail page
    navigate(`/course/${course.id}`);
  };

  return (
    <section id="courses" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-6">
            <BookOpen className="w-4 h-4" />
            Expert-Led Courses
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Top <span className="text-gradient-teal">Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular skill-building courses curated by industry experts. 
            Each course is designed for practical application and real-world results.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-card/90 flex items-center justify-center shadow-elevated">
                    <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Level badge */}
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${course.color} text-white`}>
                  {course.level}
                </span>

                {/* Modules badge */}
                <span className="absolute top-4 right-4 px-2 py-1 rounded bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground">
                  {course.modules} Modules
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-medium text-foreground">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-foreground">₹{course.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{course.mrp.toLocaleString()}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald/20 text-emerald font-bold">
                    {Math.round((1 - course.price / course.mrp) * 100)}% OFF
                  </span>
                </div>

                {/* CTA */}
                <Button variant="outline" className="w-full group/btn border-primary/30 hover:bg-primary hover:text-primary-foreground">
                  View Course Details
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link to="/register">
            <Button variant="hero" size="lg" className="group">
              Explore All Courses
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

// Export courses data for use in other components
export { courses };
