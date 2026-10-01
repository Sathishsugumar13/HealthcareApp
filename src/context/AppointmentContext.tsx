import React, { createContext, useState, useContext } from 'react';

export interface Appointment {
  id: string;
  patientName: string;
  phone?: string;
  doctorName: string;
  specialization: string;
  date: string;
  image?: any;
  paymentMethod?: string;
  paymentStatus?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'past_1',
    patientName: 'Logged In User',
    doctorName: 'Dr. Sarah Smith',
    specialization: 'Cardiologist',
    date: '10 Aug 2024 at 10:30 AM',
    paymentMethod: 'Paid Online',
    paymentStatus: 'Completed'
  },
  {
    id: 'past_2',
    patientName: 'Logged In User',
    doctorName: 'Dr. Charlie Clark',
    specialization: 'Dentist',
    date: '05 Sep 2024 at 04:00 PM',
    paymentMethod: 'Cash',
    paymentStatus: 'Completed'
  },
  {
    id: 'past_3',
    patientName: 'Logged In User',
    doctorName: 'Dr. John Doe',
    specialization: 'Neurologist',
    date: '15 Oct 2024 at 11:15 AM',
    paymentMethod: 'Paid Online',
    paymentStatus: 'Completed'
  },
  {
    id: 'past_4',
    patientName: 'Logged In User',
    doctorName: 'Dr. Emily White',
    specialization: 'Pediatrician',
    date: '02 Nov 2024 at 09:45 AM',
    paymentMethod: 'UPI',
    paymentStatus: 'Completed'
  },
  {
    id: 'past_5',
    patientName: 'Logged In User',
    doctorName: 'Dr. Robert Brown',
    specialization: 'Orthopedist',
    date: '20 Jan 2025 at 02:30 PM',
    paymentMethod: 'Card',
    paymentStatus: 'Completed'
  }
];

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

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
