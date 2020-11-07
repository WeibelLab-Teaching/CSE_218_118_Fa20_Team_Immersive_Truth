<template>
  <img
    @click="router.push('/')"
    src="../assets/Shady.svg"
    alt="logo"
    class="logo"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
});
</script>

<style lang="scss" scoped>
.logo {
  width: 10%;
  top: 20px;
  position: absolute;
  left: 20px;
  cursor: pointer;
}

@media only screen and (min-width: 768px) {
  .logo {
    width: 5%;
  }
}
</style>
