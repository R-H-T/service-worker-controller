# The Service Worker Controller Class
A custom controller for managing your Service Worker.

## Getting started

After including the files in your project, add the following lines to your project's root `index.js`-file:

```js
import { ServiceWorkerController } from 'src/controllers';

/*...*/

const init = async () => {
  /*...*/
  try {
      await ServiceWorkerController.init();
  } catch (error) {
      console.debug('Error:', error.message);
  }
  /*...*/
};
```

This will register the Service Worker you have specified in eg.: `public/sw.js`. Make sure this file is copied to your dist or/and build folders root path `/sw.js`. The `sw.js` file can be a blank file.

**By github.com/R-H-T** - ©2019
