import request from '@/utils/request'

const api_name = '/admin/edu/teacher'

export default{
  getPageList(page, limit, searchObj) { // 获取讲师分页列表
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  getList() { // 获取讲师列表
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },

  removeDataById(id) { // 删除讲师
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },

  save(teacher) { // 新增讲师
    return request({
      url: api_name,
      method: 'post',
      data: teacher

    })
  },

  getById(id) { // 通过id查询教师
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  updateById(teacher) {
    return request({
      url: `${api_name}/${teacher.id}`,
      method: 'put',
      data: teacher
    })
  }
}
