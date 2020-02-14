<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;"/>

    <el-button type="text" @click="dialogFormVisible=true">添加一级分类</el-button>

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      node-key="id"
    >
      <span slot-scope="{ node , data}" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level==1"
            type="text"
            size="mini"
            @click="()=>{dialogFormVisible=true,subject.parentId=data.id}">
            添加二级分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="()=>remove(node,data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <!--添加分类的文本框-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flushSubject()">取 消</el-button>
        <el-button type="primary" @click="saveSubject()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import subject from '@/api/edu/subject'

const defaultSubject = {
  title: '',
  parentId: 0
}

export default {
  data() {
    return {
      filterText: '', // 过滤文本
      subjectList: [], // 数据列表
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogFormVisible: false,
      subject: {
        title: '',
        parentId: 0
      }
    }
  },
  watch: {
    filterText(value) { // 监听filterText的变化
      this.$refs.subjectTree.filter(value)
    }
  },

  created() {
    this.fetchSubjectList()
  },

  methods: {
    // 获取远程数据
    fetchSubjectList() {
      subject.getSubjectList().then(response => {
        if (response.success === true) {
          this.subjectList = response.data.items
        }
      })
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    // 删除课程分类
    remove(node, data) {
      this.$confirm('是否删除该课程分类，此操作不可逆', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return subject.removeById(data.id)
      }).then(() => {
        this.$refs.subjectTree.remove(node)// 删除节点
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    // 添加课程分类
    saveSubject() {
      if (this.subject.parentId === 0) {
        this.saveLevelOneSubject()// 添加一级分类
      } else {
        this.saveLevelTwoSubject()// 添加二级分类
      }
    },
    // 添加一级课程分类
    saveLevelOneSubject() {
      subject.saveLevelOneSubject(this.subject)
        .then(response => {
          this.$message({
            type: 'success',
            message: '添加一级课程分类成功'
          })
          this.flushSubject()//  刷新Subject对象,关闭文本框
          this.fetchSubjectList()// 刷新页面
        })
        .catch(response => {
          this.flushSubject()//  刷新Subject对象,关闭文本框
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        })
    },
    // 添加二级课程分类
    saveLevelTwoSubject() {
      subject.saveLevelTwoSubject(this.subject)
        .then(response => {
          this.$message({
            type: 'success',
            message: '添加二级课程分类成功'
          })
          this.flushSubject()//  刷新Subject对象,关闭文本框
          this.fetchSubjectList()// 刷新页面
        })
        .catch(response => {
          this.flushSubject()// 刷新Subject对象,关闭文本框
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        })
    },

    // 刷新Subject,关闭文本框
    flushSubject() {
      this.dialogFormVisible = false
      this.subject = { ...defaultSubject }
    }
  }
}
</script>
