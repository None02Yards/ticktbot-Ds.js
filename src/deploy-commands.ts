
// src/deploy-commands.ts
import 'dotenv/config';                   // load your .env
import { registerCommands } from './loadCommands';

(async () => {
  try {
    console.log('🚀 Deploying slash commands...');
    await registerCommands();
    console.log('✅ Slash commands deployed!');
  } catch (err) {
    console.error('❌ Failed to deploy commands:', err);
    process.exit(1);
  }
})();
