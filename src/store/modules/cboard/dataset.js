/**
 * 数据源配置页面数据
 */
import { fetchDatasetList, fetchColumnInfo } from '@/api/cboard/dataset';

const state = {
  widgetList: [],
  datasetList: [],
  datasourceList: [],
  providerList: []
}

const getters = {}

const actions = {

  //这两个获得的是 dashboard 菜单栏的菜单数据
  // getWidgetList(context) {
  //   req.get(api.getWidgetList)
  //   .then((response) => {
  //     if(response.status === 200) {
  //       context.commit('setWidgetList', response.data);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   });
  // },
  getDatasetList(context) {
    return new Promise((resolve, reject) => {
      fetchDatasetList().then(response => {
          context.commit('setDatasetList', response);
          resolve(response.data);
        })
        .catch(error => {
          console.log(error)
          reject(error);
        })
    })
  },
  getColumns(context, params) {
    return new Promise((resolve, reject) => {
      fetchColumnInfo(params).then(response => {
          resolve(response.columns);
        })
        .catch(error => {
          console.log(error)
          reject(error);
        })
    })
  },
}

const mutations = {
  setDatasetList(state, datasetList) {
    state.datasetList = datasetList;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
