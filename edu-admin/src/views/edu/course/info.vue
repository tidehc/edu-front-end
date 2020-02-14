<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <div style="text-align:rigth">

      <!-- 课程信息表单 -->
      <el-form label-width="120px">
        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.course.title" placeholder=" 示例：JAVA项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>
        <!-- 所属分类 -->
        <el-form-item label="课程类别">
          <!-- 一级分类 -->
          <el-select
            v-model="courseInfo.course.subjectParentId"
            placeholder="请选择"
            @change="subjectLevelOneChanged">
            <el-option
              v-for="subject in subjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"
            />
          </el-select>
          <!-- 二级分类 -->
          <el-select v-model="courseInfo.course.subjectId" placeholder="请选择">
            <el-option
              v-for="subject in subjectLevelTwoList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>
        <!-- 课程讲师 -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
          <el-select
            v-model="courseInfo.course.teacherId"
            placeholder="请选择">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>
        <!-- 课程简介 -->
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description.description"/>
        </el-form-item>
        <!-- 课程封面 -->
        <el-form-item label="课程封面">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/admin/oss/file/upload?host=cover'"
            class="avatar-uploader">
            <img :src="courseInfo.course.cover">
          </el-upload>
        </el-form-item>
        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.course.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>
        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.course.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>
        <div style="text-align:center">
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>

        </div>

      </el-form>
    </div>
  </div>
</template>
<script>

import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import teacher from '@/api/edu/teacher'
import Tinymce from '@/components/Tinymce'

const defaultCourse = {
  course: {
    title: '',
    lessonNum: 0,
    price: 0,
    cover: process.env.OSS_PATH + '/cover/fen.jpg',
    subjectParentId: '',
    subjectId: '',
    teacherId: ''
  },
  description: {
    description: ''
  }
}

export default {

  components: { Tinymce },

  data() {
    return {
      courseInfo: defaultCourse, // 课程基本信息
      active: 0,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectList: [], // 一级分类列表
      subjectLevelTwoList: [], // 二级分类列表
      teacherList: [], // 讲师列表
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },

  watch: {
    $route(to, from) {
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {

    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        // 根据id获取课程基本信息和描述
        this.fetchCourseInfoById(id)
      } else {
        this.courseInfo = { ...defaultCourse }
        this.initSubjectList()// 初始化分类列表
      }

      this.initTeacherList()// 获取讲师列表
    },

    // 获取讲师列表
    initTeacherList() {
      teacher.getList().then(response => {
        this.teacherList = response.data.items
      })
    },

    // 初始化分类列表
    initSubjectList() {
      subject.getSubjectList().then(response => {
        this.subjectList = response.data.items
      })
    },

    next() { // 保存或更新课程基本信息
      this.saveBtnDisabled = true
      if (!this.courseInfo.course.id) {
        this.saveCourseInfo()
      } else {
        this.updateCourseInfo()
      }
    },

    // 保存课程基本信息
    saveCourseInfo() {
      course.saveCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存课程基本信息成功!'
          })
          this.$router.push({ path: '/edu/course/chapter/' + response.data.id })
        })
        .catch(response => {
          this.$message({
            type: 'error',
            message: '保存课程基本信息失败!'
          })
        })
    },

    // 更新课程基本信息
    updateCourseInfo() {
      this.saveBtnDisabled = true
      course.updateCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '成功修改课程基本信息!'
        })
      }).then(() => {
        this.$router.push({ path: '/edu/course/chapter/' + this.courseInfo.course.id })
      }).catch(response => {
        this.$message({
          type: 'error',
          message: '修改课程信息失败'
        })
      })
    },

    // 课程分类联动
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectList.length; i++) {
        if (this.subjectList[i].id === value) {
          this.subjectLevelTwoList = this.subjectList[i].children
          this.courseInfo.course.subjectId = ''
        }
      }
    },

    // 文件上传成功的回调
    handleAvatarSuccess(response) {
      this.courseInfo.course.cover = response.data.url
    },

    // 文件上传前的检查
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message({
          type: 'error',
          message: '文件格式只能是JPG格式'
        })
      }
      if (!isLt2M) {
        this.$message({
          type: 'error',
          message: '文件大小不能超过2M'
        })
      }
      return isJPG && isLt2M
    },

    // 根据id获取课程基本信息和描述
    fetchCourseInfoById(id) {
      course.getCourseInfoById(id).then(response => {
        this.courseInfo = response.data.courseInfo

        // 初始化分类列表
        subject.getSubjectList().then(response => {
          this.subjectList = response.data.items
          // 填充二级菜单：遍历一级菜单列表，
          for (let i = 0; i < this.subjectList.length; i++) {
            // 找到和courseInfo.subjectParentId一致的父类别记录
            if (this.subjectList[i].id === this.courseInfo.course.subjectParentId) {
              // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
              this.subjectLevelTwoList = this.subjectList[i].children
            }
          }
        })
      }).catch(response => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
</style>
