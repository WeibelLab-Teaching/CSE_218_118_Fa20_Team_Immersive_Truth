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
    const wrapper = ref<HTMLDivElement>(null);

    const isHost = store.state.host;
    const username = store.state.name;
    const roomId = store.state.roomId;
    const num_villagers = store.state.villagers;
    const num_mafia = store.state.mafias;

    onMounted(() => {
      var game = new Game(
        num_villagers,
        num_mafia,
        ['charlie', store.state.name, 'gamma', 'alpha', 'delta'],
        canvas.value
      );
      game.render();
    });

    // WebRTC
    const peerConnections: { [index: string]: RTCPeerConnection } = {};
    const audios: { [index: string]: HTMLAudioElement } = {};

    const config = {
      iceServers: [
        {
          urls: 'turn:54.175.38.118:3478',
          credential: 'webrtc',
          username: 'webrtc',
        },
        {
          urls: ['stun:stun.l.google.com:19302'],
        },
      ],
    };

    const io = new Manager(serverURL).socket('/');
    const audio = ref<HTMLAudioElement>(null);

    // config for userMedia
    const constraints = {
      audio: true,
    };

    io.on('connect', () => {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        audio.value.srcObject = stream;
        if (isHost) {
          const gameConfig = {
            villagerNum: store.state.villagers,
            doctorNum: store.state.doctors,
            sheriffNum: store.state.sheriffs,
            mafiaNum: store.state.mafias,
          };
          io.emit('create room', {
            config: gameConfig,
            username,
            roomId,
          });
        } else {
          io.emit('join room', { username, roomId });
        }
      });
    });

    io.on('new player joined', ({ username, socketId }) => {
      console.log(`new player joined: ${socketId}`);
      const pc = new RTCPeerConnection(config);
      peerConnections[socketId] = pc;

      const stream = audio.value.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const newAudioElement = document.createElement('audio');
      newAudioElement.autoplay = true;
      audios[socketId] = newAudioElement;
      wrapper.value.append(newAudioElement);

      pc.ontrack = (event) => {
        console.log(`received track`);
        newAudioElement.srcObject = event.streams[0];
        newAudioElement.play();
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          io.emit('candidate', socketId, event.candidate);
        }
      };

      pc.onnegotiationneeded = () => {
        pc.createOffer()
          .then((sdp) => pc.setLocalDescription(sdp))
          .then(() => {
            io.emit('offer', socketId, pc.localDescription);
          });
      };
    });

    io.on('offer', ({ socketId: id, message: description }) => {
      console.log(`new offer received: ${id}, ${description}`);
      const pc = new RTCPeerConnection(config);
      peerConnections[id] = pc;

      const stream = audio.value.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const newAudioElement = document.createElement('audio');
      newAudioElement.autoplay = true;
      audios[id] = newAudioElement;
      wrapper.value.append(newAudioElement);

      pc.setRemoteDescription(description)
        .then(() => pc.createAnswer())
        .then((sdp) => pc.setLocalDescription(sdp))
        .then(() => {
          io.emit('answer', id, pc.localDescription);
        });

      pc.ontrack = (event) => {
        console.log(`received track`);
        newAudioElement.srcObject = event.streams[0];
        newAudioElement.play();
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          io.emit('candidate', id, event.candidate);
        }
      };
    });

    io.on('answer', ({ socketId: id, message: description }) => {
      console.log(`new answer received: ${id}, ${description}`);
      peerConnections[id].setRemoteDescription(description);
    });

    io.on('candaidate', ({ socketId: id, message: candidate }) => {
      console.log(`new candidate received: ${id}, ${candidate}`);
      const pc = peerConnections[id];
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((e) =>
        console.error(e)
      );
    });

    io.on('player disconnected', ({ username, socketId: id }) => {
      console.log(`player disconnected: ${id}`);

      // remove/delete audio element
      const audio = audios[id];
      audio.remove();
      delete audios[id];

      // close/delete peer connection
      const pc = peerConnections[id];
      pc.close();
      delete peerConnections[id];
    });

    window.addEventListener('unload', () => {
      io.close();
    });

    return {
      canvas,
      audio,
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
