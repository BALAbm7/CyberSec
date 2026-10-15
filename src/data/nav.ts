import { Home, Radar, Network, Swords, Shield, Library, Laptop, Mail, KeyRound, Server, Wifi, Cloud, Factory, Search, Siren, Grid3x3, ShieldCheck, BookOpen, Info, type LucideIcon } from 'lucide-react'
export interface NavItem { path: string; label: string; icon: LucideIcon; blurb: string; phase: number }
export const NAV: NavItem[] = [
 {path:'/',label:'Home',icon:Home,blurb:'Welcome to CyberSec.',phase:1},
 {path:'/cyber-range',label:'Cyber Range',icon:Radar,blurb:'Explore the fictional Aegis Dynamics enterprise.',phase:3},
 {path:'/architecture',label:'Enterprise Architecture',icon:Network,blurb:'Trust boundaries and telemetry flow.',phase:2},
 {path:'/red-team',label:'Red Team',icon:Swords,blurb:'Watch how the attacker moves laterally.',phase:3},
 {path:'/blue-team',label:'Blue Team',icon:Shield,blurb:"Let's investigate this alert.",phase:4},
 {path:'/attack-library',label:'Attack Library',icon:Library,blurb:'Searchable attack and defense entries.',phase:5},
 {path:'/endpoint',label:'Endpoint Security',icon:Laptop,blurb:'Process trees and endpoint telemetry.',phase:5},
 {path:'/email',label:'Email Security',icon:Mail,blurb:'SPF, DKIM, DMARC and phishing triage.',phase:5},
 {path:'/identity',label:'Identity & Active Directory',icon:KeyRound,blurb:'The domain controller is the next critical asset.',phase:5},
 {path:'/servers',label:'Windows & Linux Security',icon:Server,blurb:'Event IDs, auth logs and hardening.',phase:5},
 {path:'/network',label:'Network Security',icon:Wifi,blurb:'Segmentation and packet-flow simulation.',phase:5},
 {path:'/cloud',label:'Cloud Security',icon:Cloud,blurb:'AWS and Azure learning paths.',phase:5},
 {path:'/ot',label:'OT / ICS Security',icon:Factory,blurb:'Purdue Model and IT/OT boundaries.',phase:5},
 {path:'/threat-hunting',label:'Threat Hunting',icon:Search,blurb:'Hypotheses, pivots and KQL examples.',phase:5},
 {path:'/incident-response',label:'Incident Response',icon:Siren,blurb:"Let's isolate the compromised endpoint.",phase:4},
 {path:'/mitre',label:'MITRE ATT&CK Explorer',icon:Grid3x3,blurb:'Tactics and techniques mapped to assets.',phase:5},
 {path:'/controls',label:'Security Controls',icon:ShieldCheck,blurb:'Before/after control comparison.',phase:5},
 {path:'/glossary',label:'Glossary',icon:BookOpen,blurb:'Terms and learning paths.',phase:5},
 {path:'/about',label:'About the Project',icon:Info,blurb:'Scope, safety and attribution.',phase:1}]
