import { createApp } from 'vue';
import App from "./App.vue";
import './style.css';
import { AccountGatewayHttp } from './gateway/AccountGateway';
import { AxiosAdapter, FetchAdapter } from './http/HttpClient';

const app = createApp(App);
const httpClient = new AxiosAdapter();
const accountGateway = new AccountGatewayHttp(httpClient);
app.provide("accountGateway", accountGateway);
app.mount('#app');
