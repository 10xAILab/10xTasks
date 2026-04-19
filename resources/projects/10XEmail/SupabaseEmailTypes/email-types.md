# Supabase auth email types in Supa Tools (Auth Email Designer)

Source: template metadata embedded in [Supa Tools](https://www.supa-tools.com/auth-emails) client bundle (`index-D-3cS9fN.js`). The designer covers **14** Supabase auth / notification templates:

| `type` (key) | Display name | Purpose |
|--------------|----------------|---------|
| `confirmation` | Confirm signup | Verify new user registration |
| `invite` | Invite user | Invite users to join |
| `magic_link` | Magic Link | Passwordless login |
| `email_change` | Change Email Address | Confirm email address change |
| `recovery` | Reset Password | Password reset |
| `reauthentication` | Reauthentication | Re-authenticate the user |
| `otp_token` | OTP Token | One-time password for verification |
| `password_changed` | Password Changed | Notify on password change |
| `email_address_changed` | Email Address Changed | Notify on email change |
| `phone_number_changed` | Phone Number Changed | Notify on phone change |
| `identity_linked` | Identity Linked | Notify when an IdP is linked |
| `identity_unlinked` | Identity Unlinked | Notify when an IdP is unlinked |
| `mfa_method_added` | MFA Method Added | Notify when MFA is added |
| `mfa_method_removed` | MFA Method Removed | Notify when MFA is removed |

**Note:** The marketing site also describes a visual editor with live preview, dark mode, export, link validation, etc.; the list above is the **email kinds** the tool can design against.
