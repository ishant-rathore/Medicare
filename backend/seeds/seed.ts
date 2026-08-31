/**
 * Medicare seed entrypoint.
 *
 * Intentionally contains no fabricated user or medication data.
 * Add deterministic development-only fixtures here only when an approved
 * database/test requirement exists. Never use production credentials or
 * real participant data in seeds.
 */

async function main(): Promise<void> {
  console.log('Medicare seed: no default data configured.');
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
