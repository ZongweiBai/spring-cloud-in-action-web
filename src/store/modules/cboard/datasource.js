/**
 * 数据源配置页面数据
 */
import { fetchDatasourceList, fetchProviderList } from '@/api/cboard/datasource';

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
  // getDatasetList(context) {
  //   req.get(api.getDatasetList)
  //   .then((response) => {
  //     if(response.status === 200) {
  //       context.commit('setDatasetList', response.data);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   });
  // },
  // getColumns(context, params) {
  //   return new Promise((resolve, reject) => {
  //     req.post(api.getColumns, params)
  //       .then((response) => {
  //         resolve(response.data.columns);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         reject(error);
  //       })
  //   });
  // },
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
  setWidgetList(state, widgetList) {
    state.widgetList = widgetList;
  },
  setDatasetList(state, datasetList) {
    state.datasetList = datasetList;
  },
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
