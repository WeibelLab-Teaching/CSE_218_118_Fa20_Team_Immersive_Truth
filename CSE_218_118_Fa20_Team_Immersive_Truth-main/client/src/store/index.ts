import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { InjectionKey } from 'vue';

export interface State {
  roomId: string;
  name: string;
  automaticNarration: boolean;
  villagers: number;
  mafias: number;
  sheriffs: number;
  doctors: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    return {
      roomId: '',
      name: '',
      automaticNarration: true,
      villagers: 3,
      mafias: 1,
      sheriffs: 1,
      doctors: 1,
    };
  },
  mutations: {
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setName(state, name) {
      state.name = name;
    },
    setAutomaticNarration(state, automaticNarration: boolean) {
      state.automaticNarration = automaticNarration;
    },
    setVillagers(state, villagers: number) {
      state.villagers = villagers;
    },
    setMafias(state, mafias: number) {
      state.mafias = mafias;
    },
    setSheriffs(state, sheriffs: number) {
      state.sheriffs = sheriffs;
    },
    setDoctors(state, doctors: number) {
      state.doctors = doctors;
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
