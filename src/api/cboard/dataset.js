import request from '@/utils/request'

/**
 * 查询所有的数据集
 * @param {*} query 
 * @returns 
 */
 export function fetchDatasetList(query) {
    return request({
        url: '/cboard/dashboard/getDatasetList',
        method: 'get',
        params: query
    })
}

/**
 * 根据SQL查询字段信息
 * @param {*} query 
 * @returns 
 */
 export function fetchColumnInfo(query) {
     console.log(query)
    return request({
        url: '/cboard/dashboard/getColumns',
        method: 'post',
        params: query
    })
}

/**
 * 删除数据集
 * @param {id:long} query 
 * @returns 
 */
 export function deleteDataset(query) {
    return request({
        url: '/cboard/dashboard/deleteDataset',
        method: 'get',
        params: query
    })
}

/**
 * 更新数据集
 * @param {*} query 
 * @returns 
 */
export function updateDataset(data) {
    return request({
        url: '/cboard/dashboard/updateDataset',
        method: 'post',
        params: data
    })
}

/**
 * 新增数据集
 * @param {*} query 
 * @returns 
 */
export function saveDataset(data) {
    return request({
        url: '/cboard/dashboard/saveNewDataset',
        method: 'post',
        params: data
    })
}