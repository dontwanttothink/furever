This document outlines the authentication mechanisms and security measures
implemented in the system.

## Requirements

Passwords must be between 8 and 50 characters long. Both ends of the range are
inclusive. Spaces are allowed except at the beginning and end.

At least three of the following must also be present:

- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- A special character (`!@#$%^&*()`)

## Hashing and Salting

Passwords are hashed using the `argon2id` algorithm with the following
parameters:

- A memory cost of 128 MiB.
- An iteration count of 5.
- A parallelism factor of 8.

The `argon2id` algorithm inherently provides key stretching to make brute-force
attacks computationally expensive.

A unique, cryptographically secure salt is generated for each password. The
salt:

- Is at least 256 bits in length to ensure sufficient entropy.
- Is generated using a cryptographically secure random number generator.
- Is stored alongside the hashed password to facilitate verification.

## Denial of Service Attacks

Because password verification is computationally expensive, we impose
limitations on login attempts.

Rate limiting is enforced on authentication endpoints to restrict the number of
requests from a single IP address within a specified time frame.

The time required before the $n$-th attempt is given by the Fibonacci sequence,
which grows exponentially. Its growth class is $\theta(\phi^{n})$.

$$
T(n) \approx F_n \approx \left\lfloor \frac{\varphi^{n - 1}}{\sqrt{5}} + 0.5
\right\rfloor
$$

Where $\varphi$ is the golden ratio, approximately 1.6.

Furthermore, account lockout mechanisms are triggered after a configurable
number of failed login attempts to discourage brute force attacks.
