import React from 'react';
import SectionHeader from '../../Common/SectionHeader/SectionHeader';
import PharmacyCard from '../../Common/PharmacyCard/PharmacyCard';

interface MedicineReminderSectionProps {
  onSeeAll: () => void;
}

export default function MedicineReminderSection({ onSeeAll }: MedicineReminderSectionProps) {
  return (
    <>
      <SectionHeader title="Medicine Reminder" onSeeAll={onSeeAll} />
      <PharmacyCard 
        medicine="Paracetamol" 
        dosage="500 mg" 
        time="08:00 PM" 
        status="Taken" 
      />
    </>
  );
}
