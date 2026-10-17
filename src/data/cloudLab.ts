export interface Item { t: string; b: string }
export const CLOUD_SHARED: Item[] = [
  { t: 'Shared responsibility', b: 'The provider secures the underlying infrastructure; you secure identities, data, configuration, and (depending on service type) operating systems and applications.' },
  { t: 'Identity and least privilege', b: 'Most cloud breaches involve identity. Grant narrow roles, prefer short-lived credentials, require MFA, and review unused permissions.' },
  { t: 'Public storage exposure', b: 'Storage buckets or containers can be made public by policy mistakes. Block public access by default and alert on policy changes.' },
  { t: 'Secrets and key management', b: 'Keep secrets in a managed vault, rotate them, and never place them in code. Use managed keys with tight access and audit.' },
  { t: 'Network segmentation', b: 'Use private subnets, restrictive security groups or NSGs, and private endpoints so workloads are not reachable or able to call out freely.' },
  { t: 'Audit logs', b: 'Control-plane logs record who did what in the account. Enable them everywhere, protect them from deletion, and forward them to monitoring.' },
  { t: 'Posture and workload protection', b: 'CSPM finds misconfigurations; CWPP protects running workloads. They complement, not replace, logging and detection.' },
  { t: 'Infrastructure as Code security', b: 'Scan templates before deployment so insecure settings are caught early, and restrict who can change pipelines.' },
  { t: 'Containers and Kubernetes', b: 'Use minimal images, scan them, run as non-root, restrict the API server and dashboard, apply network policies, and manage secrets properly.' },
  { t: 'Cloud incident response', b: 'Contain by revoking credentials and sessions, restricting network access, and snapshotting evidence. Preserve logs before changing resources.' }]
export const AWS: Item[] = [
  { t: 'IAM', b: 'Users, roles and policies. Prefer roles with temporary credentials; avoid wildcard permissions and long-lived access keys.' },
  { t: 'CloudTrail', b: 'Records AWS API activity (who called what, from where). The primary source for investigating account activity.' },
  { t: 'GuardDuty', b: 'A threat-detection service that analyzes sources such as CloudTrail, VPC Flow Logs and DNS logs to raise findings.' },
  { t: 'Security Hub', b: 'Aggregates findings and runs posture checks across services and accounts for a central view.' },
  { t: 'VPC, security groups, Flow Logs', b: 'Private networking with stateful allow rules. VPC Flow Logs capture IP traffic metadata for investigation.' },
  { t: 'S3 access controls', b: 'Bucket policies, ACLs and Block Public Access. Enable Block Public Access and review policies.' },
  { t: 'KMS and Secrets Manager', b: 'KMS manages encryption keys; Secrets Manager stores and rotates credentials. Restrict who can use or read them.' }]
export const AZURE: Item[] = [
  { t: 'Microsoft Entra ID', b: 'Cloud identity: sign-in, MFA, conditional access, role assignments. Review sign-in and audit logs.' },
  { t: 'Azure Activity Log', b: 'Subscription-level control-plane events: who created, changed or deleted resources.' },
  { t: 'Azure Monitor', b: 'Collects metrics and logs, and routes diagnostic data to analytics and alerting.' },
  { t: 'Microsoft Defender for Cloud', b: 'Posture recommendations and workload protection alerts for Azure and other clouds.' },
  { t: 'Microsoft Sentinel', b: 'A cloud-native SIEM and SOAR for collecting data, detecting threats, and running investigations.' },
  { t: 'Virtual networks and NSGs', b: 'Private networks with network security group rules controlling traffic by source, destination, and port.' },
  { t: 'Key Vault and managed identities', b: 'Key Vault stores keys and secrets. Managed identities let workloads authenticate without stored credentials.' }]
export interface Incident { id: string; name: string; log: string; steps: string[]; controls: string[] }
export const INCIDENTS: Incident[] = [
  { id: 'iam', name: 'Overly permissive identity', log: '04:02Z iam AttachRolePolicy role=build-bot policy=AdministratorAccess actor=j.mehta src=203.0.113.77', steps: ['Identify who attached the policy and from where', 'Check what the role did since', 'Compare to the approved change'], controls: ['Least-privilege roles', 'Alert on admin-policy attachment', 'Permission boundaries'] },
  { id: 'storage', name: 'Exposed storage resource', log: '04:14Z s3 PutBucketPolicy bucket=aegis-reports principal=* action=s3:GetObject actor=j.mehta', steps: ['Confirm the bucket is publicly readable', 'Review access logs for outside reads', 'Classify the data inside'], controls: ['Block Public Access', 'CSPM alert on public buckets', 'Data classification'] },
  { id: 'api', name: 'Unexpected API activity pattern', log: '04:12Z ListBuckets, ListUsers, GetAccountAuthorizationDetails (x1 each) actor=build-bot src=203.0.113.77', steps: ['Check whether the role normally makes these calls', 'Look at the source IP and user agent', 'Review activity in the next hour'], controls: ['GuardDuty or Defender findings', 'Baseline per role', 'Network conditions on credentials'] },
  { id: 'key', name: 'Suspicious access-key use', log: '04:30Z iam CreateAccessKey user=j.mehta new_key=AKIA...EXAMPLE src=203.0.113.77 mfa=false', steps: ['Disable the new key', 'Find every call made with it', 'Rotate the user credentials'], controls: ['Short-lived credentials', 'Key age and usage monitoring', 'MFA enforcement'] },
  { id: 'dest', name: 'Workload talking to an unexpected destination', log: '04:40Z vpcflow src=10.50.1.12 dst=203.0.113.50 dstport=4444 bytes=312MB action=ACCEPT', steps: ['Identify the instance and its owner', 'Check recent changes and logins', 'Capture evidence, then restrict egress'], controls: ['Egress filtering', 'Flow log analytics', 'Workload protection'] }]
export const CLOUD_NOTE = 'These are examples of platform services. Availability, features, and licensing vary by service and configuration. All logs here are synthetic; no cloud account is contacted.'
