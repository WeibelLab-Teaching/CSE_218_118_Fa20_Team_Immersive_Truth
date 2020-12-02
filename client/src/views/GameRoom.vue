<template>
  <div class="game-room">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import Game from '../../babylon_multiplayer/classes/game.js';

export default {
  name: 'GameRoom',
  setup() {
    const store = useStore();
    const canvas = ref(null);

    onMounted(() => {
      var game = new Game(2, ['charlie', 'gamma'], canvas.value);
      game.render();
    });

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
