/**
 * Seed script — populates all Supabase tables with realistic placeholder content
 * for a senior Data / AI Architect portfolio.
 *
 * Idempotent:
 *  - personal_info / about: upsert via the existing row id (or insert if empty)
 *  - skills: delete-all then re-insert
 *  - experiences / projects: upsert by slug
 *
 * Run: pnpm seed
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local from project root
config({ path: resolve(process.cwd(), '.env.local') })

import { createAdminClient } from '../../lib/supabase/admin'
import type { ExperienceInsert, ProjectInsert } from '../../types/database'

const supabase = createAdminClient()

// ─── personal_info ────────────────────────────────────────────────────────────

async function seedPersonalInfo() {
  console.log('Seeding personal_info…')

  const data = {
    full_name: 'Jose Stalin Andrade Cartuche',
    headline: 'Data architect · AI architect · Data solution architect',
    tagline:
      'I design data platforms and AI systems that turn raw complexity into decisions at scale — from lakehouse foundations to production RAG pipelines.',
    email: 'jose@jstalin.dev',
    location: 'Vera, Spain',
    linkedin_url: 'https://linkedin.com/in/jstalin',
    github_url: 'https://github.com/jstalin',
    availability_status: 'AVAILABLE Q2 2026',
    hero_metrics: [
      { label: 'Years of experience', value: '8+' },
      { label: 'Projects delivered', value: '30+' },
      { label: 'Cloud certifications', value: '5' },
      { label: 'Production AI systems', value: '12' },
    ],
    updated_at: new Date().toISOString(),
  }

  // Check for an existing row
  const { data: existing } = await supabase
    .from('personal_info')
    .select('id')
    .limit(1)
    .single()

  if (existing?.id) {
    const { error } = await supabase
      .from('personal_info')
      .update(data)
      .eq('id', existing.id)
    if (error) throw new Error(`personal_info update: ${error.message}`)
  } else {
    const { error } = await supabase.from('personal_info').insert(data)
    if (error) throw new Error(`personal_info insert: ${error.message}`)
  }

  console.log('  personal_info done.')
}

// ─── about ───────────────────────────────────────────────────────────────────

async function seedAbout() {
  console.log('Seeding about…')

  const data = {
    content: `I am a data and AI architect with over eight years of experience designing and delivering data platforms, lakehouse architectures, and production AI systems across fintech, insurance, and e-commerce domains.

My work sits at the intersection of data engineering and applied AI. I have led teams building petabyte-scale lakehouses on Apache Iceberg, real-time fraud detection pipelines processing hundreds of thousands of events per second, and retrieval-augmented generation systems that ground LLM responses in proprietary knowledge bases — all with a sharp focus on reliability, cost efficiency, and maintainability.

I am pragmatic about technology choices: I reach for the right abstraction rather than the fashionable one, and I treat data infrastructure as a product with real users. Currently open to senior individual-contributor or staff-level architecture roles at companies where data is a genuine competitive advantage.`,
    quick_facts: [
      { label: 'Based in', value: 'Vera, Spain (CET)' },
      { label: 'Languages', value: 'Spanish (native), English (C1)' },
      { label: 'Open to', value: 'Remote / hybrid Europe' },
      { label: 'Preferred stack', value: 'AWS · Snowflake · dbt · Python' },
      { label: 'Currently exploring', value: 'Agentic AI, streaming lakehouses' },
    ],
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await supabase
    .from('about')
    .select('id')
    .limit(1)
    .single()

  if (existing?.id) {
    const { error } = await supabase
      .from('about')
      .update(data)
      .eq('id', existing.id)
    if (error) throw new Error(`about update: ${error.message}`)
  } else {
    const { error } = await supabase.from('about').insert(data)
    if (error) throw new Error(`about insert: ${error.message}`)
  }

  console.log('  about done.')
}

// ─── skills ───────────────────────────────────────────────────────────────────

async function seedSkills() {
  console.log('Seeding skills…')

  // Clear existing — re-insert to avoid duplicate drift
  const { error: deleteError } = await supabase
    .from('skills')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows

  if (deleteError) throw new Error(`skills delete: ${deleteError.message}`)

  const hardSkills: Array<{
    category: string
    name: string
    type: 'hard' | 'soft'
    level: number
    order: number
  }> = [
    // Cloud
    { category: 'Cloud', name: 'AWS', type: 'hard', level: 5, order: 0 },
    { category: 'Cloud', name: 'Azure', type: 'hard', level: 4, order: 1 },
    { category: 'Cloud', name: 'GCP', type: 'hard', level: 3, order: 2 },
    { category: 'Cloud', name: 'Snowflake', type: 'hard', level: 5, order: 3 },
    { category: 'Cloud', name: 'Databricks', type: 'hard', level: 4, order: 4 },
    // Data platforms
    { category: 'Data', name: 'dbt', type: 'hard', level: 5, order: 5 },
    { category: 'Data', name: 'Apache Airflow', type: 'hard', level: 5, order: 6 },
    { category: 'Data', name: 'Apache Kafka', type: 'hard', level: 4, order: 7 },
    { category: 'Data', name: 'Apache Spark', type: 'hard', level: 4, order: 8 },
    { category: 'Data', name: 'Apache Iceberg', type: 'hard', level: 4, order: 9 },
    // AI / ML
    { category: 'AI/ML', name: 'LangChain', type: 'hard', level: 4, order: 10 },
    { category: 'AI/ML', name: 'OpenAI API', type: 'hard', level: 5, order: 11 },
    { category: 'AI/ML', name: 'RAG pipelines', type: 'hard', level: 5, order: 12 },
    { category: 'AI/ML', name: 'Vector databases', type: 'hard', level: 4, order: 13 },
    { category: 'AI/ML', name: 'MLflow', type: 'hard', level: 4, order: 14 },
    // Languages
    { category: 'Languages', name: 'Python', type: 'hard', level: 5, order: 15 },
    { category: 'Languages', name: 'SQL', type: 'hard', level: 5, order: 16 },
    { category: 'Languages', name: 'TypeScript', type: 'hard', level: 4, order: 17 },
    { category: 'Languages', name: 'Scala', type: 'hard', level: 3, order: 18 },
    // Tools
    { category: 'Tools', name: 'Terraform', type: 'hard', level: 4, order: 19 },
    { category: 'Tools', name: 'Docker', type: 'hard', level: 5, order: 20 },
    { category: 'Tools', name: 'Kubernetes', type: 'hard', level: 3, order: 21 },
    { category: 'Tools', name: 'Git', type: 'hard', level: 5, order: 22 },
  ]

  const softSkills: Array<{
    category: string
    name: string
    type: 'hard' | 'soft'
    level: null
    order: number
  }> = [
    { category: 'Soft skills', name: 'Systems thinking', type: 'soft', level: null, order: 0 },
    { category: 'Soft skills', name: 'Technical leadership', type: 'soft', level: null, order: 1 },
    { category: 'Soft skills', name: 'Stakeholder communication', type: 'soft', level: null, order: 2 },
    { category: 'Soft skills', name: 'Async-first collaboration', type: 'soft', level: null, order: 3 },
    { category: 'Soft skills', name: 'Architectural trade-off analysis', type: 'soft', level: null, order: 4 },
    { category: 'Soft skills', name: 'Mentoring and code review', type: 'soft', level: null, order: 5 },
  ]

  const { error } = await supabase
    .from('skills')
    .insert([...hardSkills, ...softSkills])

  if (error) throw new Error(`skills insert: ${error.message}`)

  console.log(`  skills done (${hardSkills.length} hard + ${softSkills.length} soft).`)
}

// ─── experiences ─────────────────────────────────────────────────────────────

async function seedExperiences() {
  console.log('Seeding experiences…')

  const experiences: ExperienceInsert[] = [
    {
      slug: 'nordvik-data-lakehouse-architect',
      company: 'Nordvik Financial Group',
      role: 'Principal Data Architect',
      location: 'Remote (Amsterdam, NL)',
      start_date: '2022-03-01',
      end_date: null,
      summary:
        'Led the design and delivery of a petabyte-scale open lakehouse on AWS, replacing a fragmented warehouse estate and cutting analytical query latency by 70%.',
      full_content: `## Context

Nordvik Financial Group is a Nordic payments processor handling over €40 billion in annual transaction volume across 12 European markets. When I joined, the data estate consisted of five siloed data warehouses (two Redshift clusters, one Snowflake, one BigQuery sandbox, and a legacy on-premises Teradata) with no unified lineage, 400+ dbt models with undocumented dependencies, and a 36-hour SLA for regulatory reporting.

## Challenge

The immediate mandate was to consolidate the estate and reduce the time-to-insight for the risk and compliance teams from 36 hours to under four. The underlying challenge was harder: each business unit owned its own warehouse and resisted centralisation, so the architecture had to be federated by design — shared storage and compute separation, independent transformation ownership.

## Architectural decisions

I proposed and built an open lakehouse on Apache Iceberg (storage on S3, query engines via Athena for ad-hoc and Spark on EMR for batch), with Snowflake retained as the serving layer for dashboards. Key decisions:

- **Medallion architecture with clear ownership contracts**: raw (bronze) ingested by a shared platform team; silver and gold owned by domain teams via isolated dbt projects in a monorepo.
- **Apache Kafka for real-time ingestion**: replaced overnight SFTP drops with sub-minute CDC from core banking via Debezium → Kafka → Iceberg compaction jobs.
- **dbt-core + Airflow for orchestration**: migrated all 400+ models to a modular monorepo with CI-enforced contracts, reducing broken-pipeline incidents from 12/month to 1.
- **Column-level lineage via OpenLineage + Marquez**: gave compliance the audit trail for DORA and PSD2 without custom tooling.

## Outcomes

- Regulatory reporting SLA: 36 hours → 3.5 hours.
- Analytical query p95 latency: 45 seconds → 12 seconds.
- Infrastructure cost: -28% YoY after right-sizing EMR clusters and enabling Iceberg compaction.
- Team: grew the platform squad from 4 to 11 engineers; introduced RFC process for architectural decisions.`,
      tech_stack: [
        'AWS', 'Apache Iceberg', 'Apache Kafka', 'Apache Spark', 'dbt',
        'Apache Airflow', 'Snowflake', 'Terraform', 'Python', 'OpenLineage',
      ],
      order: 0,
    },
    {
      slug: 'velantis-genai-platform-lead',
      company: 'Velantis Insurance',
      role: 'AI Platform Lead',
      location: 'Remote (Madrid, ES)',
      start_date: '2020-06-01',
      end_date: '2022-02-28',
      summary:
        'Built the company\'s first GenAI platform — a retrieval-augmented generation system grounding LLM responses in proprietary policy documents — serving 3,000 internal users.',
      full_content: `## Context

Velantis Insurance is a mid-size Spanish insurer with a 60-year-old product catalogue. Customer service agents spent an average of 11 minutes per call locating the correct clause across 2,000+ policy documents stored as PDFs. The AI team was a greenfield hire: I was employee #1.

## Challenge

The task was to design an AI-assisted knowledge retrieval system that could answer natural-language questions about policy coverage with source citations, in under five seconds, with accuracy high enough for agent use (we set the bar at <2% harmful hallucinations). Budget was constrained: no GPU cluster, no proprietary LLM fine-tuning.

## Architectural decisions

I designed a retrieval-augmented generation (RAG) pipeline using OpenAI GPT-4 as the generation backbone and Pinecone as the vector store:

- **Document processing pipeline**: Apache Airflow DAG running weekly — PDF extraction via pdfminer, chunking with sliding windows (512 tokens, 10% overlap), embedding via text-embedding-3-large, upsert to Pinecone with metadata (policy_id, effective_date, clause_ref).
- **Query pipeline**: user query → embedding → top-8 Pinecone retrieval → re-ranking with a cross-encoder (ms-marco-MiniLM) → GPT-4 with system prompt enforcing citation format.
- **Evaluation framework**: built an offline evaluation harness using a manually curated golden set of 200 QA pairs; tracked answer relevance (RAGAS), faithfulness, and context precision in MLflow. Ran on every prompt or retrieval change.
- **Guardrails**: NeMo Guardrails for off-topic deflection; source citation required in every response (hallucination rate fell to 0.8%).

## Outcomes

- Average handle time: 11 minutes → 6.5 minutes (-41%).
- Agent satisfaction score: 3.1 → 4.6 / 5.
- Hallucination rate on golden set: 0.8% (below the 2% target).
- System adopted by 3,000 agents across 4 contact centres within 6 months of launch.`,
      tech_stack: [
        'OpenAI API', 'Pinecone', 'LangChain', 'Apache Airflow', 'Python',
        'MLflow', 'FastAPI', 'Docker', 'AWS ECS', 'PostgreSQL',
      ],
      order: 1,
    },
    {
      slug: 'crestline-data-engineering-manager',
      company: 'Crestline Commerce',
      role: 'Data Engineering Manager',
      location: 'On-site (Barcelona, ES)',
      start_date: '2018-01-01',
      end_date: '2020-05-31',
      summary:
        'Managed a team of 8 data engineers, migrated a monolithic Oracle DW to Snowflake, and introduced dbt + Airflow as the standard transformation and orchestration stack.',
      full_content: `## Context

Crestline Commerce is a pan-European e-commerce platform (fashion vertical, €600M GMV). The data team I inherited relied entirely on a single Oracle Data Warehouse and a tangle of stored procedures that no one fully understood. ETL jobs ran nightly from 23:00 to 09:00; any failure silently nulled out the morning reports.

## Challenge

Three problems demanded simultaneous attention: (1) the DW was running at 94% storage capacity with no budget to scale Oracle further; (2) the analytics team needed near-real-time order and inventory data for personalisation; (3) four engineers were planning to leave — morale was low after years of on-call firefighting.

## What I did

**Migration architecture**: designed a phased migration from Oracle to Snowflake using Fivetran for historical backfill and custom Python connectors for Oracle sources without native Fivetran support. Ran dual-write for 3 months with automated reconciliation checks.

**Transformation modernisation**: replaced 800+ stored procedures with a dbt project. Introduced testing (not_null, unique, accepted_values) on every model; blocked merges that reduced test coverage below 90%.

**Real-time layer**: introduced Kafka for order events, feeding a Snowflake Dynamic Table for the personalisation team, reducing their data freshness from 8 hours to under 3 minutes.

**Team**: promoted two senior engineers to tech leads, introduced bi-weekly architecture reviews, and reduced on-call incidents by 65% in 6 months through better observability (Monte Carlo for data quality, PagerDuty).

## Outcomes

- Migration completed 2 weeks ahead of schedule with zero data loss validated by reconciliation reports.
- Morning report availability: 09:15 → 07:00 (before business opens).
- All four engineers at risk of leaving stayed through the end of the migration.`,
      tech_stack: [
        'Snowflake', 'dbt', 'Apache Kafka', 'Apache Airflow', 'Python',
        'Fivetran', 'Oracle', 'Terraform', 'Monte Carlo', 'AWS',
      ],
      order: 2,
    },
    {
      slug: 'axiom-analytics-data-engineer',
      company: 'Axiom Analytics',
      role: 'Senior Data Engineer',
      location: 'On-site (Seville, ES)',
      start_date: '2016-04-01',
      end_date: '2017-12-31',
      summary:
        'Built end-to-end data pipelines for a marketing analytics SaaS, delivering multi-touch attribution models running on BigQuery Scheduled Queries and Airflow.',
      full_content: `## Context

Axiom Analytics provided white-label marketing analytics to 80+ SME clients in Spain and Portugal. I joined as the second data engineer to productionise a prototype attribution engine that the data science team had built in Jupyter notebooks.

## What I did

Refactored the attribution notebooks into a modular Python package, deployed as an Airflow DAG on Cloud Composer. Each client's data was partitioned in BigQuery by client_id with column-level access controls. Built a lightweight dbt layer for standardised marketing metrics (CAC, ROAS, LTV) shared across all client schemas.

Introduced automated SLA monitoring: if a client's pipeline missed its 06:00 delivery window, PagerDuty fired before the client noticed. Reduced SLA breaches from ~8/month to 0 over a 6-month window.

## Outcomes

- Attribution model latency: 4 hours → 22 minutes.
- SLA breaches: 8/month → 0 over the final 6 months.
- Codebase went from 3,000 lines of notebook cells to a tested, documented Python package with 87% test coverage.`,
      tech_stack: [
        'BigQuery', 'Apache Airflow', 'Python', 'dbt', 'GCP',
        'Cloud Composer', 'Terraform', 'PostgreSQL',
      ],
      order: 3,
    },
  ]

  for (const exp of experiences) {
    const { error } = await supabase
      .from('experiences')
      .upsert(exp, { onConflict: 'slug' })

    if (error) throw new Error(`experiences upsert (${exp.slug}): ${error.message}`)
  }

  console.log(`  experiences done (${experiences.length} entries).`)
}

// ─── projects ────────────────────────────────────────────────────────────────

async function seedProjects() {
  console.log('Seeding projects…')

  const projects: ProjectInsert[] = [
    {
      slug: 'rag-policy-knowledge-platform',
      title: 'RAG policy knowledge platform',
      summary:
        'Production retrieval-augmented generation system grounding GPT-4 responses in 2,000+ proprietary insurance policy documents. Reduced agent handle time by 41%.',
      full_content: `## Problem

Insurance agents spent 11 minutes per call locating policy clauses across a fragmented document store of 2,000+ PDFs. Existing keyword search returned too many results with no ranking or citation.

## Architecture

A two-stage RAG pipeline: an offline ingestion pipeline and an online query pipeline.

**Ingestion (Airflow, weekly)**: PDF text extraction → sliding-window chunking (512 tokens, 10% overlap) → OpenAI text-embedding-3-large → upsert to Pinecone with structured metadata (policy_id, effective_date, clause_type).

**Query (FastAPI, real-time)**: user query → embedding → top-8 Pinecone ANN retrieval → cross-encoder re-ranking (ms-marco-MiniLM) → GPT-4 generation with strict citation prompt → structured JSON response with source refs.

**Evaluation**: offline RAGAS harness against 200 manually labelled QA pairs, tracked in MLflow. Every prompt or retrieval config change required evaluation before deployment.

## Results

- Answer faithfulness: 99.2% (0.8% hallucination rate on golden set).
- Agent handle time: -41% (11 min → 6.5 min).
- p95 query latency: 4.2 seconds end-to-end.`,
      tech_stack: [
        'OpenAI API', 'Pinecone', 'LangChain', 'FastAPI', 'Apache Airflow',
        'Python', 'MLflow', 'Docker', 'AWS ECS', 'PostgreSQL',
      ],
      github_url: null,
      demo_url: null,
      images: [],
      order: 0,
    },
    {
      slug: 'real-time-fraud-detection-lakehouse',
      title: 'Real-time fraud detection lakehouse',
      summary:
        'Streaming lakehouse on Apache Iceberg + Kafka processing 180K events/sec for a European payments processor, feeding ML fraud scores back to the transaction engine in under 200ms.',
      full_content: `## Problem

A payments processor was detecting fraud using a nightly batch job — by morning, €2M+ in fraudulent transactions had already been processed and reversed. The SLA target was a fraud score delivered to the transaction engine within 200ms of event ingestion.

## Architecture

**Ingestion**: Debezium CDC from core banking PostgreSQL → Kafka (MSK) → Flink consumer writing raw events to Iceberg on S3 (bronze layer). Throughput: 180,000 events/second at peak.

**Feature pipeline**: Flink stateful operators computing 48 real-time features per transaction (velocity checks, geo-anomaly, merchant risk score) with 30-day sliding windows materialised in Iceberg snapshots.

**Scoring**: online feature store (Redis) populated from the Flink pipeline; XGBoost model served via FastAPI on ECS; model artefacts versioned in MLflow, promoted via a shadow-mode A/B framework before production cutover.

**Feedback loop**: fraud labels from the chargeback system written back via Kafka → Iceberg gold layer → weekly model retraining Airflow DAG.

## Results

- Fraud detection latency: batch (8+ hours) → 180ms p95.
- Fraud loss rate: -23% in first 90 days post-launch.
- False positive rate: 0.4% (below the 0.5% SLA target).
- System handles Black Friday peaks (3x normal throughput) with no horizontal scaling changes.`,
      tech_stack: [
        'Apache Kafka', 'Apache Flink', 'Apache Iceberg', 'AWS', 'Redis',
        'XGBoost', 'MLflow', 'FastAPI', 'Python', 'Terraform', 'Debezium',
      ],
      github_url: null,
      demo_url: null,
      images: [],
      order: 1,
    },
    {
      slug: 'genai-evaluation-framework',
      title: 'GenAI evaluation framework',
      summary:
        'Open-source-style offline evaluation harness for RAG and LLM systems. Tracks answer relevance, faithfulness, context precision, and hallucination rate across prompt and retrieval config changes.',
      full_content: `## Problem

AI teams building RAG systems had no systematic way to measure whether a prompt change, a different chunk size, or a new retrieval model actually improved quality — or just felt better in ad-hoc testing. Regressions were caught in production, not in CI.

## What I built

A Python evaluation library and CLI with three components:

**Golden set management**: YAML-based QA pair definition with expected answers, source chunk IDs, and metadata tags. Versioned in Git alongside the application code.

**Metric suite**: implemented RAGAS metrics (answer relevance, faithfulness, context precision, context recall) plus a custom hallucination detector using an LLM judge with structured output; all metrics logged to MLflow as nested runs.

**CI integration**: GitHub Actions workflow runs the full evaluation on every PR that touches prompt templates, retrieval config, or embedding models. PR is blocked if faithfulness drops below the configured threshold (default: 97%).

## Results

Used across three production RAG systems. Caught 4 prompt regressions before deployment in the first two months. Reduced the hallucination debugging cycle from days to hours.`,
      tech_stack: [
        'Python', 'MLflow', 'OpenAI API', 'LangChain', 'RAGAS',
        'GitHub Actions', 'Docker', 'PostgreSQL',
      ],
      github_url: 'https://github.com/jstalin/genai-eval',
      demo_url: null,
      images: [],
      order: 2,
    },
    {
      slug: 'open-lakehouse-migration-toolkit',
      title: 'Open lakehouse migration toolkit',
      summary:
        'Internal tool for migrating from Snowflake / BigQuery to Apache Iceberg on S3, including schema inference, partition mapping, and reconciliation reports.',
      full_content: `## Problem

Every lakehouse migration project I ran required the same manual steps: extract schema from the source warehouse, map partition strategies to Iceberg partition specs, run a reconciliation query after load to validate row counts and key statistics. This took 1-2 weeks per project.

## What I built

A Python CLI tool that automates the repetitive steps:

**Schema extraction**: connectors for Snowflake, BigQuery, Redshift, and Delta Lake; outputs a normalised schema manifest (JSON) with column types, constraints, and partition specs.

**Partition mapping**: rule engine that maps source partition expressions (e.g. Snowflake CLUSTER BY) to Iceberg partition transforms (identity, bucket, truncate, year/month/day/hour).

**Load orchestration**: Spark job templates (PySpark) generated from the schema manifest, with configurable write mode (snapshot, overwrite, append) and Iceberg table properties.

**Reconciliation**: after load, runs a configurable set of checks (row count, null rate, min/max per numeric column, sample hash comparison) and produces a pass/fail HTML report.

## Results

Reduced migration project setup time from 1-2 weeks to 1-2 days across four production migrations. The schema extraction module is now used independently by two other teams for documentation generation.`,
      tech_stack: [
        'Python', 'Apache Iceberg', 'Apache Spark', 'Snowflake', 'BigQuery',
        'AWS S3', 'Terraform', 'Click', 'Jinja2',
      ],
      github_url: null,
      demo_url: null,
      images: [],
      order: 3,
    },
    {
      slug: 'dbt-lineage-impact-analyzer',
      title: 'dbt lineage impact analyzer',
      summary:
        'CLI tool that parses dbt manifest.json to produce a human-readable impact report for any model change, showing all downstream dependents and their SLA tiers.',
      full_content: `## Problem

In a dbt monorepo with 400+ models, engineers had no quick way to understand the blast radius of a change before opening a PR. A breaking change to a widely-used staging model could cascade to 80+ downstream models and 12 dashboards.

## What I built

A Python CLI that takes a dbt manifest.json and a list of changed model names, then produces:

- **Lineage graph**: directed acyclic graph rendered as a compact text tree or exported as JSON/DOT format for Graphviz.
- **Impact tiers**: models annotated with their SLA tier (real-time, hourly, daily, best-effort) from a YAML config file; output grouped by tier so engineers know which failures are business-critical.
- **Exposure linkage**: shows which dbt exposures (dashboards, ML features, downstream APIs) depend on each changed model.
- **CI integration**: runs in GitHub Actions on every PR; adds a comment with the impact summary if the blast radius exceeds a configurable threshold (default: 10 downstream models).

## Results

Adopted by both data engineering and analytics engineering teams within a week of release. Blocked two high-impact breaking changes from reaching production in the first month.`,
      tech_stack: [
        'Python', 'dbt', 'GitHub Actions', 'Click', 'NetworkX', 'Jinja2',
      ],
      github_url: 'https://github.com/jstalin/dbt-impact',
      demo_url: null,
      images: [],
      order: 4,
    },
  ]

  for (const project of projects) {
    const { error } = await supabase
      .from('projects')
      .upsert(project, { onConflict: 'slug' })

    if (error) throw new Error(`projects upsert (${project.slug}): ${error.message}`)
  }

  console.log(`  projects done (${projects.length} entries).`)
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nStarting seed…\n')

  try {
    await seedPersonalInfo()
    await seedAbout()
    await seedSkills()
    await seedExperiences()
    await seedProjects()

    console.log('\nSeed complete.\n')
    process.exit(0)
  } catch (err) {
    console.error('\nSeed failed:', err)
    process.exit(1)
  }
}

main()
