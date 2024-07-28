import PricingCard from '@/components/pricingcard';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <div className="flex flex-col items-center mt-12">
      <Navbar />
      <h1 className="mt-8 text-4xl font-bold text-center text-gray-900 dark:text-white">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <PricingCard
        title="Basic Plan"
        description="Basic features for personal use"
        price="0"
        includedItems={["Access to one icebreaker", "Free trial", "One room max"]}
        notIncludedItems={["More than 8 players", "20 rooms a month", "Save your icebreakers"]}
      />
      <PricingCard
        title="Pro Plan"
        description="Advanced features for businesses"
        price="49"
        includedItems={["More than 8 players", "Create more than 30 rooms", "Special icebreakers", "Save your icebreakers"]}
        notIncludedItems={["Room with 100+ players", "Ultra features"]}
      />
      <PricingCard
        title="Enterprise Plan"
        description="Custom features for large businesses"
        price="99"
        includedItems={["Unlimited players", "Unlimited rooms", "Custom icebreakers", "Priority support", "Analytics and reporting"]}
        notIncludedItems={["Dedicated account manager"]}
      />
      </div>
      <Footer />
    </div>
  );
}