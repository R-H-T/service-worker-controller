//
// The Service Worker
//

const SERVICE_WORKER_ACTION_SKIP_WAITING = 'skipWaiting';

self.addEventListener('message', async e => {
  if (e.data === SERVICE_WORKER_ACTION_SKIP_WAITING) self.skipWaiting();
});
