import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Join from '../views/Join.vue';
import Rules from '../views/Rules.vue';
import Host from '../views/Host.vue';
import Name from '../views/Name.vue';
import Config from '../views/Config.vue';
import GameRoom from '../views/GameRoom.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/join', component: Join },
    { path: '/rules', component: Rules },
    { path: '/host', component: Host },
    { path: '/name', component: Name },
    { path: '/config', component: Config },
    { path: '/gameRoom', component: GameRoom },
  ],
});
