import '@/assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import { configure } from 'vee-validate';

import App from '@/App.vue';
import router from '@/router';
import '@/api/mock';
import { initStorage } from '@/utils/initStorage.ts';

initStorage();
configure({ validateOnBlur: true, validateOnChange: false, validateOnInput: false, validateOnModelUpdate: false });

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

app.mount('#app');
