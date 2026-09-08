import React from 'react';
import { View, StyleSheet } from 'react-native';
import ServiceCard from '../ServiceCard/ServiceCard';

interface ServiceItem {
  title: string;
  icon: string;
}

interface Props {
  services: ServiceItem[];
}

export default function HomeServicesContainer({ services }: Props) {
  return (
    <View style={styles.servicesContainer}>
      {services.map((service, index) => (
        <ServiceCard key={index} title={service.title} icon={service.icon} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  }
});
