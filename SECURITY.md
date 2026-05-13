# Security Policy

## Supported Versions

The `main` branch is the currently supported development line.

## Reporting a Vulnerability

Please do not open a public issue for a security vulnerability.

Report privately through GitHub Security Advisories for this repository, or contact the BonyanOSS maintainers through the official organization channels.

Include:

- Affected endpoint or module.
- Reproduction steps.
- Expected impact.
- Suggested fix, if known.

We aim to acknowledge valid reports quickly and publish a fix with a clear changelog entry.

## Scope

In scope:

- API behavior that can expose private infrastructure details.
- Denial-of-service risks in request validation, caching, fallback, or upstream calls.
- Dependency vulnerabilities that affect runtime behavior.

Out of scope:

- Upstream provider outages.
- Rate limits or blocks enforced by third-party sources.
- Reports requiring destructive testing against public infrastructure.
