import request from '@/utils/request'
const api_name = '/vod/video'

export default {

  getVideoPlayAuthById(vid) {
    return request({
      url: `${api_name}/playAuth/${vid}`,
      method: 'GET'
    })
  }
}
