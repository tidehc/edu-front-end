import request from '@/utils/request'

const api_name = '/admin/edu/video'

export default{

  saveVideo(video) { // 保存课时信息
    return request({
      url: `${api_name}`,
      method: 'POST',
      dataType: JSON,
      data: video
    })
  },

  getVideoById(id) { // 根据Id获取课时信息
    return request({
      url: `${api_name}/${id}`,
      method: 'GET'
    })
  },

  updateVideoById(video) { // 根据Id更新课时信息
    return request({
      url: `${api_name}/${video.id}`,
      method: 'PUT',
      dataType: JSON,
      data: video
    })
  },

  deleteVideoById(id) { // 根据Id删除课时信息
    return request({
      url: `${api_name}/${id}`,
      method: 'DELETE'
    })
  }

}
