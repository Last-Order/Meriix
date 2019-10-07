import Vue from 'vue'
import Vuex from 'vuex'
import global from './modules/global';
import queue from './modules/queue';
import error from './modules/error';

Vue.use(Vuex);

export default new Vuex.Store({
  mutations: {

  },
  actions: {

  },
  modules: {
    global,
    queue,
    error
  }
})
