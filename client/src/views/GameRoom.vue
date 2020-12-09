<template>
  <div ref="wrapper" class="game-room">
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
      doctorNum: store.state.doctors,
      sheriffNum: store.state.sheriffs,
    };

    // onMounted(() => {
    //   var game = new Game(
    //     selfid,
    //     num_villagers,
    //     num_mafia,
    //     ['charlie', store.state.name, 'gamma', 'alpha', 'delta'],
    //     canvas.value
    //   );
    //   game.render();
    // });

    // use socket.io as follows
    const io = new Manager(serverURL).socket('/');
    const villagerNum = store.state.villagers;
    const doctorNum = store.state.doctors;
    const sheriffNum = store.state.sheriffs;
    const mafiaNum = store.state.mafias;
    var playerRole = null;

    io.on('connect', () => {
      if (isHost) {
        console.log('in connect');
        io.emit('create room', roomConfig, roomId, username);
      } else {
        io.emit('join room', roomId, username);
      }
    });

    io.on('joined room', (role) => {
      //handle
      console.log('in joined room');
      playerRole = role;
      if (isHost) {
        game = new Game(
          selfid,
          num_villagers,
          num_mafia,
          [],
          canvas.value,
          playerRole
        );
        game.addPlayer(username, role);
        game.render();
      }
    });

    //for new players joining
    io.on('existing players', (existingPlayers) => {
      console.log('in existing players');
      var playerNames = [];
      existingPlayers.forEach((player) => {
        playerNames.push(player.name);
      });
      playerNames.push(username);
      game = new Game(
        existingPlayers.length,
        num_villagers,
        num_mafia,
        playerNames,
        canvas.value,
        playerRole
      );
      game.addPlayer(username, playerRole);
      game.render();
      for (var i = 0; i < existingPlayers.length; i++) {
        game.addPlayer(existingPlayers[i].name, existingPlayers[i].role);
      }
    });

    // When a new player joins
    io.on('new player joined', (playerSocketId, username, role) => {
      //add a new player to game
      if (isHost) {
        game.addPlayer(username, role);
        //io.emit('game update', game);
      }
    });

    //on game update
    // io.on('game update', (new_game) => {
    //   game = new_game;
    // });

    // io.on('day', () => {
    //   //day phase do something
    // });

    // io.on('start', () => {
    //   //do something on start
    // });

    // io.on('game ended', (winner) => {
    //   //do something on end
    //   // winner: 'mafia' || 'villager'
    // });

    // io.on('voted player', (votedPlayer) => {
    //   //gives us the voted player
    // });

    // io.on('error', (error) => {
    //   console.log(`Error: ${error}`);
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
