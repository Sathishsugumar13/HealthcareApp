import React, { createContext, useState, useContext } from 'react';

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  image?: any;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
