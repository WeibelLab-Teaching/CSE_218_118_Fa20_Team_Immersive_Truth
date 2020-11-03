<template>
  <div class="room">
    <p class="info">Room Number: {{ roomId }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import socket from 'socket.io-client';

import { SOCKET_IO_SERVER, PeerOptions } from '../config';

export default defineComponent({
  setup() {
    const peer = new Peer(undefined, PeerOptions);
    const route = useRoute();
    const io = socket(SOCKET_IO_SERVER);

    const { roomId, name } = route.params;

    peer.on('open', (userId) => {
      io.emit('join-room', roomId, name, userId);
    });

    return { roomId };
  },
});
</script>

<style lang="scss" scoped></style>
