<template>
  <div class="host">
    <img
      @click="router.push('/')"
      src="../assets/Shady.svg"
      alt="logo"
      class="logo"
    />
    <div class="title">YOUR ROOM CODE</div>
    <div class="code">{{ roomId }}</div>
    <div class="buttons">
      <button class="button">COPY</button>
      <button class="button">NEXT</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { v4 as uuid } from 'uuid';

export default defineComponent({
  setup() {
    const router = useRouter();
    const roomId = ref(uuid());

    function copy() {}

    return {
      roomId,
      router,
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

.logo {
  width: 10%;
  top: 20px;
  position: absolute;
  left: 20px;
  cursor: pointer;
}

.title {
  font-size: 2rem;
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
    font-size: 1.5rem;
    margin: 20px;
  }
}
</style>
