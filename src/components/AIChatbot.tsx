import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickQuestions = [
  "Which course is best for beginners?",
  "How does the affiliate program work?",
  "What's included in the Elite package?",
  "Help me choose a course"
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm ARIA, your Advanced Recommendation & Intelligence Assistant. I'm here to help you find the perfect learning path, answer questions about our platform, or guide you through our affiliate program. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: content.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: { 
          messages: [...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0), userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          type: content.toLowerCase().includes('recommend') ? 'recommend' : 'chat'
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || "I'm processing your request. Please try again in a moment."
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm experiencing a temporary connection issue. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Compact Chat Button - Medium size */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-50 transition-all duration-500",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "relative h-12 w-12 rounded-full shadow-lg",
            "bg-gradient-to-br from-primary to-primary/80",
            "border border-primary/50",
            "hover:scale-105 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300",
            "group"
          )}
        >
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
          
          {/* Status indicator */}
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
        </Button>
      </div>

      {/* Clean Chat Window - Solid background, Mobile optimized */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-400 ease-out",
          "bottom-4 right-4 w-[360px] max-w-[calc(100vw-2rem)]",
          "lg:bottom-5 lg:right-5",
          "shadow-2xl shadow-black/30",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
        style={{ height: 'min(520px, calc(100vh - 6rem))' }}
      >
        {/* Main container - FULLY SOLID BACKGROUND */}
        <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden flex flex-col">

          {/* Header */}
          <div className="relative p-3 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    ARIA
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium">AI</span>
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Skill Learners Assistant
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3" style={{ height: 'calc(100% - 130px)' }}>
            <div ref={scrollAreaRef} className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                {message.role === 'assistant' && (
                    <div className="shrink-0">
                      <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted border border-border text-foreground rounded-bl-sm"
                    )}
                  >
                    {message.content}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-muted border border-border rounded-xl rounded-bl-sm px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions */}
              {messages.length === 1 && !isLoading && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-2.5 w-2.5 text-primary" />
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-[11px] px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground/70 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="relative p-3 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask ARIA anything..."
                  disabled={isLoading}
                  className="w-full rounded-lg bg-background border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground pr-3 py-5 text-sm"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-center text-[9px] text-muted-foreground mt-1.5">
              Powered by Skill Learners AI
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
