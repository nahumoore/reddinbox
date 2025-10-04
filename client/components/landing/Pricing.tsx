"use client";

import TestimonialUser from "@/public/landing/user_1.webp";
import TestimonialUser2 from "@/public/landing/user_2.webp";
import TestimonialUser4 from "@/public/landing/user_4.webp";
import TestimonialUser5 from "@/public/landing/user_5.webp";
import TestimonialUser7 from "@/public/landing/user_7.jpg";
import TestimonialUser8 from "@/public/landing/user_8.jpg";
import TestimonialUser9 from "@/public/landing/user_9.jpg";
import { IconStar } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PricingPlans from "../pricing/PricingPlans";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Marquee } from "../ui/marquee";

export default function Pricing() {
  const router = useRouter();

  const handleUpgrade = async () => {
    router.push("/auth/register");
  };

  const testimonials = [
    {
      name: "Lorenzo",
      content:
        "Being honest I wasn't expecting this tool was going to provide me too much value for my saas but it did it, 2 new leads the first day, wow!",
      image: TestimonialUser,
    },
    {
      name: "Mike",
      content:
        "Manual reddit is good for lead generation but this tool makes the process 100x better",
      image: TestimonialUser2,
    },
    {
      name: "David",
      content:
        "Love how well posts and comments are organized compared to Reddit for getting b2b leads, big win guys!",
      image: TestimonialUser8,
    },
    {
      name: "Jessica",
      content:
        "Results so far are great. I'd love to have an option to personalize even more the comments generated",
      image: TestimonialUser4,
    },
    {
      name: "Kai",
      content:
        "Sometimes I just need to do quick fixes but in general generated comments are really goood!",
      image: TestimonialUser5,
    },
    {
      name: "Alex",
      content:
        "I've been getting consistent leads without feeling spammy, exactly what I needed",
      image: TestimonialUser9,
    },
    {
      name: "Gustavo",
      content:
        "Tried so many Reddit tools before this one and they all felt off. This actually feels",
      image: TestimonialUser7,
    },
  ];

  return (
    <section className="py-24" id="pricing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-sm">
              Pricing
            </Badge>
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">
            Build Reddit Authority on
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {" "}
              Auto-Pilot
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reddinbox helps you build genuine authority and generate quality
            leads through authentic Reddit community engagement.
          </p>
        </div>

        <PricingPlans
          ctaLabel="Get Started for Free"
          onCtaClick={handleUpgrade}
        />
      </div>

      <div className="mt-24 relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <Marquee className="[--duration:40s]">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="w-[350px] bg-card/50 backdrop-blur">
              <CardContent className="space-y-2">
                <div className="flex items-start gap-4 mb-2">
                  <Image
                    src={testimonial.image}
                    width={48}
                    height={48}
                    alt={testimonial.name}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((item, index) => (
                        <IconStar
                          key={index}
                          className="size-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <em className="text-muted-foreground">{testimonial.content}</em>
              </CardContent>
            </Card>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
