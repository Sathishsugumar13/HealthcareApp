const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'HomeComponent', 'doctorsList', 'doctorsList.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/export interface Doctor {/g, "export interface Doctor {\n  phone?: string;");
content = content.replace(/{ id: 'd1', name: 'Dr. John Doe', specialization: 'Cardiologist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor2 }/g, "{ id: 'd1', name: 'Dr. John Doe', specialization: 'Cardiologist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor2, phone: '+91 9876543201' }");
content = content.replace(/{ id: 'd2', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor1 }/g, "{ id: 'd2', name: 'Dr. Sarah Smith', specialization: 'Cardiologist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor1, phone: '+91 9876543202' }");
content = content.replace(/{ id: 'd3', name: 'Dr. Mike Johnson', specialization: 'Cardiologist', rating: '4.7', experience: '8 Years', image: images.doctors.doctor4b }/g, "{ id: 'd3', name: 'Dr. Mike Johnson', specialization: 'Cardiologist', rating: '4.7', experience: '8 Years', image: images.doctors.doctor4b, phone: '+91 9876543203' }");

content = content.replace(/{ id: 'd6', name: 'Dr. Alice Brown', specialization: 'Dentist', rating: '4.5', experience: '5 Years', image: images.doctors.doctor3 }/g, "{ id: 'd6', name: 'Dr. Alice Brown', specialization: 'Dentist', rating: '4.5', experience: '5 Years', image: images.doctors.doctor3, phone: '+91 9876543206' }");
content = content.replace(/{ id: 'd7', name: 'Dr. Charlie Clark', specialization: 'Dentist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor6b }/g, "{ id: 'd7', name: 'Dr. Charlie Clark', specialization: 'Dentist', rating: '4.8', experience: '12 Years', image: images.doctors.doctor6b, phone: '+91 9876543207' }");
content = content.replace(/{ id: 'd8', name: 'Dr. Emily Rose', specialization: 'Dentist', rating: '4.6', experience: '7 Years', image: images.doctors.doctor5 }/g, "{ id: 'd8', name: 'Dr. Emily Rose', specialization: 'Dentist', rating: '4.6', experience: '7 Years', image: images.doctors.doctor5, phone: '+91 9876543208' }");

content = content.replace(/{ id: 'd11', name: 'Dr. Peter Parker', specialization: 'Neurologist', rating: '4.9', experience: '9 Years', image: images.doctors.doctor8 }/g, "{ id: 'd11', name: 'Dr. Peter Parker', specialization: 'Neurologist', rating: '4.9', experience: '9 Years', image: images.doctors.doctor8, phone: '+91 9876543211' }");
content = content.replace(/{ id: 'd11_2', name: 'Dr. Stephen Strange', specialization: 'Neurologist', rating: '4.8', experience: '11 Years', image: images.doctors.doctor9 }/g, "{ id: 'd11_2', name: 'Dr. Stephen Strange', specialization: 'Neurologist', rating: '4.8', experience: '11 Years', image: images.doctors.doctor9, phone: '+91 9876543212' }");
content = content.replace(/{ id: 'd11_3', name: 'Dr. Charles Xavier', specialization: 'Neurologist', rating: '5.0', experience: '20 Years', image: images.doctors.doctor10b }/g, "{ id: 'd11_3', name: 'Dr. Charles Xavier', specialization: 'Neurologist', rating: '5.0', experience: '20 Years', image: images.doctors.doctor10b, phone: '+91 9876543213' }");

content = content.replace(/{ id: 'd12', name: 'Dr. Bruce Wayne', specialization: 'Orthopedist', rating: '4.8', experience: '14 Years', image: images.doctors.doctor11 }/g, "{ id: 'd12', name: 'Dr. Bruce Wayne', specialization: 'Orthopedist', rating: '4.8', experience: '14 Years', image: images.doctors.doctor11, phone: '+91 9876543221' }");
content = content.replace(/{ id: 'd12_2', name: 'Dr. Steve Rogers', specialization: 'Orthopedist', rating: '4.7', experience: '10 Years', image: images.doctors.doctor12b }/g, "{ id: 'd12_2', name: 'Dr. Steve Rogers', specialization: 'Orthopedist', rating: '4.7', experience: '10 Years', image: images.doctors.doctor12b, phone: '+91 9876543222' }");
content = content.replace(/{ id: 'd12_3', name: 'Dr. Tony Stark', specialization: 'Orthopedist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor13b }/g, "{ id: 'd12_3', name: 'Dr. Tony Stark', specialization: 'Orthopedist', rating: '4.9', experience: '15 Years', image: images.doctors.doctor13b, phone: '+91 9876543223' }");

content = content.replace(/{ id: 'd13', name: 'Dr. Clark Kent', specialization: 'Pediatrician', rating: '4.9', experience: '6 Years', image: images.doctors.doctor14 }/g, "{ id: 'd13', name: 'Dr. Clark Kent', specialization: 'Pediatrician', rating: '4.9', experience: '6 Years', image: images.doctors.doctor14, phone: '+91 9876543231' }");
content = content.replace(/{ id: 'd13_2', name: 'Dr. Diana Prince', specialization: 'Pediatrician', rating: '4.8', experience: '8 Years', image: images.doctors.doctor7 }/g, "{ id: 'd13_2', name: 'Dr. Diana Prince', specialization: 'Pediatrician', rating: '4.8', experience: '8 Years', image: images.doctors.doctor7, phone: '+91 9876543232' }");
content = content.replace(/{ id: 'd13_3', name: 'Dr. Barry Allen', specialization: 'Pediatrician', rating: '4.6', experience: '4 Years', image: images.doctors.doctor15 }/g, "{ id: 'd13_3', name: 'Dr. Barry Allen', specialization: 'Pediatrician', rating: '4.6', experience: '4 Years', image: images.doctors.doctor15, phone: '+91 9876543233' }");

fs.writeFileSync(file, content);
console.log('Done replacing ALL_DOCTORS');
