import request from '@/utils/request'

const api_name = '/edu/course'

export default{

  getPageList(page, limit) { // 分页查询课程列表
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET'
    })
  }

}
