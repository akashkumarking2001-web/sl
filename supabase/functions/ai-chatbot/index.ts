import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Course and package data for context
const courseData = {
  packages: [
    {
      id: 1,
      name: "STARTER",
      price: 600,
      description: "Essential editing assets for content creators",
      features: ["100GB-200GB Premium Editing Assets", "4K Video Templates & Overlays", "500+ Graphic Design Resources", "Royalty-Free Audio & SFX Library"],
      bestFor: "Beginners who want to start creating content with premium assets"
    },
    {
      id: 2,
      name: "ACCELERATOR",
      price: 1399,
      description: "Master income generation through social platforms",
      features: ["YouTube Monetization Blueprint", "Facebook Ads & Marketing Pro", "Instagram Growth Accelerator", "Telegram Empire Building", "Professional Blogging Mastery"],
      bestFor: "Content creators looking to monetize their social media presence"
    },
    {
      id: 3,
      name: "PROFESSIONAL",
      price: 2800,
      description: "Complete business & selling training",
      features: ["Affiliate Marketing Mastery", "Direct Selling Psychology", "Shopify & E-commerce Setup", "Product Sourcing Secrets", "Sales Funnel Architecture"],
      bestFor: "Entrepreneurs wanting to build online businesses"
    },
    {
      id: 4,
      name: "ELITE",
      price: 4499,
      description: "Complete digital marketing expertise",
      features: ["Canva Pro Design Mastery", "Facebook Ads Domination", "Google Ads & PPC Expert", "SEO & Content Authority", "Email Marketing Automation"],
      bestFor: "Marketing professionals and agency owners",
      popular: true
    },
    {
      id: 5,
      name: "LEGACY",
      price: 8599,
      description: "Masterclass on financial markets & trading",
      features: ["Binary Trading Mastery", "Technical Analysis Pro", "Risk Management Framework", "Live Trading Room Access", "Crypto Trading Fundamentals"],
      bestFor: "Serious investors aiming for financial freedom"
    }
  ],
  topics: [
    "Video Editing", "Content Creation", "YouTube", "Instagram", "Facebook Marketing",
    "Affiliate Marketing", "E-commerce", "Digital Marketing", "SEO", "Trading", "Crypto"
  ]
};

const systemPrompt = `You are SkillBot, a friendly and helpful AI assistant for SkillLearners - an online learning platform that offers courses in digital marketing, content creation, trading, and online business.

ABOUT THE PLATFORM:
- SkillLearners helps people learn skills to earn money online
- We offer 5 main packages from beginner (₹600) to advanced (₹8,599)
- Users can also earn through our affiliate program by referring others

AVAILABLE PACKAGES:
${JSON.stringify(courseData.packages, null, 2)}

YOUR CAPABILITIES:
1. Recommend courses based on user interests and goals
2. Answer questions about course content and features
3. Help users navigate the platform
4. Explain the affiliate/referral program
5. Provide pricing information
6. Guide users on how to get started

GUIDELINES:
- Be helpful, friendly, and encouraging
- Keep responses concise but informative (2-3 sentences unless more detail is needed)
- When recommending courses, consider user's budget, experience level, and goals
- Always encourage users to explore and learn
- If unsure, suggest they contact support or explore the courses section
- Use simple language, avoid jargon
- Be enthusiastic about helping users achieve their goals

NAVIGATION HELP:
- Home page: View all offerings
- My Courses: Access purchased courses
- Affiliate Dashboard: Track referrals and earnings
- Profile: Update personal information
- Payment: Complete pending payments

Remember: You're here to help users find the right courses and succeed in their learning journey!`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat request, type:", type || "chat");
    console.log("Number of messages:", messages?.length || 0);

    let finalMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || [])
    ];

    // For course recommendations, add specific context
    if (type === "recommend") {
      finalMessages = [
        { role: "system", content: systemPrompt + "\n\nThe user is looking for course recommendations. Analyze their interests and recommend the most suitable package(s). Explain why each recommendation fits their needs." },
        ...(messages || [])
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: finalMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please try again in a moment." 
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Service temporarily unavailable. Please try again later." 
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Handle potentially empty response
    const responseText = await response.text();
    console.log("Raw response length:", responseText.length);
    
    if (!responseText || responseText.trim() === '') {
      console.error("Empty response from AI gateway");
      return new Response(JSON.stringify({ 
        message: "I'm having trouble connecting right now. Please try again.",
        role: "assistant"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Response:", responseText.substring(0, 200));
      return new Response(JSON.stringify({ 
        message: "I encountered an issue processing the response. Please try again.",
        role: "assistant"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";

    return new Response(JSON.stringify({ 
      message: content,
      role: "assistant"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
