<template>
  <div class="join-component">
    <Logo />
    <div class="title">ROOM CODE?</div>
    <input ref="code" placeholder="ENTER CODE..." type="text" class="code" />
    <button class="next" @click="next">NEXT</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import Logo from '../components/Logo.vue';
import { useStore } from '../store';
import { serverURL } from '../config';

export default defineComponent({
  components: {
    Logo,
  },
  setup() {
    const code = ref<HTMLInputElement | null>(null);
    const store = useStore();
    const router = useRouter();

    async function next() {
      try {
        // check whether the room exists
        await axios.get(`${serverURL}/room/${code.value.value}`);

        store.commit('setRoomId', code.value?.value);
        router.push('/name');
      } catch (error) {
        alert(
          'Room with entered room ID does not exist. Please enter a valid room ID.'
        );
      }
    }

    return {
      code,
      next,
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
</style>
