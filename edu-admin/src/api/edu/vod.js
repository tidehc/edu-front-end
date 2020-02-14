import request from '@/utils/request'

const api_name = '/admin/vod/video'

export default{

  removeById(videoId) { // 根据videoId删除视频
    return request({
      url: `${api_name}/${videoId}`,
      method: 'DELETE'
    })
  }
}
