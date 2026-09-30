import { images } from '../assets/images';

export const SERVICES = [
  { title: 'Doctor', icon: 'stethoscope' },
  { title: 'Pharmacy', icon: 'pill' },
  { title: 'Hospital', icon: 'hospital-building' },
  { title: 'Appointments', icon: 'calendar-check' },
];

export const ARTICLES = [
  { title: 'Healthy Diet', date: 'Jun 10, 2023', read: '5min read', imageSource: images.articles.articleDiet },
  { title: 'Exercise Tips', date: 'Jul 10, 2023', read: '5min read', imageSource: images.articles.articleExercise },
];

export const HOSPITALS = [
  { name: 'City Hospital', location: 'Salem', distance: '2.5 km', rating: '4.5', status: 'Open', imageSource: images.hospitals.hospitalCity },
  { name: 'SKS Hospital', location: 'Salem', distance: '3.2 km', rating: '4.3', status: 'Open', imageSource: images.hospitals.hospitalSks },
];
