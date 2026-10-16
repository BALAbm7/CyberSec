export const EMAIL_CONCEPTS = [
  { t: 'SMTP at a high level', b: 'Mail servers hand messages to each other over SMTP. The envelope sender (MAIL FROM, which becomes Return-Path) is separate from the visible From header, which is why they can differ.' },
  { t: 'SPF', b: 'The domain owner publishes which servers may send mail for the envelope domain. A receiver checks the sending IP against that list. SPF checks the envelope domain, not the visible From address.' },
  { t: 'DKIM', b: 'The sending server signs parts of the message; the receiver verifies the signature using a public key in DNS. It shows the message was not altered and was signed by a domain the signer controls.' },
  { t: 'DMARC', b: 'Ties SPF or DKIM to the visible From domain ("alignment") and tells receivers what to do on failure (none, quarantine, reject). It protects a domain from being spoofed, not recipients from every lookalike.' },
  { t: 'Spoofing and display-name impersonation', b: 'Spoofing forges a domain. Display-name impersonation uses a trusted name on an unrelated address. Lookalike domains are registered by the attacker, who can then pass SPF, DKIM and DMARC for their own domain.' },
  { t: 'Malicious URLs and attachments', b: 'Links lead to credential-harvesting pages or downloads. Macro-enabled documents and archives can launch code. Defenses: URL rewriting and detonation, attachment sandboxing, blocking risky file types.' },
  { t: 'Business email compromise (BEC)', b: 'Fraud using impersonation or a real compromised mailbox to redirect payments. Often has no malware or links, so signals include payment changes, urgency, and new Reply-To or inbox rules.' },
  { t: 'Why a pass does not mean safe', b: 'SPF, DKIM and DMARC prove which domain sent or signed the mail, not that the sender is trustworthy. Attackers use their own domains with valid records. Always check the domain itself, links, attachments, and context.' }]
export const RAW_HEADERS = `From: "Aegis Billing" <accounts@aegis-billing.example>
To: a.kumar@aegis.example
Return-Path: <bounce@mailer.aegis-billing.example>
Reply-To: payments-help@mail-secure.example
Subject: Action required: unpaid invoice 8841
Date: Mon, 02 Mar 2026 09:14:02 +0000
Received: from mailer.aegis-billing.example (host-45.dyn.example [203.0.113.45])
  by mx.aegis.example with ESMTPS; Mon, 02 Mar 2026 09:14:05 +0000
Authentication-Results: mx.aegis.example;
  spf=pass smtp.mailfrom=mailer.aegis-billing.example;
  dkim=pass header.d=aegis-billing.example;
  dmarc=pass header.from=aegis-billing.example`
export interface Indicator { id: string; group: string; label: string; value: string; sus: boolean; why: string }
export const INDICATORS: Indicator[] = [
  { id: 'from', group: 'Sender', label: 'Sender and recipient', value: 'From: "Aegis Billing" <accounts@aegis-billing.example> → a.kumar@aegis.example', sus: true, why: 'The display name looks internal but the domain is aegis-billing.example, not aegis.example. This is a lookalike domain.' },
  { id: 'rp', group: 'Sender', label: 'Return-Path', value: 'bounce@mailer.aegis-billing.example', sus: false, why: 'Consistent with the From domain, so it adds nothing by itself. The attacker owns this domain.' },
  { id: 'reply', group: 'Sender', label: 'Reply-To', value: 'payments-help@mail-secure.example', sus: true, why: 'Replies go to a different domain than the sender. A mismatch like this is common in payment-fraud and credential lures.' },
  { id: 'recv', group: 'Routing', label: 'Received header', value: 'mailer.aegis-billing.example [203.0.113.45] → mx.aegis.example', sus: false, why: 'One hop from a dynamic-looking host. Informational: it matches the SPF-authorized sender, so routing alone does not condemn it.' },
  { id: 'spf', group: 'Authentication', label: 'SPF', value: 'pass (smtp.mailfrom=mailer.aegis-billing.example)', sus: false, why: 'SPF passed for the attacker\'s own domain. It does not mean the mail is trustworthy.' },
  { id: 'dkim', group: 'Authentication', label: 'DKIM', value: 'pass (d=aegis-billing.example)', sus: false, why: 'Valid signature from the attacker\'s own domain: the message was not altered, but it says nothing about intent.' },
  { id: 'dmarc', group: 'Authentication', label: 'DMARC', value: 'pass (aligned with aegis-billing.example)', sus: false, why: 'Aligned because the attacker controls the whole domain. DMARC protects your own domain from spoofing, not you from lookalikes.' },
  { id: 'url', group: 'Content', label: 'URL reputation (synthetic)', value: 'https://aegis-billing.example/pay/8841 · domain registered 3 days ago · hosts a login form', sus: true, why: 'A newly registered domain with a credential form matches typical credential-phishing infrastructure. Nothing is fetched in this lab.' },
  { id: 'att', group: 'Content', label: 'Attachment metadata', value: 'Invoice_8841.docm · macro-enabled · 84 KB · sandbox verdict: suspicious', sus: true, why: 'An invoice sent as a macro-enabled document is a common malware delivery method. Nothing is downloaded or run here.' },
  { id: 'time', group: 'Timeline', label: 'Delivery and click timeline', value: '09:14 delivered · 09:20 link clicked by a.kumar · 09:21 attachment opened', sus: true, why: 'The user interacted within minutes, so this moves from a mail event to an endpoint and identity investigation.' }]
export const VERDICTS = [
  { id: 'mal', label: 'Malicious: phishing with a lure link and macro attachment', ok: true },
  { id: 'legit', label: 'Legitimate vendor invoice', ok: false },
  { id: 'spam', label: 'Harmless spam', ok: false }]
export const EMAIL_STEPS = ['Purge the message from all mailboxes and block the sender domain and URL', 'Identify everyone who clicked or opened the attachment', 'Investigate a.kumar\'s endpoint and sign-ins; reset credentials if entered', 'Review email, proxy and EDR telemetry together in the SIEM']
