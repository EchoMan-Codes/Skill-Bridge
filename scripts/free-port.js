// Frees port 5000 so the backend can start (avoids EADDRINUSE when running npm run dev)
const kill = require('kill-port');
kill(5000, 'tcp')
  .catch(() => {})
  .finally(() => process.exit(0));
