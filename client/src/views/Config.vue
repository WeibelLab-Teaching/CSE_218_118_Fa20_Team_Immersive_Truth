<template>
  <div class="config-component">
    <Logo />
    <div class="options">
      <div class="villagers">
        Villagers:
        <select v-model.number="villagers">
          <option value="" disabled>Please select number of villagers</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="mafia">
        Mafias:
        <select v-model.number="mafias">
          <option value="" disabled>Please select number of mafia</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
    </div>

    <button class="next" @click="next">NEXT</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '../store';
import Logo from '../components/Logo.vue';

export default defineComponent({
  components: { Logo },
  setup() {
    const router = useRouter();
    const store = useStore();

    const villagers = computed({
      set(e: any) {
        store.commit('setVillagers', +e);
      },
      get() {
        return store.state.villagers;
      },
    });

    const mafias = computed({
      set(e: any) {
        store.commit('setMafias', +e);
      },
      get() {
        return store.state.mafias;
      },
    });

    function next() {
      store.commit('setHost', true);
      router.push('/host');
    }

    return {
      router,
      villagers,
      mafias,
      next,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';

.config-component {
  @include full-screen();
  @include theme();
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.next {
  @include button();
  position: absolute;
  bottom: 100px;
}
</style>
