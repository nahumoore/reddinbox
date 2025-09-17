import { IconBrandReddit } from "@tabler/icons-react";
import Link from "next/link";
import { AvatarCircles } from "../ui/avatar-circles";
import HeroIllustration from "./HeroIllustration";

const avatars = [
  {
    imageUrl: "/landing/user_1.webp",
  },
  {
    imageUrl: "/landing/user_3.webp",
  },
  {
    imageUrl: "/landing/user_7.jpg",
  },
  {
    imageUrl: "/landing/user_8.jpg",
  },
  {
    imageUrl: "/landing/user_10.jpg",
  },
];

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Coming Soon
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-2xl mx-auto font-bold text-foreground mb-6 font-heading leading-tight">
          Stop Losing more{" "}
          <span className="bg-gradient-to-r from-primary to-primary/80 rounded-md px-2 shadow-md text-white flex items-center gap-2 w-fit mx-auto">
            <IconBrandReddit className="size-16 -rotate-2" />
            Reddit Leads
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover leads, engage, and convert them into customers. A Reddit CRM
          designed specifically for SaaS products!
        </p>

        <div className="flex flex-col gap-4 justify-center items-center mb-16">
          <Link
            href="/whitelist"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 shadow-lg hover:scale-105 hover:shadow-lg transition-all hover:shadow-primary/20 cursor-pointer"
          >
            Join the Waitlist
          </Link>
          <AvatarCircles
            numPeople={120}
            className="w-full sm:w-auto"
            avatars={avatars}
          />
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
