export interface Opt { id: string; label: string; note: string; ok?: boolean }
export const PHASES = ['Preparation', 'Detection & Analysis', 'Containment', 'Eradication', 'Recovery', 'Lessons Learned'] as const
export const INCIDENT = { id: 'INC-2026-0412', title: 'Phishing-led compromise at Aegis Dynamics (fictional)', alert: 'EDR: WINWORD.EXE spawned powershell.exe on LAPTOP-017',
  timeline: [['09:14', 'Phishing email with a macro document delivered'], ['09:21', 'Document opened; PowerShell launched (EDR alert)'], ['09:33', 'SMB logon from the laptop to the app server using a local admin account'], ['09:47', 'svc-backup logs on to the domain controller from the app server'], ['09:52', 'New account added to Domain Admins'], ['10:05', 'SOC correlation alert fires']] as [string, string][],
  assets: ['LAPTOP-017 (user workstation)', 'APP-01 (Windows app server)', 'DC-01 (domain controller)', 'svc-backup (service account)', 'helpdesk-tmp (new privileged account)'] }
export const PREP: { item: string; had: boolean; note: string }[] = [
  { item: 'Documented IR plan and roles', had: true, note: 'Responders knew who to call.' }, { item: 'EDR with remote isolation', had: true, note: 'Made fast containment possible.' },
  { item: 'Central logging of identity events', had: true, note: 'The group-change alert was possible because of it.' }, { item: 'User-to-server segmentation', had: false, note: 'Gap: allowed SMB lateral movement.' },
  { item: 'Tiered admin model for service accounts', had: false, note: 'Gap: a service account could reach the DC from an app server.' }]
export const SEVERITY: Opt[] = [
  { id: 'Low', label: 'Low', note: 'Underestimates a privileged-account change on a domain controller.' },
  { id: 'Medium', label: 'Medium', note: 'Understates the risk: attacker activity reached identity infrastructure.' },
  { id: 'High', label: 'High', ok: true, note: 'Reasonable: confirmed lateral movement and privilege misuse.' },
  { id: 'Critical', label: 'Critical', ok: true, note: 'Best fit: unauthorized Domain Admins membership means potential domain-wide compromise.' }]
export const CONTAIN: (Opt & { impact: number; risk: number; assets: string[] })[] = [
  { id: 'a', label: 'Isolate the laptop only', impact: 1, risk: 2, assets: ['LAPTOP-017'], note: 'Cuts the original foothold, but the attacker still holds app-server access and a privileged account.' },
  { id: 'b', label: 'Isolate laptop and app server, disable svc-backup and helpdesk-tmp', impact: 2, risk: 1, ok: true, assets: ['LAPTOP-017', 'APP-01', 'svc-backup', 'helpdesk-tmp'], note: 'Best balance: stops known attacker paths. Trade-off: the app and backup jobs stop until recovery.' },
  { id: 'c', label: 'Take the whole network offline', impact: 3, risk: 1, assets: ['LAPTOP-017', 'APP-01', 'DC-01', 'All user segments'], note: 'Strong containment but a company-wide outage, and volatile evidence may be lost.' },
  { id: 'd', label: 'Monitor quietly to learn more', impact: 0, risk: 3, assets: [], note: 'Learns attacker goals but risks further privilege use, data theft, and loss of control.' }]
export const ERAD: Opt[] = [
  { id: 'reimage', label: 'Reimage LAPTOP-017', ok: true, note: 'Removes the foothold and any unknown persistence.' },
  { id: 'rotate', label: 'Rotate svc-backup and every credential exposed on APP-01', ok: true, note: 'Stolen credentials must not stay valid.' },
  { id: 'groups', label: 'Remove helpdesk-tmp and review all privileged group membership', ok: true, note: 'Reverts attacker-created privilege.' },
  { id: 'persist', label: 'Hunt scheduled tasks, services, and autostarts on both hosts', ok: true, note: 'Finds persistence the alert did not show.' },
  { id: 'krbtgt', label: 'Plan a krbtgt reset because DC credential exposure cannot be ruled out', ok: true, note: 'Invalidates forged Kerberos tickets. Done carefully, in stages, with AD owner approval.' },
  { id: 'email', label: 'Delete the phishing email and stop there', note: 'Needed, but not sufficient: the attacker already moved beyond the mailbox.' },
  { id: 'wipedc', label: 'Rebuild the domain controller immediately', note: 'Premature and risky: preserve evidence and assess first.' }]
export const RECOVER: Opt[] = [
  { id: 'restore', label: 'Return APP-01 to service only after rebuild and validation', ok: true, note: 'Prevents reintroducing the attacker.' },
  { id: 'logs', label: 'Confirm EDR and log collection are working on recovered hosts', ok: true, note: 'You need visibility to spot a return.' },
  { id: 'monitor', label: 'Run heightened monitoring for the affected accounts and hosts', ok: true, note: 'Attackers often retry.' },
  { id: 'backups', label: 'Verify backup integrity before relying on it', ok: true, note: 'Backups used by svc-backup may have been touched.' },
  { id: 'declare', label: 'Declare recovery now to restore normal operations', note: 'Skips validation and risks reinfection.' },
  { id: 'muteedr', label: 'Reduce EDR alerting to cut noise', note: 'Removes the very visibility you need after an incident.' }]
export const RECS: { id: string; label: string; control: string }[] = [
  { id: 'mail', label: 'Attachment sandboxing and macro blocking', control: 'emailFilter' }, { id: 'edr', label: 'EDR in prevention mode', control: 'edr' },
  { id: 'seg', label: 'User-to-server segmentation', control: 'segmentation' }, { id: 'pam', label: 'Tiered admin and service-account hardening', control: 'pam' },
  { id: 'log', label: 'Alert on privileged group changes', control: 'logging' }, { id: 'laps', label: 'Unique local admin passwords', control: 'segmentation' }]
export const ROOT_CAUSE = 'A macro-enabled attachment reached a user whose laptop allowed script execution. Reused local admin credentials enabled SMB lateral movement, and a service account could reach the domain controller from an app server.'
