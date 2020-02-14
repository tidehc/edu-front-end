import request from '@/utils/request'

const api_name = '/admin/edu/subject'

export default{

  getSubjectList() { // 获取嵌套的课程列表
    return request({
      url: `${api_name}/list`,
      method: 'GET'
    })
  },

  removeById(id) { // 删除指定id的课程分类
    return request({
      url: `${api_name}/` + id,
      method: 'DELETE'
    })
  },

  saveLevelOneSubject(subject) { // 添加一级课程分类
    return request({
      url: `${api_name}/levelOne`,
      method: 'POST',
      dataType: JSON,
      data: subject
    })
  },

  saveLevelTwoSubject(subject) { // 添加二级课程分类
    return request({
      url: `${api_name}/levelTwo`,
      method: 'POST',
      dataType: JSON,
      data: subject
    })
  }

}
