import React from 'react';
import { View } from 'react-native';
import SectionHeader from '../../Common/SectionHeader/SectionHeader';
import AppointmentCard from '../../Common/AppointmentCard/AppointmentCard';

interface UpcomingAppointmentSectionProps {
  onSeeAll: () => void;
}

export default function UpcomingAppointmentSection({ onSeeAll }: UpcomingAppointmentSectionProps) {
  return (
    <>
      <SectionHeader title="Upcoming Appointment" onSeeAll={onSeeAll} />
      <AppointmentCard
        doctorName="Dr. Arun"
        specialization="Cardiologist"
        date="03 Sep"
        time="10:30 AM"
        status="Upcoming"
        imageSource={require('../../../assets/images/dr_arun.jpg')}
        containerStyle={{ marginBottom: 24 }}
      />
    </>
  );
}
