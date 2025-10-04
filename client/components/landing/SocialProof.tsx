"use client";

import { IconSparkles } from "@tabler/icons-react";
import AZMedia from "./trusted/azmedia";
import Creately from "./trusted/creately";
import DesignHill from "./trusted/designhill";
import G2G from "./trusted/g2g";
import Legit from "./trusted/legit";
import Metrobi from "./trusted/metrobi";
import SantaMonica from "./trusted/santa-monica";

export default function SocialProof() {
  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-6">
        <div className="space-y-6 md:space-y-12">
          <h3 className="text-2xl font-bold text-center text-muted-foreground">
            Trusted by top startups{" "}
            <IconSparkles className="inline-block size-6 -rotate-2 fill-muted-foreground" />
          </h3>
          <div className="space-y-8 md:space-y-12">
            {/* Top row - 4 icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <AZMedia className="w-40 h-12 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
              <Creately className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
              <DesignHill className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
              <SantaMonica className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
            </div>

            {/* Bottom row - 3 icons centered */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center max-w-3xl">
                <Legit className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
                <Metrobi className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
                <G2G className="w-44 h-7 object-cover grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
