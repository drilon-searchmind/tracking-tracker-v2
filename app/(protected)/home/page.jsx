import HeroSection from "@/app/components/UI/HeroSection";
import FeaturesSection from "@/app/components/UI/FeaturesSection";
import HomePageFlowChart from "@/app/components/UI/HomePageFlowChart";
import NewsSection from "@/app/components/UI/NewsSection";
import FAQSection from "@/app/components/UI/FAQSection";
import CTASection from "@/app/components/UI/CTASection";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* News & Updates Section */}
            <NewsSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* CTA Section */}
            <CTASection />
        </div>
    )
}