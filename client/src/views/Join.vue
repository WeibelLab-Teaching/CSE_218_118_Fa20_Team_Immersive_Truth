<template>
  <div class="join-component">
    <Logo />
    <div class="title">ROOM CODE?</div>
    <input ref="code" placeholder="ENTER CODE..." type="text" class="code" />
    <button class="next" @click="next">NEXT</button>
    <div class="tooltip" ref="tooltip">Please enter a room code!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import Logo from '../components/Logo.vue';
import { useStore } from '../store';

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const code = ref<HTMLInputElement>(null);
    const store = useStore();
    const router = useRouter();
    const tooltip = ref<HTMLDivElement>(null);

    function next() {
      const roomId = code.value.value;
      if (roomId.length === 0) {
        // TODO: show tooltip
        tooltip.value.classList.add('show');
        setTimeout(() => {
          tooltip.value.classList.remove('show');
        }, 2000);
      } else {
        store.commit('setRoomId', code.value.value);
        router.push('/name');
      }
    }

    return {
      code,
      next,
      tooltip,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';

.join-component {
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
  @include input();
}

.next {
  @include button();
  position: absolute;
  bottom: 100px;
}

.tooltip {
  transition: all 0.3s;
  position: fixed;
  bottom: 75px;
  opacity: 0;
}

.show {
  opacity: 1;
}
</style>
