export const AD_CONCEPTS = [
  { t: 'Domain controllers', b: 'Servers running Active Directory Domain Services. They hold the directory, authenticate users and computers, and distribute Group Policy. They are Tier 0: whoever controls them effectively controls the domain.' },
  { t: 'Kerberos (high level)', b: 'A user proves identity to the KDC on the domain controller and receives a ticket-granting ticket (TGT). They then request service tickets for resources and present those to the services. Time sync and correct SPNs matter.' },
  { t: 'NTLM (high level)', b: 'An older challenge-response protocol still used as a fallback. It lacks Kerberos features such as mutual authentication, so organizations reduce and audit its use.' },
  { t: 'LDAP and LDAPS', b: 'LDAP queries and updates the directory. LDAPS (or LDAP with signing and channel binding) protects it from interception and relay. Enumeration of the directory is common after a foothold.' },
  { t: 'Group Policy and OUs', b: 'Organizational Units structure objects; Group Policy Objects apply settings (auditing, firewall, restrictions) to them. Write access to a GPO is powerful, so control who can edit.' },
  { t: 'Privileged groups', b: 'Domain Admins, Enterprise Admins and similar groups. Keep membership small, use separate admin accounts, and alert on every change.' },
  { t: 'Service accounts', b: 'Accounts used by applications. They often have weak or never-rotated passwords and excessive rights. Managed service accounts or long random passwords reduce Kerberoasting exposure (a concept where service tickets are targeted for offline password guessing).' },
  { t: 'Hybrid identity', b: 'Many organizations sync on-premises AD to a cloud directory such as Microsoft Entra ID. Not every enterprise does this; where it exists, compromise on one side can affect the other.' }]
export type Ctl = 'laps' | 'tier' | 'gmsa' | 'mfa'
export const CTLS: { id: Ctl; name: string; what: string }[] = [
  { id: 'laps', name: 'Unique local admin passwords', what: 'Stops one stolen local password from working on every machine.' },
  { id: 'tier', name: 'Admin tiering', what: 'Privileged credentials are never used on lower-tier servers or workstations, so they are not there to steal.' },
  { id: 'gmsa', name: 'Managed or long random service-account passwords', what: 'Makes offline guessing of service-account secrets impractical.' },
  { id: 'mfa', name: 'MFA + privileged access management for admin logons', what: 'A stolen password alone cannot open a privileged session.' }]
export const RISK_STEPS: { title: string; text: string; blockedBy?: Ctl }[] = [
  { title: 'Endpoint compromised', text: 'A user runs a malicious attachment on a workstation.' },
  { title: 'Move to a server with a shared local admin password', text: 'The same local admin password exists on many machines.', blockedBy: 'laps' },
  { title: 'Privileged credentials found on that server', text: 'An administrator had logged on, leaving usable credential material.', blockedBy: 'tier' },
  { title: 'Weak service-account secret recovered', text: 'A service account with broad rights has a guessable password.', blockedBy: 'gmsa' },
  { title: 'Privileged logon to the domain controller', text: 'The attacker authenticates as a privileged account to Tier 0.', blockedBy: 'mfa' }]
export const DETECTIONS = [
  { ev: '4768 / 4769', what: 'Kerberos TGT and service-ticket requests', note: 'Look for unusual volume of service tickets from one account or unexpected encryption types. Needs the right audit policy.' },
  { ev: '4624 / 4625', what: 'Successful and failed logons', note: 'Watch logon type 3 and 10 from unusual sources and many failures across accounts.' },
  { ev: '4672', what: 'Special privileges assigned to a new logon', note: 'Expected for admins. A service account or unusual host is worth a look.' },
  { ev: '4728 / 4732', what: 'Member added to a privileged group', note: 'Should match an approved change. Alert on every Domain Admins change.' }]
