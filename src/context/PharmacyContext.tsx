import React, { createContext, useState, useContext } from 'react';

export interface PharmacyOrder {
  id: string;
  pharmacyName: string;
  message: string;
  date: string;
  image?: any;
  patientName?: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  
  // Billing details
  items?: { name: string; price: number }[];
  subtotal?: number;
  gst?: number;
  deliveryCharge?: number;
  totalAmount?: number;
}

interface PharmacyContextType {
  orders: PharmacyOrder[];
  addOrder: (order: PharmacyOrder) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);

  const addOrder = (order: PharmacyOrder) => {
    setOrders(prev => [order, ...prev]);
  };

  return (
    <PharmacyContext.Provider value={{ orders, addOrder }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
