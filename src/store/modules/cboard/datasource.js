/**
 * 数据源配置页面数据
 */
import { fetchDatasourceList, fetchProviderList } from '@/api/cboard/datasource';

const state = {
  datasourceList: [],
  providerList: []
}

const getters = {}

const actions = {

  // 获得数据源列表，数据集管理页面用到
  getDatasourceList(context) {
    return new Promise((resolve, reject) => {
      fetchDatasourceList().then(response => {
          context.commit('setDatasourceList', response);
          resolve(response.data);
        })
        .catch(error => {
          console.log(error)
          reject(error);
        })
    })
  },
  getProviderList(context) {
    return new Promise((resolve, reject) => {
      fetchProviderList().then(response => {
          context.commit('setProviderList', response);
          resolve(response.data);
        })
        .catch(error => {
          reject(error)
        })
    })
  }

}

const mutations = {
  setDatasourceList(state, datasourceList) {
    state.datasourceList = datasourceList;
  },
  setProviderList(state, payload) {
    state.providerList = payload;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
