import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Our Plans", href: "/#plans" },
    { name: "Courses", href: "/#courses" },
    { name: "About Us", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  const resources = [
    { name: "FAQ", href: "/#faq" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/skilllearners", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/skilllearners", label: "Facebook" },
    { icon: Send, href: "https://t.me/skilllearners", label: "Telegram" },
    { icon: Youtube, href: "https://youtube.com/@skilllearners", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-secondary text-secondary-foreground overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

      <div className="relative container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Skill Learners" className="h-16 w-auto" />
            </Link>
            <p className="text-secondary-foreground/70 mb-6 leading-relaxed">
              Empowering individuals worldwide to unlock their full potential, thrive in the digital age, and achieve financial freedom through quality education.
            </p>
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Mobile App Download Buttons */}
            <div>
              <h5 className="text-sm font-semibold mb-4 text-secondary-foreground uppercase tracking-widest">Get the App</h5>
              <div className="flex flex-col gap-3">
                <a
                  href="/downloads/skill-learners.apk"
                  download="SkillLearners.apk"
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  title="Download Android App"
                >
                  <img
                    src="/google-play-badge.png"
                    alt="Get it on Google Play"
                    className="h-12 w-auto"
                  />
                </a>

                <a
                  href="/downloads/skill-learners.ipa"
                  download="SkillLearners.ipa"
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  title="Download iOS App"
                >
                  <img
                    src="/app-store-badge.png"
                    alt="Download on the App Store"
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              <p className="text-xs text-secondary-foreground/50 mt-3">
                Direct APK/IPA download. For production, use official stores.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-foreground">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-secondary-foreground">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-secondary-foreground/70">Tirunelveli, Tamil Nadu, India</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-secondary-foreground/70">+91 7200568504</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-secondary-foreground/70">support@skilllearners.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-secondary-foreground/70">Mon - Sun | 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="glass-card p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold text-foreground mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-muted-foreground">Get the latest updates on courses and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-secondary-foreground/20 text-center">
          <p className="text-secondary-foreground/60">
            © {new Date().getFullYear()} <span className="font-semibold" style={{ color: "#F2B035" }}>Skill</span> <span className="font-semibold" style={{ color: "#2D8077" }}>Learners</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
