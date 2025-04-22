# Data model

## Timestamps

Points in time are represented as the number of seconds since the Unix epoch
(1970-01-01 00:00:00 UTC).

## Species

Integers between 1 and 2 (both ends inclusive) represent a unique species. The
number 0 means 'other'.

- 1: Dog
- 2: Cat
- 0: Other

## Sex

- 1: Male
- 2: Female
- 3: Unknown
- 0: Indeterminate
