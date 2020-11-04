<template>
  <div class="host">
    <Logo />
    <div class="title">YOUR ROOM CODE</div>
    <div class="code" id="room-id">{{ roomId }}</div>
    <div class="buttons">
      <button class="button" ref="copyBtn" data-clipboard-target="#room-id">
        COPY
      </button>
      <button class="button" @click="next">NEXT</button>
    </div>
    <div class="tooltip" ref="tooltip">Copied To Clipboard!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { v4 as uuid } from 'uuid';

import { useStore } from '../store';
import Logo from '../components/Logo.vue';

export default defineComponent({
  components: { Logo },
  setup() {
    const router = useRouter();
    const roomId = ref(uuid());
    const copyBtn = ref<HTMLButtonElement>(null);
    const tooltip = ref<HTMLDivElement>(null);

    // Vuex updates
    const store = useStore();
    store.commit('setRoomId', roomId.value);

    onMounted(() => {
      const clipboard = new ClipboardJS(copyBtn.value);
      clipboard.on('success', (e) => {
        tooltip.value.classList.add('show');
        setTimeout(() => {
          tooltip.value.classList.remove('show');
        }, 2000);
        e.clearSelection();
      });
    });

    function next() {
      router.push(`/name`);
    }

    return {
      roomId,
      router,
      copyBtn,
      tooltip,
      next,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';

.host {
  @include full-screen();
  @include theme();
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: $title-font-size;
}

.code {
  color: $red;
  margin-top: 20px;
}

.buttons {
  width: 100%;

  .button {
    border: none;
    outline: none;
    background: none;
    color: $grey;
    font-size: $button-font-size;
    margin: 20px;
  }
}

.tooltip {
  transition: all 0.3s;
  position: fixed;
  bottom: 100px;
  opacity: 0;
}

.show {
  opacity: 1;
}
</style>
