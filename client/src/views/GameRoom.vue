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


export default {
  
  setup() {
    
    Subway.init();
    var Player1 = new Player('0','LeEagle');
    var Player2 = new Player('1', 'Lord Lerner');
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