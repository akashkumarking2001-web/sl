import { toast } from "sonner";

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

// Pre-defined notification messages
export const notify = {
  // Auth notifications
  loginSuccess: (name?: string) => {
    toast.success(`Welcome back${name ? `, ${name}` : ''}! 👋`, {
      description: "You've successfully logged in.",
      duration: 4000,
    });
  },
  
  loginError: (message?: string) => {
    toast.error("Login failed", {
      description: message || "Please check your credentials and try again.",
      duration: 5000,
    });
  },
  
  signupSuccess: () => {
    toast.success("Account created! 🎉", {
      description: "Welcome to Skill Learners. Start your learning journey!",
      duration: 5000,
    });
  },
  
  signupError: (message?: string) => {
    toast.error("Signup failed", {
      description: message || "Please try again with different credentials.",
      duration: 5000,
    });
  },
  
  logoutSuccess: () => {
    toast.info("Signed out", {
      description: "You've been successfully logged out.",
      duration: 3000,
    });
  },

  // Course notifications
  courseEnrolled: (courseName: string) => {
    toast.success(`Enrolled in ${courseName}! 📚`, {
      description: "Start learning now to unlock your potential.",
      duration: 4000,
    });
  },
  
  courseCompleted: (courseName: string) => {
    toast.success(`Congratulations! 🏆`, {
      description: `You've completed ${courseName}. Certificate is ready!`,
      duration: 5000,
    });
  },
  
  lessonCompleted: (lessonName: string) => {
    toast.success("Lesson completed! ✅", {
      description: `Great job finishing "${lessonName}"`,
      duration: 3000,
    });
  },
  
  quizPassed: (score: number) => {
    toast.success(`Quiz passed! 🎯`, {
      description: `You scored ${score}%. Keep up the great work!`,
      duration: 4000,
    });
  },
  
  quizFailed: (score: number) => {
    toast.error("Quiz not passed", {
      description: `You scored ${score}%. Review the material and try again.`,
      duration: 4000,
    });
  },

  // Payment notifications
  paymentSuccess: (planName: string) => {
    toast.success(`Payment successful! 💳`, {
      description: `You now have access to ${planName}. Enjoy learning!`,
      duration: 5000,
    });
  },
  
  paymentPending: () => {
    toast.info("Payment submitted", {
      description: "Your payment is being verified. We'll notify you once approved.",
      duration: 5000,
    });
  },
  
  paymentFailed: (reason?: string) => {
    toast.error("Payment failed", {
      description: reason || "Please try again or contact support.",
      duration: 5000,
    });
  },

  // Referral notifications
  referralCopied: () => {
    toast.success("Referral link copied! 📋", {
      description: "Share it with friends to earn rewards.",
      duration: 3000,
    });
  },
  
  referralEarning: (amount: number) => {
    toast.success(`You earned ₹${amount}! 💰`, {
      description: "Commission credited from a successful referral.",
      duration: 4000,
    });
  },
  
  newReferral: (name: string) => {
    toast.success(`New referral! 🎉`, {
      description: `${name} joined using your link.`,
      duration: 4000,
    });
  },

  // General notifications
  profileUpdated: () => {
    toast.success("Profile updated! ✨", {
      description: "Your changes have been saved.",
      duration: 3000,
    });
  },
  
  featureLocked: () => {
    toast.error("Feature locked 🔒", {
      description: "Purchase a plan to unlock this feature.",
      duration: 4000,
    });
  },
  
  networkError: () => {
    toast.error("Connection error", {
      description: "Please check your internet connection.",
      duration: 4000,
    });
  },
  
  somethingWentWrong: () => {
    toast.error("Something went wrong", {
      description: "Please try again later.",
      duration: 4000,
    });
  },

  // Custom notification
  custom: (type: NotificationType, title: string, options?: NotificationOptions) => {
    const toastFn = type === 'success' ? toast.success 
                  : type === 'error' ? toast.error 
                  : type === 'warning' ? toast.warning 
                  : toast.info;
    
    toastFn(title, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },
};

export default notify;
