import { createApp } from 'vue';
import App from './App.vue';
import './index.scss';
import adapter from 'webrtc-adapter';

console.log(adapter.browserDetails.browser);

import router from './routes';
import { store, key } from './store';

createApp(App).use(router).use(store, key).mount('#app');
