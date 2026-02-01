import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  BookOpen, 
  Send, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import AffiliateSidebar from "@/components/layout/AffiliateSidebar";

const SubmitCoursePage = () => {
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: profile?.full_name || "",
    contactNumber: profile?.phone || "",
    whatsappNumber: "",
    email: profile?.email || "",
    courseLink: "",
    courseDescription: "",
  });

  const guidelines = [
    "Course content must be original and created by you",
    "Video quality should be at least 720p HD",
    "Audio must be clear and free from background noise",
    "Content should be educational and provide real value",
    "No copyrighted materials without proper licenses",
    "Course must be complete (no placeholder videos)",
    "English or Hindi language preferred",
    "Minimum 30 minutes of total content",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a course.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("course_submissions")
        .insert({
          user_id: user.id,
          username: formData.username,
          contact_number: formData.contactNumber,
          whatsapp_number: formData.whatsappNumber,
          email: formData.email,
          course_link: formData.courseLink,
          course_description: formData.courseDescription,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Course Submitted! 🎉",
        description: "Our team will review your submission within 48 hours.",
      });
    } catch (error) {
      console.error("Error submitting course:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  // Guidelines Popup
  if (showGuidelines) {
    return (
      <AffiliateSidebar>
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-3xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                <Info className="w-8 h-8 text-foreground" />
              </div>
              <h1 className="text-2xl font-bold font-display">Course Submission Guidelines</h1>
              <p className="text-muted-foreground mt-2">Please read before submitting your course</p>
            </div>

            <div className="space-y-3 mb-8">
              {guidelines.map((guideline, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                  <span className="text-sm">{guideline}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-destructive/10 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div>
                  <p className="font-medium text-destructive">Rejection Criteria</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Courses with poor quality, copyrighted content, incomplete modules, or misleading descriptions will be rejected.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={() => setShowGuidelines(false)}>
              I Understand, Continue to Form
            </Button>
          </div>
        </div>
      </AffiliateSidebar>
    );
  }

  // Success State
  if (isSubmitted) {
    return (
      <AffiliateSidebar>
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-2">Course Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Our team will review your course within 48 hours. You'll be notified once it's approved.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard/affiliate")}>
                Back to Dashboard
              </Button>
              <Button variant="hero" onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  username: profile?.full_name || "",
                  contactNumber: profile?.phone || "",
                  whatsappNumber: "",
                  email: profile?.email || "",
                  courseLink: "",
                  courseDescription: "",
                });
              }}>
                Submit Another Course
              </Button>
            </div>
          </div>
        </div>
      </AffiliateSidebar>
    );
  }

  return (
    <AffiliateSidebar>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm mb-4">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-medium text-primary">Become a Creator</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">Submit Your Course</h1>
          <p className="text-muted-foreground mt-2">
            Share your knowledge and earn when students enroll
          </p>
        </div>

        {/* Form */}
        <div className="glass-card p-6 lg:p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name *</label>
                <Input
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number *</label>
                <Input
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number *</label>
                <Input
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Link *</label>
              <Input
                required
                value={formData.courseLink}
                onChange={(e) => setFormData({ ...formData, courseLink: e.target.value })}
                placeholder="https://drive.google.com/... or YouTube playlist link"
              />
              <p className="text-xs text-muted-foreground">
                Provide a Google Drive, YouTube, or any accessible link to your course content
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Description *</label>
              <Textarea
                required
                rows={5}
                value={formData.courseDescription}
                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                placeholder="Describe your course content, what students will learn, target audience, etc."
              />
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Course for Review
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </AffiliateSidebar>
  );
};

export default SubmitCoursePage;