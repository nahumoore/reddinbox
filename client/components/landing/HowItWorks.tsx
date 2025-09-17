"use client";
import {
  IconCheck,
  IconFlame,
  IconMessageX,
  IconTrendingDown,
  IconX,
} from "@tabler/icons-react";

export default function HowItWorks() {
  return (
    <section
      className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <IconMessageX className="h-12 w-12 text-red-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900 font-heading">
              The Cold DM Death Trap
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
            Why 97% of Reddit DMs Get Ignored (And How to Be in the 3%)
          </p>
        </div>

        {/* Main Content - 2 Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - The Problem */}
          <div className="flex flex-col">
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-heading">
              <IconTrendingDown className="h-8 w-8 text-red-500 mr-3" />
              What Everyone Does
            </h3>

            {/* Quote Block */}
            <div className="mb-6 p-4 border-l-4 border-red-500 bg-gray-50">
              <p className="text-gray-700 italic text-lg font-body">
                Hey, I saw your post about needing a developer. Check out my
                agency...
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-6 font-body">
              <strong>Sound familiar?</strong> That&apos;s what every
              founder&apos;s Reddit inbox looks like.
              <span className="font-semibold text-red-600">
                {" "}
                500+ identical cold pitches
              </span>{" "}
              fighting for 30 seconds of attention.
            </p>

            {/* List */}
            <div className="flex-1 space-y-3">
              <h4 className="font-semibold text-gray-900 text-lg mb-4 font-heading">
                Here&apos;s what happens to cold DMs:
              </h4>
              <div className="flex items-center">
                <IconX className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>87% never get opened</strong> (Reddit shows sender
                  preview)
                </span>
              </div>
              <div className="flex items-center">
                <IconX className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>11% get opened, immediately deleted</strong>
                </span>
              </div>
              <div className="flex items-center">
                <IconX className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>2% get a polite not interested</strong>
                </span>
              </div>
              <div className="flex items-center">
                <IconX className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>0% turn into customers</strong>
                </span>
              </div>
            </div>

            {/* Result */}
            <div className="mt-8 text-center py-8">
              <div className="text-6xl font-bold text-red-500 mb-2 font-heading">
                3%
              </div>
              <div className="text-gray-700 font-medium font-body">
                Success Rate for cold Reddit DMs
              </div>
            </div>
          </div>

          {/* Right Column - The Solution */}
          <div className="flex flex-col">
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center font-heading">
              <IconFlame className="h-8 w-8 text-primary mr-3 fill-primary" />
              The Warm Engagement Advantage
            </h3>

            {/* Quote Block */}
            <div className="mb-6 p-4 border-l-4 border-green-500 bg-green-50">
              <p className="text-gray-700 italic text-lg font-body">
                Oh hey, you&apos;re the person who gave that helpful advice on
                my SaaS metrics post last week!
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-6 font-body">
              <strong>What if instead, they recognized your name?</strong>
            </p>

            <p className="text-lg text-gray-700 mb-6 font-body">
              When you warm up leads through genuine engagement:
            </p>

            {/* List */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center">
                <IconCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>73% response rate</strong> vs 3% for cold outreach
                </span>
              </div>
              <div className="flex items-center">
                <IconCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>5x higher conversion</strong> to actual conversations
                </span>
              </div>
              <div className="flex items-center">
                <IconCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>Zero spam reports</strong> (they actually want to hear
                  from you)
                </span>
              </div>
              <div className="flex items-center">
                <IconCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-body">
                  <strong>Builds real relationships</strong>, not just
                  transactions
                </span>
              </div>
            </div>

            {/* Result */}
            <div className="mt-8 text-center py-8">
              <div className="text-6xl font-bold text-green-500 mb-2 font-heading">
                73%
              </div>
              <div className="text-gray-700 font-medium font-body">
                Response Rate with warm engagement
              </div>
            </div>
          </div>
        </div>

        {/* Combined CTA Section - Enhanced Display */}
        <p className="text-2xl text-gray-800 font-body leading-relaxed max-w-4xl mx-auto mt-12 text-center">
          <strong className="text-red-600 bg-red-50 px-2 py-1 rounded-lg">
            Reddit users HATE being sold to.
          </strong>
          <br />
          But they{" "}
          <strong className="text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            love people who contribute
          </strong>{" "}
          to their communities.
        </p>
      </div>
    </section>
  );
}
