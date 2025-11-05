import BuyingSignalsCard from "./BuyingSignalsCard";
import ConversationSummaryCard from "./ConversationSummaryCard";
import PainPointsCard from "./PainPointsCard";

export default function LeadOverview() {
  return (
    <div className="space-y-6">
      <ConversationSummaryCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuyingSignalsCard />
        <PainPointsCard />
      </div>
    </div>
  );
}
