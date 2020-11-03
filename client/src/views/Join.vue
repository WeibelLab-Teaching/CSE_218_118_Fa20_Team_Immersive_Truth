<template>
  <div class="join">
    <h1 class="logo" @click="router.push('/')">Mafia VR</h1>
    <p class="info">
      You are about to join a Mafia VR game room with the following room ID:
    </p>
    <p class="info">{{ roomID }}</p>
    <input
      type="text"
      class="name"
      placeholder="Please enter a name"
      v-model="name"
    />
    <button @click="join" :disabled="name.length === 0" class="button">
      Join
    </button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import socket from 'socket.io-client';

import { SOCKET_IO_SERVER } from '../config';

export default defineComponent({
  setup() {
    const router = useRouter();
    const href = window.location.href.split('/');
    const roomID = ref(href[href.length - 1]);
    const name = ref('');

    // connect to socket IO
    const io = socket(SOCKET_IO_SERVER);

    // function to join the specified room with username
    function join() {
      router.push(`/room/${roomID.value}/name/${name.value}`);
    }

    return { router, roomID, name, join };
  },
});
</script>

<style lang="scss" scoped>
.join {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  cursor: pointer;
  font-size: 3rem;
  margin-top: 20px;
  margin-bottom: 10px;
}

.info {
  margin: 10px;
}

.name {
  margin: 10px;
  padding: 5px 10px;
  font-size: 1.5rem;
}

.button {
  cursor: pointer;
  padding: 5px 10px;
  font-size: 1.15rem;
}
</style>
