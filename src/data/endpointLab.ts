export type Kind = 'process' | 'file' | 'auth' | 'network' | 'persistence'
export interface Ev { id: string; time: string; kind: Kind; text: string; parent?: string; sus: boolean; why: string; raw: string }
export interface Endpoint { id: 'win' | 'lin'; name: string; user: string; tools: string; events: Ev[] }
export const ENDPOINTS: Endpoint[] = [
  { id: 'win', name: 'LAPTOP-017 (Windows)', user: 'AEGIS\\a.kumar', tools: 'EDR agent: running (detect-only) · Defender Firewall: on · Disk encryption: on',
    events: [
      { id: 'w1', time: '09:19', kind: 'process', text: 'explorer.exe', sus: false, why: 'The normal user shell. Expected parent for apps the user opens.', raw: 'pid=2210 image=C:\\Windows\\explorer.exe user=a.kumar' },
      { id: 'w2', time: '09:20', kind: 'file', text: 'Downloads\\Invoice_8841.docm created', sus: false, why: 'A download alone is normal. It matters because of the email context and what happens next.', raw: 'FileCreate path=C:\\Users\\a.kumar\\Downloads\\Invoice_8841.docm origin=browser' },
      { id: 'w3', time: '09:21', kind: 'process', text: 'WINWORD.EXE', parent: 'w1', sus: false, why: 'Word starting is normal on its own.', raw: 'pid=4120 ppid=2210 image=...\\WINWORD.EXE cmd="WINWORD.EXE Invoice_8841.docm"' },
      { id: 'w4', time: '09:21', kind: 'process', text: 'powershell.exe -nop -w hidden -enc <base64>', parent: 'w3', sus: true, why: 'Word should not launch a hidden, encoded PowerShell. This parent-child pair is a classic execution indicator.', raw: 'EventID=4688 NewProcess=powershell.exe Parent=WINWORD.EXE cmd="-nop -w hidden -enc <synthetic>"' },
      { id: 'w5', time: '09:22', kind: 'network', text: 'powershell.exe → 203.0.113.50:443', parent: 'w4', sus: true, why: 'A script interpreter connecting out to an unfamiliar host suggests staging or command and control.', raw: 'conn pid=4188 proc=powershell.exe dst=203.0.113.50:443 bytes_out=1.4KB' },
      { id: 'w6', time: '09:26', kind: 'persistence', text: 'Scheduled task "OneDriveSync-Update" created', sus: true, why: 'A task with a familiar-sounding name that runs a script helps an attacker survive reboots.', raw: 'EventID=4698 TaskName=\\OneDriveSync-Update Action=powershell.exe -w hidden ...' },
      { id: 'w7', time: '09:33', kind: 'auth', text: 'Network logon to APP-01 as localadmin', sus: true, why: 'A workstation using a local admin account on a server suggests credential reuse and lateral movement.', raw: 'EventID=4624 LogonType=3 Target=APP-01 Account=localadmin Source=10.20.4.17' }] },
  { id: 'lin', name: 'web1 (Linux, DMZ)', user: 'www-data', tools: 'Host agent: running · auditd: enabled · Host firewall: on',
    events: [
      { id: 'l1', time: '10:00', kind: 'process', text: 'nginx: master process', sus: false, why: 'Expected web server parent process.', raw: 'pid=812 user=root exe=/usr/sbin/nginx' },
      { id: 'l2', time: '10:01', kind: 'auth', text: 'sshd: Accepted publickey for admin from 10.20.5.4', sus: false, why: 'Key-based login from the approved admin network is normal.', raw: 'sshd[1411]: Accepted publickey for admin from 10.20.5.4 port 50122' },
      { id: 'l3', time: '10:02', kind: 'process', text: '/bin/sh -c ...', parent: 'l1', sus: true, why: 'A web server worker running a shell is unusual and usually means code execution through the app.', raw: 'auditd type=EXECVE uid=www-data exe=/bin/sh parent=nginx' },
      { id: 'l4', time: '10:02', kind: 'file', text: '/tmp/.x11-cache created and made executable', parent: 'l3', sus: true, why: 'A hidden, executable file in /tmp created by the web user is a common staging pattern.', raw: 'auditd type=PATH name=/tmp/.x11-cache mode=0755 uid=www-data' },
      { id: 'l5', time: '10:02', kind: 'network', text: '/tmp/.x11-cache → 203.0.113.50:4444', parent: 'l4', sus: true, why: 'Outbound to a non-standard port on an unfamiliar IP from a server that normally only answers requests.', raw: 'conn proc=.x11-cache dst=203.0.113.50:4444 bytes_out=1.2KB' },
      { id: 'l6', time: '10:05', kind: 'persistence', text: 'New entry in /etc/cron.d/sysupdate', sus: true, why: 'A new cron entry written by a non-admin process is a persistence indicator.', raw: 'auditd type=PATH name=/etc/cron.d/sysupdate op=create uid=www-data' }] }]
export const ACTIONS = [
  { id: 'isolate', label: 'Isolate host (network containment)', result: 'Host isolated. Only the security tool channel remains, so the attacker connection is cut. The user or service is unavailable until released.' },
  { id: 'kill', label: 'Terminate the suspicious process', result: 'The process stops, but persistence (tasks or cron) can start it again. Use with other steps.' },
  { id: 'triage', label: 'Collect a triage package', result: 'Logs, process list and autostart entries are gathered for analysis. Does not stop the attacker by itself.' },
  { id: 'none', label: 'Take no action yet', result: 'Reasonable only if more context is needed and risk is low. Here, suspicious activity is ongoing.' }]
