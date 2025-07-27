import * as migration_20250727_095309 from './20250727_095309';

export const migrations = [
  {
    up: migration_20250727_095309.up,
    down: migration_20250727_095309.down,
    name: '20250727_095309'
  },
];
