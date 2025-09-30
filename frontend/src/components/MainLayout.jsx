import React from 'react';
import FeaturedPostCard from './FeaturedPostCard';
import CombinedTopicsSection from './CombinedTopicsSection';
import ProceduresVideoSection from './ProceduresVideoSection';
import TextBlock from './TextBlock';
import NewsletterBadge from './NewsletterBadge';
import MostClicked from './MostClicked';
import PromoBlock from './PromoBlock';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        
        {/* Seção principal - FeaturedPostCard com layout próprio */}
        <section className="mb-8">
          <FeaturedPostCard />
        </section>
        {/* Seções de largura completa */}
        <CombinedTopicsSection />
        <ProceduresVideoSection />
      </main>
    </div>
  );
};

export default MainLayout;
