import React from 'react';
import { PricingSection } from '@/components/pricing-section';

export function PricingPage() {
  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <PricingSection />
      </div>
    </div>
  );
}

export default PricingPage;