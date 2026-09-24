import React from 'react';
import HomeComponent from '../../components/HomeComponent/HomeComponent';

export default function HomeScreen(props: any) {
  // All the state and logic has been moved to HomeComponent
  // as per the requirement to make it a single reusable component
  return (
    <HomeComponent user={props.user} onLogout={props.onLogout} />
  );
}
