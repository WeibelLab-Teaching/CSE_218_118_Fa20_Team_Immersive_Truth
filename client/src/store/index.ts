import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { InjectionKey } from 'vue';

export interface State {
  roomId: string;
  name: string;
  villagers: number;
  mafias: number;
  host: boolean;
  isDay: boolean;
  isNight: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state() {
    return {
      roomId: '',
      name: '',
      villagers: 3,
      mafias: 1,
      host: false,
      isDay: false,
      isNight: false,
    };
  },
  getters: {
    isDay: state => {
      return state.isDay
    },
    isNight: state => {
      return state.isNight
    }
  },
  mutations: {
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setName(state, name) {
      state.name = name;
    },
    setVillagers(state, villagers: number) {
      state.villagers = villagers;
    },
    setMafias(state, mafias: number) {
      state.mafias = mafias;
    },
    setHost(state, host: boolean) {
      state.host = host;
    },
    setDay(state, day:boolean){
      state.isDay = day;
    },
    setNight(state, night:boolean){
      state.isNight = night;
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
