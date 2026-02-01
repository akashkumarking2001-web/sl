import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What happens after I purchase a plan?",
    answer: "You'll get instant access to your dashboard with lifetime access to the courses included in your plan, live training invites, and community groups. There's no waiting—you can start learning immediately!",
  },
  {
    question: "Is this just theory, or can I actually learn and earn?",
    answer: "Every course is built for real-world application, with live tasks, mentorship, and market-ready skills. We don't just teach; we train you to implement. Many of our students start earning within their first month of learning.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade your package within 7 days by paying the difference. After that, full pricing applies, so act fast if you're planning ahead. All your progress and earnings carry over to the new plan.",
  },
  {
    question: "What kind of courses do you offer?",
    answer: "We offer courses in future-oriented technologies like Artificial Intelligence, Digital Marketing, E-commerce, Cryptocurrency, Web Development, and High-Income Skills. All courses focus on practical skills for career advancement and income opportunities.",
  },
  {
    question: "How does the community support help me?",
    answer: "Our community provides a supportive space for networking, guidance, and sharing insights. You'll connect with 10,000+ learners, get access to weekly live Q&A sessions with experts, and receive personalized mentorship to help you achieve your goals.",
  },
  {
    question: "Do you help with job placement?",
    answer: "While we don't guarantee job placement, our Diamond and Platinum plans include career mentorship and job placement assistance. Our courses equip you with the skills needed for freelancing, remote work, and high-paying job opportunities.",
  },
  {
    question: "How does the referral/affiliate program work?",
    answer: "When you refer someone who purchases a plan, you earn 10-30% commission depending on your plan level. It's a great way to earn while helping others transform their careers. There's no limit to how much you can earn!",
  },
  {
    question: "Is there a refund policy?",
    answer: "Due to the digital nature of our products and immediate access provided, we do not offer refunds. However, we're confident in the value we provide—that's why we offer extensive previews and free resources before you commit.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold font-display mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-2xl border-none px-6 overflow-hidden"
              >
                <AccordionTrigger className="py-6 text-left font-semibold hover:no-underline hover:text-primary transition-colors [&[data-state=open]>svg]:rotate-180">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Contact our support team
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
