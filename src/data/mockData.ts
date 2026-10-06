import { images } from '../assets/images';
export interface PharmacyData {
  id: string;
  name: string;
  address: string;
  rating: string;
  distance: string;
  image: any;
  availableTablets: string[];
  phone?: string;
}

export const SPECIALIZATIONS = [
  { id: 'sp1', name: 'Cardiologist' },
  { id: 'sp2', name: 'Dentist' },
  { id: 'sp3', name: 'Neurologist' },
  { id: 'sp4', name: 'Orthopedist' },
  { id: 'sp5', name: 'Pediatrician' },
];

export const DOCTORS = [
  
  { id: 'd1', name: 'Dr. John Doe', spId: 'sp1', phone: '+91 9876543201' },
  { id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp1', phone: '+91 9876543202' },
  { id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp1', phone: '+91 9876543203' },
  
  { id: 'd6', name: 'Dr. Alice Brown', spId: 'sp2', phone: '+91 9876543206' },
  { id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2', phone: '+91 9876543207' },
  { id: 'd8', name: 'Dr. Emily Rose', spId: 'sp2', phone: '+91 9876543208' },
  
  { id: 'd11', name: 'Dr. Peter Parker', spId: 'sp3', phone: '+91 9876543211' },
  { id: 'd11_2', name: 'Dr. Stephen Strange', spId: 'sp3', phone: '+91 9876543212' },
  { id: 'd11_3', name: 'Dr. Charles Xavier', spId: 'sp3', phone: '+91 9876543213' },
  
  { id: 'd12', name: 'Dr. Bruce Wayne', spId: 'sp4', phone: '+91 9876543221' },
  { id: 'd12_2', name: 'Dr. Steve Rogers', spId: 'sp4', phone: '+91 9876543222' },
  { id: 'd12_3', name: 'Dr. Tony Stark', spId: 'sp4', phone: '+91 9876543223' },
  
  { id: 'd13', name: 'Dr. Clark Kent', spId: 'sp5', phone: '+91 9876543231' },
  { id: 'd13_2', name: 'Dr. Diana Prince', spId: 'sp5', phone: '+91 9876543232' },
  { id: 'd13_3', name: 'Dr. Barry Allen', spId: 'sp5', phone: '+91 9876543233' },
];

export const STATES = [
  { id: 's1', name: 'Tamil Nadu' },
  { id: 's2', name: 'Kerala' },
  { id: 's3', name: 'Karnataka' },
];

export const DISTRICTS = [
  { id: 'dt1', name: 'Salem', stateId: 's1' },
  { id: 'dt2', name: 'Chennai', stateId: 's1' },
  { id: 'dt3', name: 'Coimbatore', stateId: 's1' },
  { id: 'dt4', name: 'Kochi', stateId: 's2' },
  { id: 'dt5', name: 'Bangalore', stateId: 's3' },
];

export const HOSPITALS = [
  { id: 'h1', name: 'City Hospital', districtId: 'dt1', doctors: [{ id: 'd1', name: 'Dr. John Doe', spId: 'sp1', specialization: 'Cardiologist', phone: '+91 9876543201' }, { id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp2', specialization: 'Dentist', phone: '+91 9876543202' }] },
  { id: 'h2', name: 'SKS Hospital', districtId: 'dt1', doctors: [{ id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp3', specialization: 'Neurologist', phone: '+91 9876543203' }, { id: 'd4', name: 'Dr. Emily Rose', spId: 'sp4', specialization: 'Orthopedist', phone: '+91 9876543204' }] },
  { id: 'h3', name: 'Apollo Main', districtId: 'dt2', doctors: [{ id: 'd5', name: 'Dr. Mark Ruffalo', spId: 'sp5', specialization: 'Pediatrician', phone: '+91 9876543205' }] },
  { id: 'h4', name: 'PSG Hospitals', districtId: 'dt3', doctors: [{ id: 'd8', name: 'Dr. Peter Parker', spId: 'sp3', specialization: 'Neurologist', phone: '+91 9876543208' }] },
  { id: 'h5', name: 'Aster Medcity', districtId: 'dt4', doctors: [{ id: 'd9', name: 'Dr. Bruce Wayne', spId: 'sp4', specialization: 'Orthopedist', phone: '+91 9876543209' }, { id: 'd10', name: 'Dr. Clark Kent', spId: 'sp5', specialization: 'Pediatrician', phone: '+91 9876543210' }] },
  { id: 'h6', name: 'Fortis Hospital', districtId: 'dt5', doctors: [{ id: 'd6', name: 'Dr. Alice Brown', spId: 'sp1', specialization: 'Cardiologist', phone: '+91 9876543206' }, { id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2', specialization: 'Dentist', phone: '+91 9876543207' }] },
];

export const MOCK_PHARMACIES = [
  { 
    id: 'p1', name: 'Apollo Pharmacy', address: '123 Main Street, Salem', rating: '4.8', distance: '1.2 km', 
    image: images.hospitals.hospitalCity,
    availableTablets: ['Paracetamol', 'Dolo 650', 'Amoxicillin', 'Cetirizine', 'Azithromycin'], phone: '+91 9876543201'
  },
  { 
    id: 'p2', name: 'MedPlus', address: '45 Second Avenue, Salem', rating: '4.5', distance: '2.5 km', 
    image: images.hospitals.hospitalSks,
    availableTablets: ['Crocin', 'Aspirin', 'Vitamin C', 'Zincovit', 'Pantoprazole'], phone: '+91 9876543202'
  },
  { 
    id: 'p3', name: 'Netmeds Pharmacy', address: '78 Third Street, Salem', rating: '4.7', distance: '3.0 km', 
    image: images.hospitals.hospitalCity,
    availableTablets: ['Ibuprofen', 'Metformin', 'Amlodipine', 'Omeprazole', 'Atorvastatin'], phone: '+91 9876543203'
  },
  { 
    id: 'p4', name: 'Wellness Forever', address: '90 Fourth Cross, Salem', rating: '4.9', distance: '4.1 km', 
    image: images.hospitals.hospitalSks,
    availableTablets: ['Diclofenac', 'Tramadol', 'Ambroxol', 'B-Complex', 'Liv52'], phone: '+91 9876543204'
  },
  { 
    id: 'p5', name: 'Thulasi Pharmacies', address: '112 Fifth Avenue, Salem', rating: '4.6', distance: '1.8 km', 
    image: images.hospitals.hospitalCity,
    availableTablets: ['Azel', 'Augmentin', 'Allegra', 'Becosules', 'Crocine'], phone: '+91 9876543205'
  },
  { 
    id: 'p6', name: 'Sanjivani Pharmacy', address: '33 Sixth Main Road, Salem', rating: '4.4', distance: '5.5 km', 
    image: images.hospitals.hospitalSks,
    availableTablets: ['Montair LC', 'Zifi 200', 'Shelcal 500', 'Pan D', 'Thyronorm'], phone: '+91 9876543206'
  },
];

