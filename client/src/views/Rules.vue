<template>
  <div class="rules">
    <Logo />
    <div class="sections">
      <button
        @click="section = 'Gameplay'"
        :class="{ active: section === 'Gameplay' }"
        class="section"
      >
        GAMEPLAY
      </button>
      <button
        @click="section = 'Roles'"
        :class="{ active: section === 'Roles' }"
        class="section"
      >
        ROLES
      </button>
    </div>
    <transition name="fade" mode="out-in">
      <component :is="section"></component>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import Gameplay from '../components/Gameplay.vue';
import Roles from '../components/Roles.vue';
import Logo from '../components/Logo.vue';

export default defineComponent({
  setup() {
    const section = ref('Gameplay');
    const router = useRouter();

    return {
      router,
      section,
    };
  },
  components: {
    Logo,
    Gameplay,
    Roles,
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';

.rules {
  @include full-screen();
  @include theme();
}

.sections {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-top: 30px;
  width: 100%;

  .section {
    font-size: 1.5rem;
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.5;
    color: $grey;
    margin: 0 10px;
    width: 50%;
    transition: all 0.3s ease;
  }

  .active {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
