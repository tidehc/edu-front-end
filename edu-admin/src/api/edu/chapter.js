import request from '@/utils/request'

const api_name = '/admin/edu/chapter'

export default{
  getNestedChapterList(courseId) { // 获取课程的嵌套章节列表
    return request({
      url: `${api_name}/list/${courseId}`,
      method: 'GET'
    })
  },

  saveChapter(chapter) { // 保存章节信息
    console.log(chapter)
    console.log(chapter.title)
    return request({
      url: `${api_name}`,
      method: 'POST',
      dataType: JSON,
      data: chapter
    })
  },

  deleteChapterById(id) { // 通过id删除章节
    return request({
      url: `${api_name}/${id}`,
      method: 'DELETE'
    })
  },

  getChapter(id) { // 通过id查询章节信息
    return request({
      url: `${api_name}/${id}`,
      method: 'GET'
    })
  },

  updateChapterById(chapter) { // 修改章节信息
    return request({
      url: `${api_name}/${chapter.id}`,
      method: 'PUT',
      dataType: JSON,
      data: chapter
    })
  }

}
