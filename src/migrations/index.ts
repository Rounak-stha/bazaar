import * as migration_20250830_061920 from './20250830_061920';

export const migrations = [
  {
    up: migration_20250830_061920.up,
    down: migration_20250830_061920.down,
    name: '20250830_061920'
  },
];
