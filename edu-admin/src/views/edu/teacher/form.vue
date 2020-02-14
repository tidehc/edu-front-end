<template>

  <div class="app-container">

    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!--头像缩略图-->
        <pan-thumb :image="teacher.avatar" />
        <!--文件上传按钮-->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          更换头像
        </el-button>

        <!--
            v-show 是否显示上传组件
            :key   类似于id 如果一个页面有多个上传控件，可以做区分
            ：url  上传url
            @close 关闭上传组件
            @crop-upload-success 上传成功的回调
          -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :max-size="2048"
          :url="BASE_API+'/admin/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm = {
  name: '',
  sort: 0,
  level: '',
  career: '',
  intro: '',
  avatar: ''
}

export default {
  components: {
    ImageCropper, PanThumb
  },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: process.env.OSS_PATH + '/avatar/avatar.jpg'
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0,
      BASE_API: process.env.BASE_API // 获取env文件的变量
    }
  },

  watch: {// 监听器
    $route(to, from) { // 当路由变化的时候重新加载组件
      this.init()
    }
  },

  created() { // 当页面加载完成后调用
    // 判断路由参数
    if (this.$route.params && this.$route.params.id) {
      // 获取讲师id
      const id = this.$route.params.id
      this.fetchData(id)
    }
  },

  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true// 防止用户重复提交
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    saveData() {
      teacher.save(this.teacher).then(response => {
        return this.message({
          type: 'success',
          message: '保存成功!'
        })
      }).then(response => {
        this.$router.push({ path: '/edu/teacher' })
      })
    },

    fetchData(id) {
      teacher.getById(id).then(response => {
        this.teacher = response.data.item
        if (response.data.item.avatar === '') { // 默认头像
          this.teacher.avatar = process.env.OSS_PATH + '/avatar/avatar.jpg'
        }
      })
    },

    updateData() {
      teacher.updateById(this.teacher).then(response => {
        return this.$message({
          type: 'success',
          message: '修改讲师信息成功!'
        })
      }).then(response => {
        this.$router.push({ path: '/edu/teacher' })
      })
    },

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        // 使用对象拓展运算符，拷贝对象，而不是引用，
        // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
        this.teacher = { ...defaultForm }
      }
    },

    // 上传文件成功的回调
    cropSuccess(data) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1

      // 获取后端服务器的返回值
      this.teacher.avatar = data.url
    },

    // 关闭文件上传组件
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    }

  }

}
</script>
