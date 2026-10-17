import { H, Intro } from '../components/ui/Primitives'
export default function AboutPage() {
  return (
    <section className="max-w-3xl">
      <Intro title="About CyberSec">An interactive cybersecurity learning platform: enterprise architecture, attack and defense simulations, investigations, and labs, built as a portfolio and teaching project.</Intro>
      <H>Safety</H><p className="text-sm text-mute">Everything is a local simulation on a fictional company (Aegis Dynamics) with synthetic data. The app makes no attacks, scans, packet captures, or SIEM or cloud connections, and never runs code you type. Simulated actions do not change any real system.</p>
      <H>Data and privacy</H><p className="text-sm text-mute">No accounts, analytics, or servers. Progress and case notes are stored only in your browser (localStorage) and can be reset in the app.</p>
      <H>Attribution and accuracy</H><p className="text-sm text-mute">MITRE ATT&CK® is a registered trademark of The MITRE Corporation. Technique IDs here were written from memory and are not yet validated against a pinned ATT&CK version; verify at attack.mitre.org. Cloud services named (AWS, Microsoft Azure and others) belong to their owners and are used as examples.</p>
      <H>Roadmap</H><ul className="list-disc pl-5 text-sm text-mute"><li>Remaining Blue Team cases and Red Team scenarios</li><li>Richer homepage dashboard and onboarding tutorial</li><li>Automated tests, accessibility audit, and README/CI polish</li></ul>
    </section>)
}
