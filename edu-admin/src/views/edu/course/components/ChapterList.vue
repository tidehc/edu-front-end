<template>
  <div>
    <!--添加章节-->
    <div>
      <el-button
        style="width：100%"
        type="primary"
        class="el-icon-plus"
        @click="addChapter"
      >添加章节</el-button>
    </div>

    <!--章节列表-->
    <ul class="chapterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChater(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!--视频-->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-tag v-if="video.free" size="mini" type="success">{{ '免费观看' }}</el-tag>
                <el-button type="text" @click="editVideo(chapter.id, video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <ChapterForm ref="chapterForm" :course-id="courseId" @onSaveSuccess="refreshList"/>
    <VideoForm ref="videoForm" :course-id="courseId" @onSaveSuccess="refreshList"/>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import ChapterForm from '@/views/edu/course/components/ChapterForm'
import VideoForm from '@/views/edu/course/components/VideoForm'
import video from '@/api/edu/video'

export default {
  components: { ChapterForm, VideoForm },
  // 父组件向子组件传值
  props: {
    courseId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chapterNestedList: [] // 章节嵌套视频列表
    }
  },
  created() {
    this.fetchChapterNestedListByCourseId()
  },
  methods: {
    fetchChapterNestedListByCourseId() {
      chapter.getNestedChapterList(this.courseId)
        .then(response => {
          this.chapterNestedList = response.data.items
        })
    },
    // 添加章节
    addChapter() {
      this.$refs.chapterForm.open()
    },
    // 章节删除
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该章节，是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.deleteChapterById(chapterId)
      }).then(() => {
        this.fetchChapterNestedListByCourseId()// 刷新列表
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(response => {
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      })
    },
    // 编辑章节信息
    editChater(chapterId) {
      this.$refs.chapterForm.open(chapterId)
    },
    // 添加课时
    addVideo(chapterId) {
      this.$refs.videoForm.open(chapterId)
    },
    // 编辑课时
    editVideo(chapterId, videoId) {
      this.$refs.videoForm.open(chapterId, videoId)
    },
    // 删除课时
    deleteVideo(videoId) {
      this.$confirm('此操作将永久删除该记录,是否删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return video.deleteVideoById(videoId)
      }).then(() => {
        // 刷新列表
        this.refreshList()
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '删除已取消！'
          })
        }
      })
    },
    refreshList() {
      this.fetchChapterNestedListByCourseId()
    }
  }
}
</script>

<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}
</style>
