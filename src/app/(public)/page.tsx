import { Categories } from "@/components/landing/categories";
import { FeaturedCampaigns } from "@/components/landing/featured-campaigns";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyChooseUs } from "@/components/landing/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCampaigns />
      <HowItWorks />
      <Categories />
      <WhyChooseUs />
      <Footer />
    </>
  );
}
