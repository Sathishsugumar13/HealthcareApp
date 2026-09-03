import React from 'react';
import SectionHeader from '../../Common/SectionHeader/SectionHeader';
import DailyHealthTipCard from '../DailyHealthTipCard/DailyHealthTipCard';

interface DailyHealthTipSectionProps {
  onSeeAll: () => void;
}

export default function DailyHealthTipSection({ onSeeAll }: DailyHealthTipSectionProps) {
  return (
    <>
      <SectionHeader title="Daily Health Tip" onSeeAll={onSeeAll} />
      <DailyHealthTipCard 
        tip="Drink enough water and stay hydrated every day." 
        containerStyle={{ marginBottom: 24 }} 
      />
    </>
  );
}
