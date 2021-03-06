import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import errorLog from './modules/errorLog'
import user from './modules/user'
import cboardDatasource from './modules/cboard/datasource'
import cboardDataset from './modules/cboard/dataset'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    errorLog,
    user,
    cboardDatasource,
    cboardDataset
  },
  getters
})

export default store

/*export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})*/
