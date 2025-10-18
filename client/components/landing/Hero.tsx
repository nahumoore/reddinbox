import { IconArrowRight, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { IconBrandRedditNew } from "../icons/BrandRedditNew";
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
];

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* HERO */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-3xl mx-auto font-bold text-foreground mb-6 font-heading leading-tight">
          Your customers are on{" "}
          <div className="inline-block">
            <div className="text-primary flex items-center gap-2">
              <IconBrandRedditNew className="size-8 md:size-12 lg:size-16 -rotate-6" />
              Reddit...
            </div>
          </div>
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl text-red-600 underline">
            but they don&apos;t know you!
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the right conversations, provide real value, and let your ideal
          customers come to you with <b>authentic replies!</b>
        </p>

        <div className="flex flex-col gap-6 justify-center items-center mb-16">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 shadow-lg hover:scale-105 hover:shadow-lg transition-all hover:shadow-primary/20 cursor-pointer uppercase flex items-center gap-2"
          >
            Start Growing
            <IconArrowRight className="size-6" />
          </Link>
          <div className="flex items-center gap-4">
            <AvatarCircles
              numPeople={99}
              className="w-full sm:w-auto"
              avatars={avatars}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((item, index) => (
                  <IconStar
                    key={index}
                    className="size-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                3,000+ Redditors Helped
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ILLUSTRATION */}
      <HeroIllustration />
    </section>
  );
}
