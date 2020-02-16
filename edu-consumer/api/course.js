import request from '@/utils/request'

const api_name = '/edu/course'

export default{

  getPageList(page, limit) { // 分页查询课程列表
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET'
    })
  },

  getCourseDetailedById(courseId) { // 查询课程详情信息,包括课程信息和对应的讲师信息
    return request({
      url: `${api_name}/${courseId}`,
      method: 'GET'
    })
  }

}
