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
    const toastEl = document.createElement('div');
    toastEl.style = 'position:fixed;z-index:9999;bottom:8px;right:8px;background-color:#333;color:white;border-radius:3px;display:flex;box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.5), 0px 1px 8px 5px rgba(126, 172, 255, 0.72);';
    const titleEl = document.createElement('h3');
    titleEl.innerText = 'A new version of this site is available';
    titleEl.style = 'padding:8px 26px';
    const buttonEl = document.createElement('button');
    buttonEl.innerText = 'Update now';
    buttonEl.style = 'padding: 16px 32px; background-color:#444;color:skyblue;border:none;font-weight:bold;font-size:18px;cursor:pointer;';
    buttonEl.onclick = e => {
      worker.postMessage(SERVICE_WORKER_ACTION_SKIP_WAITING);
      document.body.removeChild(toastEl);
    };
    [titleEl, buttonEl].forEach(el => {
      toastEl.appendChild(el);
    });
    document.body.appendChild(toastEl);
  }
}

export default ServiceWorkerController;
