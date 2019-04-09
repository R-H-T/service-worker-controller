const SERVICE_WORKER_FILE_PATH = '/sw.js';

const SERVICE_WORKER_STATE_INSTALLED = 'installed';

class ServiceWorkerController {
  constructor() {
    this.registerServiceWorker();
  }

  static init() {
    try {
      const controller = new ServiceWorkerController();
      if (controller) {
        return Promise.resolve(controller);
      }
      return Promise.reject(
        new Error(
          'Error starting a new instance of the ServiceWorkerController'
        )
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  registerServiceWorker() {
    const sw = navigator.serviceWorker;

    if (!sw) return;

    navigator.serviceWorker
      .register(SERVICE_WORKER_FILE_PATH)
      .then(reg => {
        if (!navigator.serviceWorker.controller) return;

        console.debug('Service Worker loaded');

        if (reg.waiting) {
          console.debug('Updated Service Worker waiting...');
          this.updateReady(reg.waiting);
          return;
        }

        if (reg.installing) {
          this.trackInstalling(reg.installing);
          return;
        }

        reg.addEventListener('updateFound', () => {
          this.trackInstalling(reg.installing);
        });
      })
      .catch(error => {
        throw new Error(`Failed to load Service Worker: ${error.message}`);
      });

    sw.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  trackInstalling(worker) {
    worker.addEventListener('statechange', () => {
      if (worker.state === SERVICE_WORKER_STATE_INSTALLED) {
        this.updateReady(worker);
      }
    });
  }

  updateReady(worker) {
    console.debug('Service Worker - Update ready');
  }
}

export default ServiceWorkerController;
