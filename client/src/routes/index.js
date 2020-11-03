import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Join from '../views/Join.vue';
import Room from '../views/Room.vue';
import Rules from '../views/Rules.vue';
import Host from '../views/Host.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/join/:id', component: Join },
    { path: '/room/:roomId/name/:name', component: Room },
    { path: '/rules', component: Rules },
    { path: '/host', component: Host },
  ],
});
