const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'data', 'mockData.ts');
let content = fs.readFileSync(file, 'utf8');

// A quick and dirty regex replace for doctors in HOSPITALS that don't have phone numbers
content = content.replace(/{ id: 'd1', name: 'Dr. John Doe', spId: 'sp1', specialization: 'Cardiologist' }/g, "{ id: 'd1', name: 'Dr. John Doe', spId: 'sp1', specialization: 'Cardiologist', phone: '+91 9876543201' }");
content = content.replace(/{ id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp2', specialization: 'Dentist' }/g, "{ id: 'd2', name: 'Dr. Sarah Smith', spId: 'sp2', specialization: 'Dentist', phone: '+91 9876543202' }");
content = content.replace(/{ id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp3', specialization: 'Neurologist' }/g, "{ id: 'd3', name: 'Dr. Mike Johnson', spId: 'sp3', specialization: 'Neurologist', phone: '+91 9876543203' }");
content = content.replace(/{ id: 'd8', name: 'Dr. Peter Parker', spId: 'sp3', specialization: 'Neurologist' }/g, "{ id: 'd8', name: 'Dr. Peter Parker', spId: 'sp3', specialization: 'Neurologist', phone: '+91 9876543208' }");
content = content.replace(/{ id: 'd6', name: 'Dr. Alice Brown', spId: 'sp1', specialization: 'Cardiologist' }/g, "{ id: 'd6', name: 'Dr. Alice Brown', spId: 'sp1', specialization: 'Cardiologist', phone: '+91 9876543206' }");
content = content.replace(/{ id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2', specialization: 'Dentist' }/g, "{ id: 'd7', name: 'Dr. Charlie Clark', spId: 'sp2', specialization: 'Dentist', phone: '+91 9876543207' }");

fs.writeFileSync(file, content);
console.log('Done');
