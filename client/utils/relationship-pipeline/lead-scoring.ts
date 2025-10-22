import { RedditUserInteraction } from "@/types/db-schema";

export type LeadTemperature = "hot" | "warm" | "cooling" | "cold" | "dormant";

export interface LeadScore {
  temperature: LeadTemperature;
  temperatureScore: number;
  daysSinceLastInteraction: number;
  totalInteractions: number;
  compositeScore: number;
}

/**
 * Calculate lead temperature based on days since last interaction
 */
export function calculateLeadTemperature(
  daysSinceLastInteraction: number
): { temperature: LeadTemperature; score: number } {
  if (daysSinceLastInteraction <= 3) {
    return { temperature: "hot", score: 100 };
  } else if (daysSinceLastInteraction <= 7) {
    return { temperature: "warm", score: 75 };
  } else if (daysSinceLastInteraction <= 14) {
    return { temperature: "cooling", score: 50 };
  } else if (daysSinceLastInteraction <= 30) {
    return { temperature: "cold", score: 25 };
  } else {
    return { temperature: "dormant", score: 10 };
  }
}

/**
 * Calculate comprehensive lead score for a user based on their interactions
 */
export function calculateLeadScore(
  interactions: RedditUserInteraction[]
): LeadScore {
  if (interactions.length === 0) {
    return {
      temperature: "dormant",
      temperatureScore: 0,
      daysSinceLastInteraction: Infinity,
      totalInteractions: 0,
      compositeScore: 0,
    };
  }

  // Find most recent interaction
  const mostRecentInteraction = interactions.reduce((latest, current) => {
    const currentDate = new Date(current.created_at || 0);
    const latestDate = new Date(latest.created_at || 0);
    return currentDate > latestDate ? current : latest;
  });

  const daysSinceLastInteraction = Math.floor(
    (Date.now() - new Date(mostRecentInteraction.created_at || 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const { temperature, score: temperatureScore } = calculateLeadTemperature(
    daysSinceLastInteraction
  );

  const totalInteractions = interactions.length;

  // Composite score: 70% temperature (recency), 30% interaction count
  // Normalize interaction count (diminishing returns after 10 interactions)
  const interactionScore = Math.min(totalInteractions * 10, 100);
  const compositeScore =
    temperatureScore * 0.7 + interactionScore * 0.3;

  return {
    temperature,
    temperatureScore,
    daysSinceLastInteraction,
    totalInteractions,
    compositeScore,
  };
}

/**
 * Get temperature display configuration
 */
export function getTemperatureConfig(temperature: LeadTemperature): {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (temperature) {
    case "hot":
      return {
        label: "Hot Lead",
        emoji: "🔥",
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    case "warm":
      return {
        label: "Warm Lead",
        emoji: "☀️",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    case "cooling":
      return {
        label: "Cooling",
        emoji: "🌤️",
        color: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    case "cold":
      return {
        label: "Cold",
        emoji: "❄️",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    case "dormant":
      return {
        label: "Dormant",
        emoji: "💤",
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
}
