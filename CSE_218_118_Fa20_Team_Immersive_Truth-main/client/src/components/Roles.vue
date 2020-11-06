<template>
  <div class="roles">
    <div class="left">
      <div class="role" v-for="role of rolesLeft">
        <div class="title">{{ role.role }}</div>
        <div class="detail">{{ role.detail }}</div>
      </div>
    </div>
    <div class="right">
      <div class="role" v-for="role of rolesRight">
        <div class="title">{{ role.role }}</div>
        <div class="detail">{{ role.detail }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const rolesLeft = ref([
      {
        role: 'VILLAGER',
        detail:
          'The villager wants to deduce who is the Mafia and hang them in the day phase.',
      },
      {
        role: 'DOCTOR',
        detail:
          'The doctor wants to prevent the Mafia from killing the villagers. You can choose to save one villager each night and if the mafia chooses the same villager you will prevent their death.',
      },
      {
        role: 'THE NARRATOR',
        detail: 'God, basically.',
      },
    ]);

    const rolesRight = ref([
      {
        role: 'MAFIA',
        detail:
          'The mafia wants to klil enough villagers in order to take over the village. You can choose to kill one villager during each night phase.',
      },
      {
        role: 'INVESTIGATOR',
        detail: `Your eold is to find out who is part of the Mafia memebers. You can investigate one person each night and if they are the part of the mafia, you'll know.`,
      },
    ]);

    return { rolesLeft, rolesRight };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.roles {
  width: 100%;
  display: flex;
}

.left {
  margin-right: 10px;
}

.right {
  margin-left: 10px;
}

.role {
  text-align: left;
  margin-bottom: 40px;

  .title {
    color: $red;
    margin-bottom: 5px;
  }
}
</style>
