"use client";

import { cn } from "@/lib/utils";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Reddinbox and how does it work?",
    answer:
      "Reddinbox is an AI-powered Reddit growth platform that helps you build authority and generate leads authentically. We analyze your business to find relevant conversations, generate helpful responses that naturally mention your product, and track your interactions to build lasting relationships. It's the anti-spam approach to Reddit marketing.",
  },
  {
    question: "How does the AI response generation work?",
    answer:
      "Our AI analyzes the context of each Reddit post and your business profile to craft authentic, helpful responses. The AI focuses on providing genuine value first, then naturally weaves in your product when relevant. You always review and approve responses before they're posted, ensuring they match your voice and standards.",
  },
  {
    question: "Will I get banned for using Reddinbox?",
    answer:
      "No - our platform is built with Reddit's rules in mind. We focus on authentic engagement and helpful responses rather than promotional spam. Our AI generates responses that prioritize value-first content, and our compliance features ensure you stay within Reddit's guidelines. A lot of users have grown safely using our platform.",
  },
  {
    question: "How long before I see results?",
    answer:
      "Most users see initial engagement within their first week of authentic participation. Building authority takes 2-4 weeks of consistent, helpful contributions. Lead generation typically starts flowing after 4-6 weeks once you've established credibility in your target communities. Remember, this is about building lasting relationships, not quick wins.",
  },
  {
    question: "Do I need Reddit marketing experience?",
    answer:
      "Not at all! Reddinbox is designed for beginners and experts alike. Our AI handles the heavy lifting of finding relevant posts and crafting appropriate responses. We provide guidance on Reddit etiquette and best practices. If you can have a helpful conversation, you can succeed with Reddinbox.",
  },
  {
    question: "What types of businesses work best with Reddinbox?",
    answer:
      "Reddinbox works exceptionally well for SaaS products, digital tools, courses, agencies, and B2B services. Any business that can provide genuine value through advice, insights, or solutions to common problems will thrive. The key is having expertise to share and a product that naturally fits into helpful conversations.",
  },
  {
    question: "What makes this different from manual Reddit marketing?",
    answer:
      "Manual Reddit marketing is time-consuming, inconsistent, and risky. You spend hours scrolling for relevant posts, crafting responses from scratch, and often forget to follow up. Reddinbox automates discovery, generates authentic responses, tracks all interactions, and reminds you when to follow up - turning Reddit into a systematic growth channel.",
  },
  {
    question: "How do you ensure my responses don't sound like spam?",
    answer:
      "Our AI is trained on thousands of high-quality Reddit interactions that build authority rather than promote products. We prioritize helpful, value-first content and only mention your product when genuinely relevant. Every response is contextual, conversational, and focused on solving the user's problem first. You review everything before it goes live.",
  },
];

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItemComponent({ item, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <button
        className="w-full text-left p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors duration-200 cursor-pointer"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-foreground pr-4 font-heading">
          {item.question}
        </h3>
        <div className="flex-shrink-0">
          {isOpen ? (
            <IconChevronUp className="size-5 text-primary" />
          ) : (
            <IconChevronDown className="size-5 text-muted-foreground" />
          )}
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 border-t border-border/50">
          <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section
      className="py-24 bg-gradient-to-br from-background to-secondary/20"
      id="faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
              FAQ
            </Badge>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-heading max-w-3xl mx-auto">
            Questions About <span className="text-primary">Growing</span> on
            Reddit?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about building authority and generating
            leads through authentic Reddit engagement.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQItemComponent
              key={index}
              item={item}
              isOpen={openItems.has(index)}
              onClick={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
