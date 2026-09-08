import React from 'react';

import PharmacyCard from '../../Common/PharmacyCard/PharmacyCard';
import ArticleCard from '../../Common/ArticleCard/ArticleCard';
import HospitalCard from '../../Common/HospitalCard/HospitalCard';
import AppointmentCard from '../../Common/AppointmentCard/AppointmentCard';
import DailyHealthTipCard from '../DailyHealthTipCard/DailyHealthTipCard';

interface Props {
  title: string;
  articles: any[];
  hospitals: any[];
}

export default function SeeAllContentRenderer({ title, articles, hospitals }: Props) {
  if (title === 'Health article') {
    const allArticles = [
      ...articles,
      { title: 'Importance of Sleep', date: 'Aug 05, 2023', read: '4min read', imageSource: require('../../../assets/images/article_sleep.jpg') },
      { title: 'Mental Health Matters', date: 'Sep 01, 2023', read: '6min read', imageSource: require('../../../assets/images/article_mental.jpg') },
    ];
    
    return allArticles.map((article, index) => (
      <ArticleCard key={index} title={article.title} date={article.date} read={article.read} imageSource={article.imageSource} />
    ));
  }
  
  if (title === 'Nearby Hospitals') {
    const allHospitals = [
      ...hospitals,
      { name: 'Kurunji Hospital', location: 'Salem', distance: '4.1 km', rating: '4.4', status: 'Open', imageSource: require('../../../assets/images/hospital_kurunji.jpg') },
      { name: 'Manipal Hospital', location: 'Salem', distance: '5.8 km', rating: '4.7', status: 'Open', imageSource: require('../../../assets/images/hospital_manipal.jpg') }
    ];
    
    return allHospitals.map((hospital, index) => (
      <HospitalCard key={index} name={hospital.name} location={hospital.location} distance={hospital.distance} rating={hospital.rating} status={hospital.status} imageSource={hospital.imageSource} />
    ));
  }

  if (title === 'Upcoming Appointment') {
    return (
      <>
        <AppointmentCard
          doctorName="Dr. Arun"
          specialization="Cardiologist"
          date="03 Sep"
          time="10:30 AM"
          status="Upcoming"
          imageSource={require('../../../assets/images/dr_arun.jpg')}
          containerStyle={{ marginBottom: 16 }}
        />
        <AppointmentCard
          doctorName="Dr. Priya"
          specialization="Dentist"
          date="05 Sep"
          time="02:15 PM"
          status="Confirmed"
          imageSource={require('../../../assets/images/dr_priya.jpg')}
          containerStyle={{ marginBottom: 16 }}
        />
        <AppointmentCard
          doctorName="Dr. Kumar"
          specialization="Neurologist"
          date="12 Sep"
          time="04:00 PM"
          status="Upcoming"
          imageSource={require('../../../assets/images/dr_kumar.jpg')}
          containerStyle={{ marginBottom: 16 }}
        />
      </>
    );
  }

  if (title === 'Medicine Reminder') {
    return (
      <>
        <PharmacyCard medicine="Paracetamol" dosage="500 mg" time="08:00 PM" status="Taken" />
        <PharmacyCard medicine="Vitamin C" dosage="1 Tablet" time="09:00 AM" status="Pending" />
      </>
    );
  }

  if (title === 'Daily Health Tip') {
    return (
      <>
        <DailyHealthTipCard 
          tip="Drink enough water and stay hydrated every day." 
          containerStyle={{ marginBottom: 10 }}
        />
        <DailyHealthTipCard 
          tip="Walk for at least 30 minutes to stay active." 
        />
      </>
    );
  }

  return null;
}
