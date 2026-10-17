import type { Item } from './cloudLab'
export const OT_CONCEPTS: Item[] = [
  { t: 'IT vs OT', b: 'IT prioritizes confidentiality; OT prioritizes availability and safety. OT systems run for years, patch slowly, and may use protocols with no authentication.' },
  { t: 'Availability, safety, change control', b: 'Stopping a process can be dangerous or costly. Changes need approval, testing, and maintenance windows, so security actions must be coordinated with operations.' },
  { t: 'SCADA, PLCs, HMIs, historians', b: 'PLCs run control logic; HMIs show and command the process; SCADA coordinates sites; historians store process data, often replicated to IT.' },
  { t: 'Segmentation and industrial firewalls', b: 'Separate zones and conduits with default-deny rules and protocol-aware inspection.' },
  { t: 'Passive monitoring', b: 'Sensors on mirrored traffic identify assets and detect anomalies without sending packets to fragile devices.' },
  { t: 'Secure remote access', b: 'Use a jump host in the OT DMZ with MFA, session recording, and time-limited access instead of direct connections.' },
  { t: 'Asset inventory', b: 'You cannot protect what you do not know. Passive discovery builds inventory of devices, firmware, and communication paths.' },
  { t: 'Incident response in OT', b: 'Involve operations first. Prefer isolation at the boundary over shutting down devices, and keep safety systems independent.' }]
export const PURDUE = [
  { lvl: 'Level 5', name: 'Enterprise network', assets: 'Corporate IT, email, internet access', note: 'Normal IT security controls.' },
  { lvl: 'Level 4', name: 'Site business planning', assets: 'ERP, business applications', note: 'May need production data from OT.' },
  { lvl: 'Level 3.5', name: 'OT DMZ', assets: 'Historian replica, jump host, patch server', note: 'The boundary: IT and OT meet only here.' },
  { lvl: 'Level 3', name: 'Site operations', assets: 'Historian, engineering workstation, OT servers', note: 'Operations management.' },
  { lvl: 'Level 2', name: 'Area supervisory control', assets: 'HMIs, SCADA servers', note: 'Operators view and command the process.' },
  { lvl: 'Level 1', name: 'Basic control', assets: 'PLCs, controllers', note: 'Runs the control logic. Safety-critical.' },
  { lvl: 'Level 0', name: 'Process', assets: 'Sensors, actuators', note: 'Physical process devices.' }]
export const OT_NOTE = 'Simulation only. Safety-critical environments need specialized assessment and change approval. Never run tests or commands against real industrial devices.'
