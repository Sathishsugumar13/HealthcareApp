import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionHeader from '../../Common/SectionHeader/SectionHeader';
import HospitalCard from '../../Common/HospitalCard/HospitalCard';

interface NearbyHospitalsSectionProps {
  onSeeAll: () => void;
  hospitals: Array<any>;
  searchText: string;
}

export default function NearbyHospitalsSection({ onSeeAll, hospitals, searchText }: NearbyHospitalsSectionProps) {
  // Filter the hospitals based on the search text
  const filteredHospitals = hospitals.filter((hospital) => {
    return hospital.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <SectionHeader title="Nearby Hospitals" onSeeAll={onSeeAll} />
      <View style={styles.hospitalsContainer}>
        {filteredHospitals.map((hospital, index) => (
          <HospitalCard 
            key={index} 
            name={hospital.name}
            location={hospital.location}
            distance={hospital.distance}
            rating={hospital.rating}
            status={hospital.status}
            imageSource={hospital.imageSource}
          />
        ))}
        
        {/* Show a message if no hospitals are found */}
        {filteredHospitals.length === 0 && (
           <Text style={styles.listEmptyText}>No hospitals found.</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hospitalsContainer: {
    flexDirection: 'column',
    paddingBottom: 20,
  },
  listEmptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  }
});
