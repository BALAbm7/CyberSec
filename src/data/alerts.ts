export type Sev = 'Critical' | 'High' | 'Medium' | 'Low'
export interface Action { id: string; label: string; result: string; ok: boolean; isolates?: boolean }
export interface Evidence { id: string; label: string; body: string; key: boolean }
export interface Case {
  id: string; title: string; sev: Sev; time: string; asset: string; user: string; src: string; dst: string; mitre: [string, string][]
  summary: string; timeline: [string, string][]; evidence: Evidence[]; steps: string[]; truth: 'true' | 'false'; actions: Action[]; lesson: string
}
export const CASES: Case[] = [
  { id: 'phish-exec', title: 'Macro document spawns PowerShell after phishing email', sev: 'High', time: '09:21Z', asset: 'laptop', user: 'AEGIS\\a.kumar', src: '10.20.4.17', dst: '203.0.113.50:443',
    mitre: [['T1566.001', 'Phishing: Spearphishing Attachment'], ['T1204.002', 'User Execution: Malicious File'], ['T1059.001', 'PowerShell']],
    summary: 'EDR flagged Word launching PowerShell on LAPTOP-017 minutes after a suspicious email was delivered.',
    timeline: [['09:14', 'Email with Invoice_8841.docm delivered to a.kumar'], ['09:20', 'Attachment opened; proxy shows an outbound download'], ['09:21', 'WINWORD.EXE spawns powershell.exe'], ['09:22', 'powershell.exe connects to 203.0.113.50:443']],
    evidence: [
      { id: 'e1', label: 'Email gateway log', key: true, body: '09:14:07Z action=delivered from=billing@invoice-portal.example to=a.kumar@aegis.example attachment=Invoice_8841.docm verdict=suspicious' },
      { id: 'e2', label: 'EDR process tree', key: true, body: 'LAPTOP-017  WINWORD.EXE (pid 4120)\n  └─ powershell.exe -nop -w hidden -enc <base64 string, synthetic>' },
      { id: 'e3', label: 'Proxy log', key: true, body: '09:22:03Z user=a.kumar dst=203.0.113.50:443 category=uncategorized bytes_out=1.4KB' },
      { id: 'e4', label: 'Printer queue log', key: false, body: '09:05Z PRN-02 job=Quarterly_Report.pdf pages=12 user=a.kumar status=complete' }],
    steps: ['Confirm the email and list all recipients', 'Review the process tree and command line', 'Check outbound connections from the host', 'Contain if execution is confirmed'], truth: 'true',
    actions: [
      { id: 'isolate', label: 'Isolate LAPTOP-017 via EDR', ok: true, isolates: true, result: 'Host isolated; only EDR management traffic remains. The user cannot work until release, but the foothold is cut off.' },
      { id: 'quarantine', label: 'Quarantine the email only', ok: false, result: 'Other recipients are protected, but the running PowerShell session on the laptop continues.' },
      { id: 'resetall', label: 'Force a company-wide password reset', ok: false, result: 'Large disruption, and the infected host is still active.' },
      { id: 'close', label: 'Close as false positive', ok: false, result: 'A real intrusion is left running.' }],
    lesson: 'Office applications launching script interpreters are high-signal. Contain the host first, then clean up the email and scope other recipients.' },
  { id: 'spray-success', title: 'Many failed sign-ins, then one success from the same IP', sev: 'High', time: '03:12Z', asset: 'entra', user: 'j.mehta@aegis.example', src: '203.0.113.77', dst: 'cloud sign-in',
    mitre: [['T1110.003', 'Brute Force: Password Spraying'], ['T1078', 'Valid Accounts']],
    summary: 'Cloud sign-in logs show 38 failures across 25 accounts from one IP, then a successful sign-in for one user without MFA.',
    timeline: [['03:05', 'Failures begin across many accounts from 203.0.113.77'], ['03:11', '38th failure'], ['03:12', 'j.mehta signs in successfully (legacy protocol)'], ['03:15', 'New mailbox rule forwards mail externally']],
    evidence: [
      { id: 'e1', label: 'Sign-in log summary', key: true, body: 'src=203.0.113.77 failures=38 distinct_users=25 window=6min\n03:12:44Z user=j.mehta result=success protocol=legacy mfa=not-required' },
      { id: 'e2', label: 'Mailbox audit', key: true, body: '03:15:20Z user=j.mehta op=New-InboxRule forwardTo=ext-archive@mail.example' },
      { id: 'e3', label: 'Software inventory', key: false, body: 'j.mehta: Office 16, Teams, VPN client (no change this week)' }],
    steps: ['Check failures per source and per account', 'Confirm the success came after the failures', 'Review what the account did next', 'Reset and revoke access'], truth: 'true',
    actions: [
      { id: 'reset', label: 'Reset password, revoke sessions, remove the mailbox rule', ok: true, result: 'The attacker session ends and forwarding stops. The user must re-register sign-in details.' },
      { id: 'blockip', label: 'Block the source IP only', ok: false, result: 'The existing session and rule remain, and attackers can switch IPs.' },
      { id: 'isolate', label: 'Isolate the user laptop', ok: false, result: 'No host is involved; this disrupts the user and fixes nothing.' },
      { id: 'close', label: 'Close as false positive', ok: false, result: 'Mail is being forwarded out. Not benign.' }],
    lesson: 'Success after many failures from one source is a core correlation. Legacy authentication without MFA made it possible.' },
  { id: 'ps-fp', title: 'Encoded PowerShell on an admin workstation', sev: 'Medium', time: '02:04Z', asset: 'admin', user: 'AEGIS\\it.deploy', src: '10.20.5.4', dst: 'none',
    mitre: [['T1059.001', 'PowerShell']],
    summary: 'A rule alerted on an encoded PowerShell command. Decide whether it is malicious.',
    timeline: [['02:00', 'Maintenance window starts (CHG-2041)'], ['02:04', 'Encoded PowerShell launched by the endpoint-management agent'], ['02:05', 'Script completes; no external connections']],
    evidence: [
      { id: 'e1', label: 'Decoded script block (4104)', key: true, body: 'Get-CimInstance Win32_OperatingSystem | Select Caption,Version,LastBootUpTime  # inventory only' },
      { id: 'e2', label: 'Change ticket', key: true, body: 'CHG-2041 approved: weekly hardware/software inventory, 02:00-03:00, account it.deploy' },
      { id: 'e3', label: 'Parent process', key: true, body: 'parent=endpoint-mgmt-agent.exe signed=true publisher=Aegis IT (synthetic)' },
      { id: 'e4', label: 'Network connections', key: true, body: 'No outbound connections during the run' }],
    steps: ['Decode the command', 'Check the parent process and signer', 'Look for a matching approved change', 'Decide and document'], truth: 'false',
    actions: [
      { id: 'closefp', label: 'Close as false positive and tune the rule', ok: true, result: 'Closed with a note to exclude this signed agent during approved windows, while keeping the rule for other cases.' },
      { id: 'isolate', label: 'Isolate the admin workstation', ok: false, result: 'Needless disruption of administrators during maintenance.' },
      { id: 'disable', label: 'Disable the it.deploy account', ok: false, result: 'Breaks scheduled maintenance for no reason.' },
      { id: 'escalate', label: 'Escalate as a major incident', ok: false, result: 'Wastes responder time and erodes trust in alerts.' }],
    lesson: 'Encoded PowerShell is suspicious but not proof. Context such as parent, signer, and change records separates admin automation from attacks.' },
  { id: 'group-change', title: 'Unexpected Domain Admins membership change', sev: 'Critical', time: '09:52Z', asset: 'dc', user: 'AEGIS\\svc-backup', src: '10.20.8.5', dst: 'DC-01',
    mitre: [['T1098', 'Account Manipulation'], ['T1078.002', 'Valid Accounts: Domain Accounts']],
    summary: 'A new account was added to Domain Admins by a service account from an application server.',
    timeline: [['09:47', 'svc-backup logs on to DC-01 from APP-01'], ['09:50', 'Account helpdesk-tmp created'], ['09:52', 'helpdesk-tmp added to Domain Admins (4728)']],
    evidence: [
      { id: 'e1', label: 'Security 4728', key: true, body: 'EventID=4728 Subject=AEGIS\\svc-backup Member=CN=helpdesk-tmp Group=Domain Admins DC=DC-01' },
      { id: 'e2', label: 'Logon 4624', key: true, body: 'EventID=4624 Account=svc-backup LogonType=3 Source=10.20.8.5 (APP-01, not an admin workstation)' },
      { id: 'e3', label: 'Change management', key: true, body: 'No approved change for privileged group membership on this date' },
      { id: 'e4', label: 'Backup schedule', key: false, body: 'Nightly backup job runs at 02:00 using svc-backup' }],
    steps: ['Identify who made the change and from where', 'Verify against change records', 'Revert the privilege and disable the new account', 'Scope for further activity'], truth: 'true',
    actions: [
      { id: 'revert', label: 'Remove helpdesk-tmp from Domain Admins, disable it, restrict svc-backup', ok: true, result: 'Privilege reverted. Backup jobs may fail until svc-backup credentials are reissued.' },
      { id: 'isolatedc', label: 'Isolate the domain controller', ok: false, result: 'Authentication fails for everyone; the account change is still unreviewed.' },
      { id: 'monitor', label: 'Monitor and wait', ok: false, result: 'The attacker keeps domain-level access.' },
      { id: 'close', label: 'Close as false positive', ok: false, result: 'There is no approved change. This is not benign.' }],
    lesson: 'Changes to privileged groups should be rare and ticketed. Any unapproved change is worth immediate action.' },
  { id: 'ssh-login', title: 'SSH login after repeated failures, then root shell', sev: 'High', time: '11:34Z', asset: 'linuxweb', user: 'deploy', src: '203.0.113.50', dst: '198.51.100.20:22',
    mitre: [['T1110.001', 'Password Guessing'], ['T1078', 'Valid Accounts'], ['T1548.003', 'Sudo and Sudo Caching']],
    summary: 'SSH succeeded for deploy after hundreds of failures from one external IP, followed by sudo to root.',
    timeline: [['11:30', '240 failed SSH logins in 5 minutes'], ['11:34', 'Accepted password for deploy'], ['11:36', 'sudo to /bin/bash as root']],
    evidence: [
      { id: 'e1', label: 'auth.log', key: true, body: '11:30:01Z sshd Failed password for invalid user admin from 203.0.113.50 (x240)\n11:34:48Z sshd Accepted password for deploy from 203.0.113.50' },
      { id: 'e2', label: 'sudo log', key: true, body: '11:36:20Z sudo deploy : TTY=pts/0 ; USER=root ; COMMAND=/bin/bash' },
      { id: 'e3', label: 'Admin access list', key: true, body: 'Approved SSH sources: 10.20.5.0/24 only. 203.0.113.50 is not listed.' },
      { id: 'e4', label: 'Web access log', key: false, body: '200 OK GET /index.html (normal traffic)' }],
    steps: ['Compare failures and successes by source', 'Check commands run after login', 'Verify the source against allowed admin networks', 'Lock the account and close the exposure'], truth: 'true',
    actions: [
      { id: 'lock', label: 'Lock account, rotate credentials, restrict SSH to the admin network', ok: true, result: 'Access ends and the exposure closes. Review the session for persistence next.' },
      { id: 'blockip', label: 'Block the source IP only', ok: false, result: 'Does not cure a successful login or the weak password.' },
      { id: 'isolate', label: 'Isolate the web server now', ok: false, isolates: true, result: 'Takes the public site offline before the response is proportionate; reasonable only if more compromise is found.' },
      { id: 'close', label: 'Close as false positive', ok: false, result: 'An unauthorized root session remains.' }],
    lesson: 'Correlate failures to success per source, then check post-login behavior. Close the exposure, not just the symptom.' },
  { id: 'outbound', title: 'Large outbound transfer from the web server', sev: 'High', time: '10:09Z', asset: 'linuxweb', user: 'www-data', src: '198.51.100.20', dst: '203.0.113.50:4444',
    mitre: [['T1571', 'Non-Standard Port'], ['T1041', 'Exfiltration Over C2 Channel']],
    summary: 'The DMZ web server sent 412 MB to an unfamiliar external IP on port 4444.',
    timeline: [['10:02', 'nginx process executes /bin/sh'], ['10:02', 'First outbound connection to 203.0.113.50:4444'], ['10:09', '412 MB sent']],
    evidence: [
      { id: 'e1', label: 'Firewall log', key: true, body: '10:09:02Z src=198.51.100.20 dst=203.0.113.50:4444 action=allow bytes_out=412MB' },
      { id: 'e2', label: 'Baseline', key: true, body: 'Typical outbound volume for this server: under 5 MB per day to known update hosts' },
      { id: 'e3', label: 'auditd', key: true, body: '10:02:19Z type=EXECVE uid=www-data exe=/bin/sh parent=nginx' },
      { id: 'e4', label: 'Marketing calendar', key: false, body: 'Campaign launch today (explains more inbound visits, not outbound transfers)' }],
    steps: ['Compare volume to baseline', 'Identify the process behind the connection', 'Check what data the app can access', 'Contain and preserve evidence'], truth: 'true',
    actions: [
      { id: 'isolate', label: 'Isolate the server and preserve evidence', ok: true, isolates: true, result: 'Exfiltration stops and memory and disk are kept. The public site is offline until rebuilt.' },
      { id: 'blockdst', label: 'Block the destination only', ok: false, result: 'Stops this channel, but the attacker still has a shell and can switch destinations.' },
      { id: 'reboot', label: 'Reboot the server', ok: false, result: 'Destroys volatile evidence and does not remove the attacker.' },
      { id: 'close', label: 'Close as false positive', ok: false, result: 'Data is leaving. Not benign.' }],
    lesson: 'A web process spawning a shell plus unusual outbound volume is a strong pair. Preserve evidence when you contain.' }]
export const PLANNED_CASES = ['Cloud access from an unusual context', 'Potential access-key misuse', 'Suspicious DNS activity', 'Anomalous connection toward an OT asset']
