<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible.sync="dialogVisible" title="添加课时">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>

      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
      </el-form-item>

      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上传视频">
        <el-upload
          :on-success="handleVodUploadSuccess"
          :on-exceed="handleUploadExceed"
          :on-remove="handlVodRemove"
          :before-remove="beforeVodRemove"
          :file-list="fileList"
          :action="BASE_API+'/admin/vod/video'"
          :limit="1"
          ref:="upload"
          class="upload-demo">
          <el-button size="small" type="primary">上传视频</el-button>
          <el-tooltip placement="right-end">
            <div slot="content">最大支持1G，<br>
              支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
              GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
              MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
              SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
            <i class="el-icon-question"/>
          </el-tooltip>
        </el-upload>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>

  </el-dialog>
</template>
<script>
import video from '@/api/edu/video'
import vod from '@/api/edu/vod'

const defaultVideo = {
  chapterId: '',
  title: '',
  sort: 0,
  free: false,
  videoSourceId: '',
  videoOriginalName: ''
}

export default {

  // 父组件向子组件传值
  props: {
    courseId: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      dialogVisible: false, // 是否显示表单
      video: {
        chapterId: '',
        title: '',
        sort: 0,
        free: false,
        videoSourceId: '',
        videoOriginalName: ''
      },

      fileList: [], // 文件上传列表
      BASE_API: process.env.BASE_API // 接口Api地址

    }
  },

  methods: {
    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId
      if (videoId) {
        video.getVideoById(videoId).then(response => {
          this.video = response.data.item
          if (this.video.videoSourceId && this.video.videoOriginalName) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
      }
    },
    close() {
      this.dialogVisible = false
      this.fileList = []
      // 重置表单
      this.resetForm()
    },
    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },
    save() {
      this.video.courseId = this.courseId
      video.saveVideo(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.close()
        this.$emit('onSaveSuccess')
      })
    },
    update() {
      video.updateVideoById(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.close()
        this.$emit('onSaveSuccess')
      })
    },
    // 重置表单
    resetForm() {
      this.video = { ...defaultVideo }
    },

    // 视频上传成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },

    // 文件超出上传限制回调
    handleUploadExceed() {
      this.$message({
        url: 'warning',
        message: '最多上传一个视频文件'
      })
    },
    // 删除视频前回调
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 删除成功回调
    handlVodRemove(file, fileList) {
      vod.removeById(this.video.videoSourceId).then(response => {
        this.$message({
          type: 'success',
          message: response.message
        })

        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        video.updateVideoById(this.video)
      })
    }
  }
}
</script>
