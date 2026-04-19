**Original link:** https://youtu.be/QVN55xqFrg0

**Brief description:** A walkthrough of replacing default Supabase auth emails with branded messages by wiring Lovable to Resend, buying and connecting a domain (Namecheap), adding DNS records, storing a Resend API key in Supabase Edge Function secrets, and using an Edge Function plus an Auth “Send Email” hook so sign-up and verification emails come from your domain.

### Introduction and stack (00:00 - 00:53)
The host previews custom templates, explains why default Supabase emails look unprofessional, and outlines using Perplexity to generate a Lovable prompt, then Lovable with Supabase for an app that uses email auth.

### Lovable prompt and Supabase connect (00:53 - 01:47)
They generate a Lovable prompt for a social app with authentication, create a Lovable project, connect an existing Supabase project, and let Lovable create a users table so sign-up works—but the outgoing mail is still generic Supabase mail.

### First sign-up and the problem (01:47 - 02:41)
They sign up with a test account and show the default Supabase email, arguing clients and users expect branding and a custom “from” address.

### Resend overview and buy domain (02:41 - 03:35)
Resend integrates with Lovable and sends mail from your domain. They buy a cheap domain on Namecheap to use as the sender identity.

### Attach domain to Lovable and Resend (03:35 - 04:28)
They add the domain under Lovable settings, then add the same domain in Resend and prepare to copy DNS records into Namecheap’s advanced DNS.

### DNS records (MX, TXT, DKIM, DMARC) (04:28 - 05:22)
They add Resend’s MX and TXT records in Namecheap (including a host tweak to `@` where needed) until Resend shows the domain as verified.

### API key in Supabase and Edge Function goal (05:22 - 06:16)
They create a Resend API key, save it as a secret on Supabase Edge Functions, and set up to add an Edge Function that sends verification email on sign-up.

### Edge Function + auth hook wiring (06:16 - 07:10)
They prompt Lovable to create an Edge Function for verification emails and redirect after confirm, then configure Supabase Auth “Send Email” hook with the function URL and generate hook secrets.

### Hook secret and end-to-end test (07:10 - 08:03)
They store the hook secret (without a `v1` prefix) in Edge Function secrets, run through sign-up again, and show the inbox receiving a branded “Connect Hive” style message from Resend.

### Wrap-up and use cases (08:03 - 08:57)
They confirm the flow uses Resend, note you can extend to password reset and invoices, and encourage subscribing and joining the host’s Skool community.
