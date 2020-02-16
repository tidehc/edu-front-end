import request from '@/utils/request'
const api_name = '/edu/teacher'

export default {
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET'
    })
  },

  getTeacherById(teacherId) {
    return request({
      url: `${api_name}/${teacherId}`,
      method: 'GET'
    })
  }
}
