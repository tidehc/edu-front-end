import request from '@/utils/request'

const api_name = '/admin/edu/course'

export default{

  saveCourseInfo(courseInfo) { // 保存课程基本信息和描述
    return request({
      url: `${api_name}/info`,
      method: 'POST',
      dataType: JSON,
      data: courseInfo
    })
  },
  getCourseInfoById(id) { // 通过课程ID获取课程基本信息和描述
    return request({
      url: `${api_name}/info/${id}`,
      method: 'GET'
    })
  },
  updateCourseInfo(courseInfo) { // 保存课程基本信息的修改
    return request({
      url: `${api_name}/info`,
      method: 'PUT',
      dataType: JSON,
      data: courseInfo
    })
  },
  getPageList(page, limit, searchObj) { // 分页查询课程列表
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
      params: searchObj
    })
  },
  deleteCourseById(id) { // 通过ID删除课程
    return request({
      url: `${api_name}/${id}`,
      method: 'DELETE'
    })
  },
  getCoursePublishInfoById(id) { // 根据Id获取课程发布信息
    return request({
      url: `${api_name}/publishInfo/${id}`,
      method: 'GET'
    })
  },
  publishCourseById(id) { // 根据Id发布课程
    return request({
      url: `${api_name}/publish/${id}`,
      method: 'PUT'
    })
  }
}
