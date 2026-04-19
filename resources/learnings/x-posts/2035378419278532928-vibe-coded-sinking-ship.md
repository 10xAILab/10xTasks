# X post: 20 pitfalls that sink vibe-coded apps

**Source:** https://x.com/i/status/2035378419278532928  
**Author:** Unknown (tweet text provided directly by user)  
**Date:** Mar 23, 2026

---

The post is a concise production-readiness checklist for AI-generated app code, grouped across security, reliability, and scalability.

## Security learnings

1. **Rate-limit API routes** to prevent abuse-driven cost spikes.
2. **Never store auth tokens in `localStorage`**; XSS turns it into account takeover at scale.
3. **Sanitize and validate all input**; injection attacks still apply to modern AI-built stacks.
4. **Do not expose API keys client-side**; treat frontend code as public by default.
5. **Verify Stripe webhook signatures**; webhook endpoints are otherwise trivially forgeable.
6. **Expire sessions and reset links**; long-lived credentials amplify breach impact.
7. **Enforce role checks on admin routes**; authenticated is not authorized.
8. **Set a strict CORS policy**; default-open cross-origin access expands attack surface.

## Reliability and operability learnings

9. **Add UI error boundaries** to avoid total white-screen failure on single-component crashes.
10. **Validate required env vars at startup** so misconfiguration fails fast and loud.
11. **Send emails asynchronously**; SMTP latency should not block request-response paths.
12. **Add production logging** so failures are diagnosable under real traffic.
13. **Expose health check endpoints** for monitoring and faster incident detection.

## Performance and scaling learnings

14. **Index high-query database fields** before growth; performance cliffs appear early.
15. **Paginate query results** to avoid memory blowups and long response times.
16. **Use DB connection pooling** to survive burst traffic without exhausting connections.
17. **Store media via object storage/CDN** rather than serving uploads directly from app servers.

## Engineering process learnings

18. **Define backup + restore strategy** before migrations or schema evolution.
19. **Treat AI-generated code as untrusted until reviewed** for security and runtime behavior.
20. **Use TypeScript (or equivalent static checks)** to catch confident-but-wrong AI output earlier in CI.
