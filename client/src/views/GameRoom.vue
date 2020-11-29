<template>
  <div>
  </div>
</template>

<script>
import { ref } from "vue";
import Subway from "../../babylon_multiplayer/classes/subway.js"
import Avatar from "../../babylon_multiplayer/classes/avatar.js"
import Billboard from "../../babylon_multiplayer/classes/billboard.js"
import Player from "../../babylon_multiplayer/classes/player.js"
import { useStore } from '../store';
import { computed } from 'vue';
import Game from '../../babylon_multiplayer/classes/game.js'

export default {
  
  setup() {
    const store = useStore()
    var game = new Game(2, ['charlie', 'gamma'])
    game.render()
  }
};
</script>

<style lang="scss" scoped>
html,
body {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>