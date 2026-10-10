# Agent experiment retention

Discard experiment output by default. These rules apply to research, validation, documentation,
review, commits and delegated tasks. Instructions to preserve evidence or support reproducibility
do not authorize retaining raw captures.

- Keep measured comparisons, failures, limitations, decisions and reusable source/checks. Limit
  each new study to one report of at most 500 words plus a compact aggregate results table unless
  Whitney requests more detail. Link it from existing records instead of repeating findings or
  listing every attempt.
- Do not retain transcripts, per-run JSON, screenshots, logs, duplicate app/package snapshots,
  hash inventories, evidence manifests or obsolete replay scripts unless Whitney explicitly
  requests the specific artifacts. Do not move them into another durable archive.
- Run new experiments in temporary directories. Legacy standalone checkers can write ignored
  results beside their source; those results are still disposable. Ignoring files is not cleanup.
- Review temporary evidence before disposal. Review does not require committed captures or exact
  historical replay unless Whitney explicitly requires them. Delete disposable output after
  inspection and required review, before committing or declaring completion.
- Do not replace removed archives with deletion inventories, provenance maps or elaborate cleanup
  and review records. Keep the completion note brief.
- Before every commit, inspect generated file counts, sizes and large additions. Remove disposable
  material and verify cleanup, including ignored output. Pass these rules to delegated agents.

The completed experiment archives have been removed from the checkout and unpublished history.
Reports preserve the recorded findings, not a replayable evidence archive. Exact historical
replay and independent re-auditing of the discarded captures are no longer supported.

Production guidance and its package tests remain. See the
[adoption record](agent-guidance-proposal.md) for the wording improvements and verification.
