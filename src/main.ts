import '@/assets/css/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';

import App from '@/App.vue';
import router from '@/router';
import '@/api/mock';
import { initStorage } from '@/utils/initStorage.ts';

initStorage();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount('#app');
