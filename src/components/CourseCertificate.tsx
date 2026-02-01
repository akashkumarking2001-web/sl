import { useRef } from "react";
import { X, Download, Share2, Award, Calendar, Shield, CheckCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface CourseCertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  onClose: () => void;
}

// Course-specific skills mapping
const courseSkills: Record<string, string[]> = {
  "Digital Marketing Mastery": [
    "Search Engine Optimization (SEO)",
    "Social Media Marketing Strategy",
    "Google Ads & PPC Campaigns",
    "Content Marketing & Copywriting",
    "Email Marketing Automation",
    "Analytics & Performance Tracking"
  ],
  "AI & Prompt Engineering": [
    "Large Language Model Fundamentals",
    "Advanced Prompt Engineering Techniques",
    "AI Tool Integration & Automation",
    "ChatGPT & Claude Mastery",
    "AI-Powered Content Creation",
    "Ethical AI Usage & Best Practices"
  ],
  "E-commerce & Dropshipping": [
    "Shopify Store Setup & Management",
    "Product Research & Sourcing",
    "Supplier Negotiation Techniques",
    "Order Fulfillment Automation",
    "Customer Service Excellence",
    "Scaling E-commerce Operations"
  ],
  "Web Development Bootcamp": [
    "HTML5 & CSS3 Fundamentals",
    "JavaScript & React.js",
    "Responsive Web Design",
    "API Integration",
    "Database Management",
    "Deployment & DevOps Basics"
  ],
  "Cryptocurrency Fundamentals": [
    "Blockchain Technology",
    "Bitcoin & Ethereum Trading",
    "DeFi Protocols",
    "NFT Creation & Trading",
    "Risk Management",
    "Portfolio Diversification"
  ],
  "default": [
    "Industry Best Practices",
    "Practical Implementation Skills",
    "Problem-Solving Techniques",
    "Professional Communication",
    "Project Management",
    "Continuous Learning Mindset"
  ]
};

const CourseCertificate = ({
  studentName,
  courseName,
  completionDate,
  certificateId,
  onClose
}: CourseCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const skills = courseSkills[courseName] || courseSkills["default"];
  const verificationUrl = `https://skillhonors.com/verify/${certificateId}`;

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Download Started",
      description: "Certificate PDF generation has started.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${courseName}`,
        text: `I just completed ${courseName} at Skill Honors!`,
        url: verificationUrl,
      });
    } else {
      navigator.clipboard.writeText(verificationUrl);
      toast({
        title: "Link Copied",
        description: "Certificate verification link copied to clipboard!",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm overflow-y-auto">
      <div className="my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-card hover:bg-muted transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="relative bg-gradient-to-br from-[#fef9e7] via-white to-[#f5f5dc] rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-2xl overflow-hidden"
        >
          {/* Decorative Border */}
          <div className="absolute inset-3 border-2 border-primary/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border border-primary/20 rounded-xl pointer-events-none" />

          {/* Corner Decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-xl" />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72">
              <Award className="w-full h-full text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-6">
              <img src={logo} alt="Skill Honors" className="h-14 md:h-16 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">
                Certificate of Completion
              </h1>
              <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full" />
            </div>

            {/* Main Info */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm mb-2">This is to certify that</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3"
                style={{ fontFamily: 'serif' }}>
                {studentName}
              </h2>
              <p className="text-muted-foreground text-sm mb-2">has successfully completed the course</p>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
                {courseName}
              </h3>
            </div>

            {/* Skills Acquired Section */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-4 md:p-6 mb-6 border border-primary/10">
              <h4 className="text-center font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Skills Acquired
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    <span className="text-foreground/80">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Date, ID, and QR Code */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Date & ID */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{completionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>ID: {certificateId}</span>
                </div>
              </div>

              {/* Signature */}
              <div className="hidden md:flex gap-8">
                <div className="text-center">
                  <div className="w-24 border-b-2 border-primary/40 mb-1" />
                  <p className="text-xs text-muted-foreground">Director</p>
                </div>
                <div className="text-center">
                  <div className="w-24 border-b-2 border-primary/40 mb-1" />
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </div>

              {/* QR Code for Verification */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-lg p-2 border-2 border-primary/20 shadow-sm">
                  {/* Simulated QR Code */}
                  <div className="w-full h-full bg-gradient-to-br from-foreground to-foreground/80 rounded flex items-center justify-center relative">
                    <div className="absolute inset-1 grid grid-cols-5 gap-0.5">
                      {[...Array(25)].map((_, i) => (
                        <div
                          key={i}
                          className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'} rounded-sm`}
                        />
                      ))}
                    </div>
                    <QrCode className="w-6 h-6 text-white absolute" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Scan to Verify</p>
              </div>
            </div>

            {/* Verified Badge */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 w-16 h-16 md:w-20 md:h-20">
              <div className="w-full h-full rounded-full bg-gradient-gold flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground mx-auto" />
                  <p className="text-[8px] md:text-xs font-bold text-primary-foreground mt-0.5">VERIFIED</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Certificate
          </Button>
          <Button variant="hero" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificate;