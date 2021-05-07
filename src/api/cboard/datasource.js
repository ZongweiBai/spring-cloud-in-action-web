import request from '@/utils/request'

/**
 * 查询所有的数据源
 * @param {*} query 
 * @returns 
 */
export function fetchDatasourceList(query) {
    return request({
        url: '/cboard/dashboard/getDatasourceList',
        method: 'get',
        params: query
    })
}

/**
 * 查询所有支持的数据源类型
 * @param {string}} query 
 * @returns 
 */
export function fetchProviderList(query) {
    return request({
        url: '/cboard/dashboard/getProviderList',
        method: 'get',
        params: query
    })
}

/**
 * 删除数据源
 * @param {id:long} query 
 * @returns 
 */
export function deleteDatasource(query) {
    return request({
        url: '/cboard/dashboard/deleteDatasource',
        method: 'get',
        params: query
    })
}

/**
 * 更新数据源
 * @param {*} query 
 * @returns 
 */
export function updateDatasource(data) {
    return request({
        url: '/cboard/dashboard/updateDatasource',
        method: 'post',
        params: data
    })
}

/**
 * 新增数据源
 * @param {*} query 
 * @returns 
 */
export function saveDatasource(data) {
    return request({
        url: '/cboard/dashboard/saveNewDatasource',
        method: 'post',
        params: data
    })
}

/**
 * 测试数据源
 * @param {*} query 
 * @returns 
 */
export function testDatasource(data) {
    return request({
        url: '/cboard/dashboard/test',
        method: 'get',
        params: data
    })
}