<template>
  <div class="gameplay">
    <div class="rule" v-for="rule of rules">
      <span class="title">{{ rule.title }}</span>
      <span class="detail">{{ rule.detail }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const rules = ref([
      {
        title: 'HOW IT BEGINS...',
        detail:
          'At the start of the game everyone will be randomly assigned their roles. The game will then transition into Night Phase where the micophones will be muted and our vision will fade to black.',
      },
      {
        title: 'NIGHT PHASE',
        detail:
          'During Night Phase certain roles will be able to perform actions such as killing a villager, saving a villager, etc. Once each role is done the game will transition to Day Phase.',
      },
      {
        title: 'DAY PHASE',
        detail:
          'During Day Phase everyone will observe the consequences of the actions taken during the Night Phase and discuss them. It is during this phase that the villagers are able to vote on who they believe is a Mafia memeber. If a player receives a majority of votes they will be hung to their death and if they are a Mafia memeber it will be revealed. After voting the game will transition to Night Phase again.',
      },
      {
        title: '...HOW IT ENDS',
        detail:
          'The game finished when either the villagers kill all the Mafia members or the Mafia memebers kill enough villagers in order to gain a majority control over the village.',
      },
    ]);

    return {
      rules,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.rule {
  text-align: left;
  margin-bottom: 40px;

  .title {
    color: $red;
    margin-right: 10px;
  }
}
</style>
