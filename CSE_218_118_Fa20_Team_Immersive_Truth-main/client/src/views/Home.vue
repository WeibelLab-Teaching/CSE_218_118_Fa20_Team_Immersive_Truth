<template>
  <div class="home">
    <img src="../assets/Shady.svg" alt="logo" class="logo" />
    <h1 class="title">MAFIA<span class="red">VR</span></h1>
    <div class="buttons">
      <button class="button" @click="join">JOIN GAME</button>
      <button class="button" @click="router.push('/config')">HOST GAME</button>
      <button class="button" @click="router.push('/rules')">HOW TO PLAY</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const roomID = ref('');

    function join() {
      router.push(`/join/${roomID.value}`);
    }

    return { roomID, join, router };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/mixins.scss';
@import '../scss/variables.scss';

.home {
  @include full-screen();
  @include theme();
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 50%;
}

.title {
  font-size: 3rem;
  margin-top: 20px;
  margin-bottom: 10px;

  .red {
    color: $red;
  }
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;

  .room {
    width: 500px;
    text-align: center;
    font-size: 1.5rem;
    margin: 10px;
    padding: 5px 10px;
  }

  .button {
    width: 200px;
    margin: 10px;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 1.15rem;
    color: $grey;
    background: none;
    border: none;
    outline: none;
  }
}
</style>
