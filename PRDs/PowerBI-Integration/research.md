# Research: Power BI Integration

## Problem Framing

- [Transcript-backed] Enterprise customers repeatedly ask for easier ways to move CultureMonkey survey/lifecycle data into external BI workflows, instead of manual report extraction.
- [Transcript-backed] The strongest internal signal is not "Power BI" by name, but recurring asks for scheduled exports, external dashboard consumption, and lower manual effort.
- [Inferred from feature notes] `Data+Warehousing.doc` outlines a ClickHouse-centered architecture (JDBC/ODBC, file exports, streaming) that is compatible with Power BI-style integration needs.

## Evidence from Transcripts

- `01KH8EHKMJGQTZ6T9CMJXBRPVF` (Yahoo FR discussion, 2026-02-13): scheduled exports called out as a high-priority ask; explicit concern that customers want to move data to "some other place," while that option was not fully available yet. [Transcript-backed]
- `01KHXEKAEBEXHK0HQHW5HDX10E` (Yahoo implementation, 2026-02-23): enterprise pattern described as exporting CSV and using it in external dashboards/presentations; API-based pull was stated as unavailable at that point. [Transcript-backed]
- `01KFNEGECQXGC40V2R96ZE5CQH` (KAG weekly sync, 2026-01-29): customer explicitly pushed to reduce manual effort and improve exportability of chart/question-level data for leadership reporting. [Transcript-backed]
- `01KMHWX4486AP6W2SR5RSYJR2T` (URUS reporting, 2026-03-25): interim workaround was manual, filtered raw-data exports by segment; customer flagged that this can become "a lot of reports." [Transcript-backed]
- `01KFD9CZW1QGGXE3QF1BEFQXA6` (Yahoo implementation, 2026-01-27): anonymous lifecycle settings limited confidential/raw export paths for some roles, surfacing privacy-vs-reporting tradeoffs. [Transcript-backed]

No transcript in current `pulse/normalized/*.json` explicitly references "Power BI" by name. The evidence is strongest on export automation + external BI demand, which is a direct precursor signal. [Inferred]

## Evidence from Public Discussions

- [Public discussion] G2 public reviews for Qualtrics (4.4/5 from 459 reviews) include usability complaints relevant to BI/reporting self-serve, such as result navigation being "not intuitive" and learning-curve friction.
  - [https://www.g2.com/products/qualtrics-employee-experience/reviews](https://www.g2.com/products/qualtrics-employee-experience/reviews)
- [Public discussion] Qualtrics documentation shows broad export expectations in this category (CSV/TSV/XLSX/XML/SPSS, Tableau extension, API export formats), indicating buyers expect interoperability with downstream analytics tooling.
  - [https://www.qualtrics.com/support/survey-platform/data-and-analysis-module/data/download-data/export-formats/](https://www.qualtrics.com/support/survey-platform/data-and-analysis-module/data/download-data/export-formats/)

## Competitor Patterns

- [Public discussion] Qualtrics supports multiple downloadable formats and API-gated JSON/NDJSON exports.
  - [https://www.qualtrics.com/support/survey-platform/data-and-analysis-module/data/download-data/export-formats/](https://www.qualtrics.com/support/survey-platform/data-and-analysis-module/data/download-data/export-formats/)
- [Public discussion] Qualtrics ETL workflows support automated, recurring response extraction to chosen destinations; extraction is incremental ("since it last ran"), with SFTP/S3 loader patterns.
  - [https://www.qualtrics.com/support/survey-platform/actions-page/etl-workflows/data-extractor-tasks/extract-responses-from-a-survey-task/](https://www.qualtrics.com/support/survey-platform/actions-page/etl-workflows/data-extractor-tasks/extract-responses-from-a-survey-task/)
- [Public discussion] Qualtrics warns exported copies are no longer dynamic after upload, reinforcing the need for refresh/version semantics in integration design.
  - [https://www.qualtrics.com/support/survey-platform/actions-page/etl-workflows/data-extractor-tasks/extract-responses-from-a-survey-task/](https://www.qualtrics.com/support/survey-platform/actions-page/etl-workflows/data-extractor-tasks/extract-responses-from-a-survey-task/)
- [Public discussion] ClickHouse docs for Power BI recommend the native connector + DirectQuery path; ODBC path is called out as import-only, and Power BI Service requires gateway setup.
  - [https://clickhouse.com/docs/integrations/powerbi](https://clickhouse.com/docs/integrations/powerbi)
- [Public discussion] Microsoft Power BI refresh guidance emphasizes scheduling, on-demand refresh, gateway configuration, and incremental refresh for larger models.
  - [https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data](https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-data)

## Recurring Complaints or Workarounds

1. [Transcript-backed] Manual CSV/report exports are still used for quarterly or executive presentations.
2. [Transcript-backed] Teams ask for support-side raw-data pulls when in-product reporting paths are insufficient, which does not scale.
3. [Transcript-backed] Export usefulness depends on survey/question design; some non-rating survey setups produce weaker downstream metric exports.
4. [Transcript-backed] Scheduled export design must resolve count mismatches (added-to-survey date vs submitted date) to preserve trust in BI numbers.
5. [Public discussion] Even mature platforms with rich export surfaces still show usability friction, so "feature present" does not guarantee self-serve success.

## Confidence Rating

**Medium-High**

Reasoning:

- Strong multi-account transcript signal on scheduled export demand, external dashboard workflows, and manual-export pain.
- Existing internal architecture notes already point toward DW/export patterns compatible with Power BI integration.
- Capped below High because explicit public signal specifically naming "Power BI for engagement/lifecycle data" is limited in accessible public discussions; external evidence is mostly adjacent interoperability signal.

## Open Questions

1. What is V1 scope: Power BI pull (connector/direct query), CM push (scheduled files/API), or both?

Answer: CM Push - API
2. What is the canonical freshness key for incremental export windows (submission time vs ingest time vs assignment time)?  
Answer: submission time
3. What tenant isolation model should govern BI access: per-tenant users, row policies, masked views, or all three?  
Answer: All three
4. How should anonymous lifecycle datasets be transformed before external BI use to avoid identity leakage by low-response slices?  
Answer: The current product shows engagement scores based on demographics and driver-wise scores.
5. What are the export SLAs (latency, retry policy, backfill behavior, failure alerts)?  
Answer: - This is for devs to decide
6. Which format is primary for scale: CSV baseline or Parquet-first with BI-friendly schemas?  
Answer: - This is for devs to decide
7. Where does ownership sit: self-serve customer setup vs managed onboarding by CultureMonkey support/data team?  
Answer: self-serve customer setup