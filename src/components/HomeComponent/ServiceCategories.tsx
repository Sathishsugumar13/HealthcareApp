import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ServiceCategoriesProps {
  SERVICES: any[];
  handleServicePress: (service: any) => void;
}

export default function ServiceCategories({ SERVICES, handleServicePress }: ServiceCategoriesProps) {
  return (
    <View style={styles.servicesContainer}>
      {SERVICES.map((service, index) => (
        <Pressable key={index} style={styles.serviceCardContainer} onPress={() => handleServicePress(service)}>
          <View style={styles.serviceIconContainer}>
            <MaterialCommunityIcons name={service.icon} size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.serviceTitle} numberOfLines={1} adjustsFontSizeToFit>{service.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  serviceCardContainer: {
    alignItems: 'center',
    width: 80,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3C72F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#3C72F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
});
