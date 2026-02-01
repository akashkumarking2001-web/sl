import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent! ✓",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      value: "Tirunelveli, Tamil Nadu, India",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 7200568504",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "support@skilllearners.com",
    },
    {
      icon: Clock,
      title: "Open Hours",
      value: "Mon - Sun | 9AM - 5PM",
    },
  ];

  return (
    <section id="contact" className="py-12 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-4xl font-bold font-display mb-3">
            Get In <span className="text-gradient-teal">Touch</span>
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground max-w-xl mx-auto">
            Have questions or need assistance? We're here to help you on your learning journey.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 lg:p-8 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info - Compact */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-lg font-bold font-display mb-4">Contact Information</h3>
              
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-gradient-gold flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{info.title}</p>
                      <p className="text-sm font-medium truncate">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form - Compact */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold font-display mb-4">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="question"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
