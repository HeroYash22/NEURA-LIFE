# Google OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│          │         │          │         │          │         │          │
│   USER   │         │ FRONTEND │         │ BACKEND  │         │  GOOGLE  │
│          │         │          │         │          │         │          │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. Click Google    │                    │                    │
     │    Sign In         │                    │                    │
     │─────────────────>  │                    │                    │
     │                    │                    │                    │
     │                    │ 2. Redirect to     │                    │
     │                    │    /auth/google/   │                    │
     │                    │    login           │                    │
     │                    │─────────────────>  │                    │
     │                    │                    │                    │
     │                    │                    │ 3. Redirect to     │
     │                    │                    │    Google OAuth    │
     │                    │                    │─────────────────>  │
     │                    │                    │                    │
     │                    │                    │                    │
     │ 4. Google Login & Consent Screen        │                    │
     │ <─────────────────────────────────────────────────────────── │
     │                    │                    │                    │
     │ 5. User approves   │                    │                    │
     │─────────────────────────────────────────────────────────────>│
     │                    │                    │                    │
     │                    │                    │ 6. Auth code       │
     │                    │                    │ <──────────────────│
     │                    │                    │                    │
     │                    │                    │ 7. Exchange code   │
     │                    │                    │    for user info   │
     │                    │                    │─────────────────>  │
     │                    │                    │                    │
     │                    │                    │ 8. User info       │
     │                    │                    │    (email, name)   │
     │                    │                    │ <──────────────────│
     │                    │                    │                    │
     │                    │                    │ 9. Check/Create    │
     │                    │                    │    user in DB      │
     │                    │                    │ ─┐                 │
     │                    │                    │  │                 │
     │                    │                    │ <┘                 │
     │                    │                    │                    │
     │                    │                    │ 10. Generate JWT   │
     │                    │                    │     token          │
     │                    │                    │ ─┐                 │
     │                    │                    │  │                 │
     │                    │                    │ <┘                 │
     │                    │                    │                    │
     │                    │ 11. Redirect with  │                    │
     │                    │     token & user   │                    │
     │                    │ <──────────────────│                    │
     │                    │                    │                    │
     │                    │ 12. Save token &   │                    │
     │                    │     redirect to    │                    │
     │                    │     dashboard      │                    │
     │ <──────────────────│                    │                    │
     │                    │                    │                    │
     │ 13. Access         │                    │                    │
     │     Dashboard      │                    │                    │
     │ ✓ LOGGED IN        │                    │                    │
     │                    │                    │                    │

┌─────────────────────────────────────────────────────────────────────┐
│                            KEY POINTS                               │
├─────────────────────────────────────────────────────────────────────┤
│ • User never enters password on your site                          │
│ • Backend handles all OAuth communication                          │
│ • Frontend only receives final JWT token                           │
│ • Google verifies user identity                                    │
│ • Automatic account creation for new users                         │
│ • Secure token exchange via backend                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE LOGIC                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User email from Google                                             │
│          │                                                          │
│          ▼                                                          │
│   ┌──────────────┐                                                 │
│   │ Email exists │                                                 │
│   │  in users?   │                                                 │
│   └──┬────────┬──┘                                                 │
│      │ YES    │ NO                                                 │
│      ▼        ▼                                                    │
│   ┌─────┐  ┌──────────┐                                           │
│   │LOGIN│  │  CREATE  │                                           │
│   │USER │  │   NEW    │                                           │
│   │     │  │  ACCOUNT │                                           │
│   │     │  │          │                                           │
│   │     │  │ • Generate unique username                           │
│   │     │  │ • Save email & google_id                             │
│   │     │  │ • Random password (not used)                         │
│   │     │  │ • Default 5000 NeuraCoins                            │
│   └─────┘  └──────────┘                                           │
│      │          │                                                  │
│      └────┬─────┘                                                  │
│           ▼                                                        │
│    ┌─────────────┐                                                │
│    │ Generate JWT │                                                │
│    │    Token     │                                                │
│    └──────┬───────┘                                                │
│           │                                                        │
│           ▼                                                        │
│    Return to frontend                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         SECURITY FEATURES                           │
├─────────────────────────────────────────────────────────────────────┤
│ ✓ OAuth 2.0 standard protocol                                      │
│ ✓ CSRF protection with state parameter                             │
│ ✓ Backend-only token exchange (secure)                             │
│ ✓ HTTPS for production (required by Google)                        │
│ ✓ JWT tokens with expiration                                       │
│ ✓ No passwords stored for OAuth users                              │
│ ✓ Google handles authentication                                    │
│ ✓ Scoped permissions (only email & profile)                        │
└─────────────────────────────────────────────────────────────────────┘
```
