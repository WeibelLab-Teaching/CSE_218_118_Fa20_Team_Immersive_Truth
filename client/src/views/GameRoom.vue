<template>
  <div ref="wrapper" class="game-room">
    <canvas ref="canvas" class="canvas"></canvas>
    <audio ref="audio" autoplay muted></audio>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';

import { useStore } from '../store';
import Game from '../../babylon_multiplayer/classes/game.js';
import { serverURL } from '../config';

const Manager = (window as any).io.Manager;

export default {
  name: 'GameRoom',
  setup() {
    const store = useStore();
    const canvas = ref(null);

    const isHost = store.state.host;
    const username = store.state.name;
    const roomId = store.state.roomId;
    const num_villagers = store.state.villagers;
    const num_mafia = store.state.mafias;
    const selfid = 1;
    onMounted(() => {
      var game = new Game(
        selfid,
        num_villagers,
        num_mafia,
        ['charlie', store.state.name, 'gamma', 'alpha', 'delta'],
        canvas.value
      );
      game.render();
    });

    // use socket.io as follows
    const io = new Manager(serverURL).socket('/');

    io.on('connect', () => {
      // do stuff when connected to the socket server
      io.emit('create room');
    });

    io.on('new player joined', (playerSocketId, username) => {});

    return {
      canvas,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';

.canvas {
  touch-action: none;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  min-height: -webkit-fill-available;
  height: -webkit-fill-available;
  width: 100vw;
}
</style>
