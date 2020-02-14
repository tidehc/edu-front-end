import request from '@/utils/request'

const api_name = '/admin/statistics/daily'

export default{

  createStatisticsByDay(day) { // 生成指定日期的统计记录
    return request({
      url: `${api_name}/${day}`,
      method: 'POST'
    })
  },

  getChartData(searchObj) { // 查询符合条件的统计信息
    return request({
      url: `${api_name}/chart`,
      method: 'GET',
      params: searchObj
    })
  }

}
