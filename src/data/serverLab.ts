export interface WinEv { id: string; name: string; log: string; desc: string; watch: string; limit: string }
export const WIN_EVENTS: WinEv[] = [
  { id: '4624', name: 'Successful logon', log: 'Security', desc: 'An account logged on. The logon type shows how (2 interactive, 3 network, 10 remote interactive).', watch: 'Type 3 or 10 from unusual hosts, or admin accounts on workstations.', limit: 'Very noisy. Alone it proves nothing.' },
  { id: '4625', name: 'Failed logon', log: 'Security', desc: 'An account failed to log on, with a status and substatus reason.', watch: 'Many failures across accounts or from one source, then a success.', limit: 'Users mistype passwords; locked-out services also generate these.' },
  { id: '4648', name: 'Logon with explicit credentials', log: 'Security', desc: 'A process supplied different credentials than the current session, such as with runas.', watch: 'Unexpected processes using privileged credentials.', limit: 'Common in legitimate admin tools.' },
  { id: '4672', name: 'Special privileges assigned to new logon', log: 'Security', desc: 'A logon received sensitive privileges, typical for administrators.', watch: 'Privileged logon by a service or non-admin account, or from an unusual host.', limit: 'Expected for admins and many services.' },
  { id: '4688', name: 'Process created', log: 'Security', desc: 'A new process started. Needs process-creation auditing; command-line capture needs an additional setting.', watch: 'Office apps spawning interpreters, odd parents, encoded commands.', limit: 'Not available unless auditing is enabled, and it can be high volume.' },
  { id: '4728', name: 'Member added to a security-enabled global group', log: 'Security', desc: 'A user or group was added to a global security group such as Domain Admins.', watch: 'Any change to privileged groups without a ticket.', limit: 'Legitimate changes look identical; match to approved changes.' },
  { id: '4732', name: 'Member added to a security-enabled local group', log: 'Security', desc: 'A member was added to a local group such as Administrators.', watch: 'New local admins on servers.', limit: 'Software installs and IT tasks can cause these.' },
  { id: '7045', name: 'Service installed', log: 'System', desc: 'A new service was installed (Service Control Manager). Watch for remote service installation used for execution or persistence.', watch: 'Services with random names or paths in user-writable folders.', limit: 'Software installers also install services.' },
  { id: '4698', name: 'Scheduled task created', log: 'Security', desc: 'A scheduled task was created. Needs the relevant audit subcategory.', watch: 'Tasks running scripts with familiar-looking names.', limit: 'Legitimate software creates tasks too.' },
  { id: '4104', name: 'PowerShell script block logged', log: 'PowerShell/Operational', desc: 'Records script content when script block logging is enabled.', watch: 'Obfuscated or download-and-execute logic.', limit: 'Must be enabled; scripts can be large.' }]
export const WIN_CONCEPTS = [
  { t: 'Centralized logging', b: 'Forward Security, System and PowerShell logs (for example with Windows Event Forwarding or an agent) so an attacker cannot erase the only copy and you can correlate across hosts.' },
  { t: 'PowerShell logging', b: 'Enable script block logging and module logging so executed script content is recorded. Pair with constrained execution where practical.' },
  { t: 'Least privilege and secure admin access', b: 'Remove local admin from users, use separate admin accounts, administer from hardened admin workstations, and use just-in-time elevation.' },
  { t: 'Lateral-movement detection', b: 'Correlate network logons (4624 type 3/10), explicit credentials (4648), new services (7045), and process creation (4688) across hosts. Single events are weak; sequences are strong.' },
  { t: 'Domain-controller hardening', b: 'Limit logons to Tier 0 admins, patch promptly, restrict network paths to the DC, audit directory changes, and monitor privileged group membership.' }]
export const WIN_SEQ = [
  { t: '02:11', line: '4625 x 60 for administrator from 10.20.4.17', say: 'Many failures from one workstation. Suggests guessing, but also check for a misconfigured service.' },
  { t: '02:14', line: '4624 type 3 administrator from 10.20.4.17', say: 'Success after failures from the same source: the key correlation.' },
  { t: '02:14', line: '4672 administrator: SeDebugPrivilege assigned', say: 'Expected for admins, but this logon came from a workstation, which is unusual.' },
  { t: '02:16', line: '7045 service "svc-upd1" installed, path C:\\Users\\Public\\upd.exe', say: 'A service running from a user-writable folder, installed right after the logon. Strong sign of remote execution or persistence.' }]
export const LINUX_CONCEPTS = [
  { t: 'Users, groups and sudo', b: 'Access is controlled by users, groups and file permissions. sudo grants specific commands to specific users and logs each use. Keep sudoers narrow.' },
  { t: 'SSH', b: 'Remote administration. Prefer key authentication, disable root login, restrict who can connect, and limit exposure to admin networks.' },
  { t: 'Authentication logs and journal', b: 'Authentication events go to /var/log/auth.log on Debian and Ubuntu or /var/log/secure on RHEL-style systems. The systemd journal (journalctl) holds service logs.' },
  { t: 'Linux audit (auditd)', b: 'Records configured system events such as process execution and file changes, giving rich detection data. Rules need tuning to manage volume.' },
  { t: 'Persistence and privilege-escalation signals', b: 'Look for new cron entries, new or altered systemd units, added authorized_keys, new users or sudoers lines, and unexpected setuid files.' },
  { t: 'Services and file permissions', b: 'Run services as unprivileged users, restrict writable paths, and use file integrity monitoring on critical files such as sshd_config and /etc/cron.d.' }]
export const LINUX_LOGS = [
  { line: 'sshd[1301]: Failed password for invalid user admin from 203.0.113.50 port 51122', say: 'A guess against a username that does not exist. One is noise; hundreds is a guessing attempt.', sus: true },
  { line: 'sshd[1388]: Accepted password for deploy from 203.0.113.50 port 51310', say: 'A password login from an external IP after failures: the correlation that matters.', sus: true },
  { line: 'sudo: deploy : TTY=pts/0 ; PWD=/home/deploy ; USER=root ; COMMAND=/bin/bash', say: 'A root shell via sudo. Check whether this account normally needs that.', sus: true },
  { line: 'useradd[1420]: new user: name=sysbackup, UID=1002', say: 'A new account shortly after a root shell suggests persistence.', sus: true },
  { line: 'CRON[912]: (root) CMD (/usr/local/bin/logrotate.sh)', say: 'A routine scheduled job from a known script. Normal baseline noise.', sus: false }]
export const SSH_HARDEN = [
  { s: 'PermitRootLogin no', w: 'Forces named accounts and sudo, so actions are attributable.' },
  { s: 'PasswordAuthentication no', w: 'Removes password guessing; requires keys.' },
  { s: 'PubkeyAuthentication yes', w: 'Enables key-based login.' },
  { s: 'MaxAuthTries 3', w: 'Limits guesses per connection.' },
  { s: 'AllowGroups ssh-admins', w: 'Only members of an approved group can log in.' }]
