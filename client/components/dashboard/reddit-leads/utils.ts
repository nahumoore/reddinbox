export const getStatusConfig = (
  status: string
): {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
  color: string;
} => {
  switch (status) {
    case "new":
      return { variant: "default", label: "New", color: "bg-blue-500" };
    case "contacted":
      return {
        variant: "secondary",
        label: "Contacted",
        color: "bg-purple-500",
      };
    case "responded":
      return { variant: "default", label: "Responded", color: "bg-green-500" };
    case "converted":
      return {
        variant: "default",
        label: "Converted",
        color: "bg-emerald-600",
      };
    case "not_interested":
      return {
        variant: "outline",
        label: "Not Interested",
        color: "bg-gray-400",
      };
    case "unqualified":
      return {
        variant: "destructive",
        label: "Unqualified",
        color: "bg-red-500",
      };
    default:
      return { variant: "outline", label: status, color: "bg-gray-500" };
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "bg-gradient-to-r from-yellow-500 to-orange-500";
  if (score >= 60) return "bg-gradient-to-r from-blue-500 to-cyan-600";
  return "bg-gradient-to-r from-gray-400 to-gray-500";
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return "Hot Lead";
  if (score >= 60) return "Warm Lead";
  return "Cold Lead";
};
