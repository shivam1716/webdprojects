# Parakh data manifest

## Used in this build
**India UPI district transactions** (`public/data/india/district_transactions.parquet`)
- 20,604 rows: state / district / quarter, transaction count and INR amount, 2018-Q1 to 2024-Q4
- Origin: the public India UPI ecosystem dataset (PhonePe Pulse, NPCI and RBI DBIE compiled),
  https://huggingface.co/datasets/prasad-gade05/india-upi-ecosystem-2018-2025 (CDLA-Permissive-2.0)
- Aggregate payment data. It is not merchant-level, has no customer reviews and no fraud labels.

## Not used (and why)
- Olist (Brazil): removed, the project is India-only.
- RBI Payment System Indicators and FinEE: not loaded in this build. They can be added as extra sources
  once the files are placed in `public/data/india_sources/`.
