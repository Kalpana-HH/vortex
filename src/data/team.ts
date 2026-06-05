import { TeamMember } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    role: 'Team Captain & Lead Hardware Designer',
    department: 'Mechanical',
    bio: 'Alex handles CAD development and final physical assembly. He spends too much time adjusting belt tensions and finding missing 10-32 screws.',
    favTool: 'Dewalt Cordless Band Saw',
    favComponent: 'goBILDA Viper Slide Kit',
    quote: 'If it doesn’t fit, CAD it again. If it still doesn’t fit, grab the dremel.'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Lead Softwear Architect',
    department: 'Software',
    bio: 'Sarah leads our programming team. She configured our RoadRunner three-wheel odometry and maintains our autonomous neural network detections.',
    favTool: 'IntelliJ IDEA & Git Kraken',
    favComponent: 'REV Control Hub & Pinpoint Odometry',
    quote: 'It compiled on my machine, so user error.'
  },
  {
    id: '3',
    name: 'Marcus Vance',
    role: 'CAD & Fabrication Engineer',
    department: 'Mechanical',
    bio: 'Marcus is an expert in aluminum router manufacturing and custom intake designs. He ensures our vacuum grabbers hold game pieces perfectly.',
    favTool: '3D Printer (Voron 2.4)',
    favComponent: 'Heavy Duty 393RPM goBILDA Yellow Jacket Motors',
    quote: 'Fillet everything. Sharp edges are for team numbers, not aluminum.'
  },
  {
    id: '4',
    name: 'Emily Taylor',
    role: 'Outreach Director & Notebook Manager',
    department: 'Design & Outreach',
    bio: 'Emily connects Vortex with local STEM initiatives and edits our Engineering Portfolio. She coordinate workshops at middle schools.',
    favTool: 'Canva Pro & Notion Workspace',
    favComponent: 'Polished Carbon Fiber Plates for aesthetics',
    quote: 'Robotics isn’t just about the metal; it’s about the community we build!'
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Controls & Sensor Integration Developer',
    department: 'Software',
    bio: 'David maintains our absolute encoders, distance sensors, and limelight cameras. He ensures our autos are millisecond-perfect.',
    favTool: 'Logic Analyzer & Oscilloscope',
    favComponent: 'Limelight 3G Vision Processing Camera',
    quote: 'Sensing is believing, though sometimes the PID disagrees.'
  },
  {
    id: '6',
    name: 'Coach Elena Rostova',
    role: 'Lead Technical Mentor',
    department: 'Mentors',
    bio: 'With over 10 years of aerospace engineering experience, Elena teaches Vortex structural math, electrical safety, and industrial CAD standards.',
    favTool: 'Vernier Calipers & Torque Wrench',
    favComponent: 'Planetary Gearboxes',
    quote: 'Measure twice, cut once, document always.'
  }
];
