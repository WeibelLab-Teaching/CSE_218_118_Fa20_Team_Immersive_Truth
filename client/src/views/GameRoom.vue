<template>
  <div ref="wrapper" class="game-room">
    <!-- <div id="loadingScreen">Default Text</div> -->
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';

import { useStore } from '../store';
import Game from '../../babylon_multiplayer/classes/game.js';
import { serverURL, peerJsSignalingServerURL } from '../config';

const Manager = (window as any).io.Manager;
const Peer = (window as any).Peer;

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
    const selfid = 0;
    var game = null;
    const roomConfig = {
      villagerNum: num_villagers,
      mafiaNum: num_mafia,
    };

    // use socket.io as follows
    const io = new Manager(serverURL).socket('/');
    const villagerNum = store.state.villagers;
    const mafiaNum = store.state.mafias;
    var playerRole = null;
    var socketId = null;

    io.on('connect', () => {
      if (isHost) {
        io.emit('create room', roomConfig, roomId, username);
      } else {
        io.emit('join room', roomId, username);
      }
    });

    io.on('joined room', (role, playerSocketId) => {
      console.log('joined w id: ' + playerSocketId);
      playerRole = role;
      socketId = playerSocketId;

      //loading screen

      if (isHost) {
        game = new Game(num_villagers, num_mafia, canvas.value, io);

        game.addPlayer(playerSocketId, username, role, true, true);
        game.render();
      }
    });

    //for new players joining
    io.on('existing players', (existingPlayers) => {
      // console.log('in existing players');

      game = new Game(num_villagers, num_mafia, canvas.value, io);
      game.render();
      for (var i = 0; i < existingPlayers.length; i++) {
        game.addPlayer(
          existingPlayers[i].socketId,
          existingPlayers[i].username,
          existingPlayers[i].role,
          false,
          false
        );
      }
      game.addPlayer(socketId, username, playerRole, true, false);
    });

    // When a new player joins
    io.on('new player joined', (playerSocketId, username, role) => {
      //add a new player to game
      console.log('Adding: ' + role + ' ' + username);
      game.addPlayer(playerSocketId, username, role, false, false);
      //io.emit('game update', game);
    });

    //at end of night phase
    io.on('killed players', (killedPlayers) => {
      console.log(killedPlayers + ' were killed');
      game.removePlayers(killedPlayers);
    });

    //at end of day phase
    io.on('voted player', (votedPlayer) => {
      console.log(votedPlayer + ' was voted out');
      game.removePlayers([votedPlayer]);
    });

    // start of night phase
    io.on('night', () => {
      console.log('night time');
      store.commit('setDay', false);
      store.commit('setNight', true);
      game.subway.turnOffLights();
    });

    // start of day phase
    io.on('day', () => {
      console.log('day time');
      store.commit('setDay', true);
      store.commit('setNight', false);
      console.log(store.state.isDay);
      game.subway.turnOnLights();
    });

    // start of game
    io.on('start', () => {
      console.log('the game is starting');
    });

    //error handling
    io.on('error', (error) => {
      console.log(`Error: ${error}`);
    });

    // io.on('game ended', (winner) => {
    //   //do something on end
    //   // winner: 'mafia' || 'villager'
    // });

    // io.on('player disconnected', (socketId, username) => {
    //   //handle player leaving
    // });
    // btn.addEventListener('click', () => {
    //   io.emit('vote', (votedPlayer) => {});
    // });
    // do stuff when connected to the socket server

    // peerjs logic
    const peer = new Peer();
    const peerSocket = new Manager(peerJsSignalingServerURL).socket('/');

    const wrapper = ref<HTMLDivElement>((null as unknown) as HTMLDivElement);

    peer.on('open', (id: string) => {
      console.log(`peerjs id: ${id}`);
      peerSocket.emit('join-room', roomId, id);
    });

    peerSocket.on('connect', () => {
      console.log(`peerjs signaling server connected`);
    });

    const myAudio = document.createElement('audio');
    myAudio.muted = true;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      addAudioStream(myAudio, stream);

      peer.on('call', (call: any) => {
        call.answer(stream);

        const userAudio = document.createElement('audio');

        call.on('stream', (userAudioStream: MediaStream) => {
          addAudioStream(userAudio, userAudioStream);
        });

        call.on('close', () => {
          userAudio.remove();
        });
      });

      peerSocket.on('user-connected', (userId: string) => {
        connectToNewUser(userId, stream);
      });
    });

    function addAudioStream(audio: HTMLAudioElement, stream: MediaStream) {
      audio.srcObject = stream;
      audio.addEventListener('loadedmetadata', () => {
        audio.play();
      });
      wrapper.value.append(audio);
    }

    function connectToNewUser(userId: string, stream: MediaStream) {
      const call = peer.call(userId, stream);
      const userAudio = document.createElement('audio');

      call.on('stream', (userAudioStream: MediaStream) => {
        addAudioStream(userAudio, userAudioStream);
      });

      call.on('close', () => {
        userAudio.remove();
      });
    }

    window.onunload = () => {
      io.close();
      peerSocket.close();
    };

    return {
      canvas,
      wrapper,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';
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

#loadingScreen {
  position: absolute;
  width: 100%;
  height: 100%;
  color: $red;
  font-size: 50px;
  text-align: center;
  background-color: $black;
  z-index: 9999;
}
</style>
