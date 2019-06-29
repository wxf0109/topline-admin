<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>筛选条件</span>
            </div>
            <el-form ref="form" :model="filterParams" label-width="80px">
                <el-form-item label="状态">
                    <el-radio-group v-model="filterParams.status">
                      <el-radio label="">全部</el-radio>
                    <el-radio
                    v-for="(item, index) in statTypes"
                    :key="item.label"
                    :label="index + ''"
                    >{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="频道">
                    <article-channel v-model="filterParams.channel_id"></article-channel>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="begin_end_pubdate"
                        @change="handleDateChange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 列表 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>共找到{{ totalCount }}条符合条件的内容</span>
            </div>
            <!-- 表格 -->
            <el-table
                :data="articles"
                border
                style="width: 100%"
                v-loading="articleLoading">
                <el-table-column
                prop="cover.images[0]"
                label="封面"
                width="180">
                </el-table-column>
                <el-table-column
                prop="title"
                label="标题"
                width="180">
                </el-table-column>
                <el-table-column
                prop="pubdate"
                label="发布日期"
                width="180">
                </el-table-column>
                <el-table-column
                label="状态">
                <template slot-scope="scope">
                  <el-tag :type="statTypes[scope.row.status].type">{{statTypes[scope.row.status].label}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="状态">
                    <template slot-scope="scope">
                        <el-button type="success" @click="$router.push({
                          name: 'publish-edit',
                          params: {
                            id: scope.row.id
                          }
                        })">修改</el-button>
                    <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                :disabled="articleLoading"
                :current-page="page"
                @current-change="handleCurrentChange"
                >
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import ArticleChannel from '@/components/article-channel'
// const userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
export default {
  name: '',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articles: [],
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: '',
      //   value1: ''
      // },
      totalCount: 0,
      articleLoading: false,
      page: 1,
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      filterParams: { // 文章查询条件参数
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      begin_end_pubdate: []
    }
  },

  created () {
    this.loadArticles()
  },

  methods: {
    loadArticles (page = 1) {
      this.articleLoading = true

      // 过滤出有效的查询条件数据

      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          per_page: 10,
          // 将对象混入当前对象，对象拷贝
          ...filterData
        },
        headers: {
          // Authorization: `Bearer ${userInfo.token}` // 注意 Bearer 和 token 中间要有空格
        }
      }).then(data => {
        // console.log(data)
        this.articles = data.results
        this.totalCount = data.total_count
        this.articleLoading = false
      })
    },

    onSubmit () {
      this.page = 1
      this.loadArticles()
    },
    handleCurrentChange (page) {
      // console.log(page)
      this.loadArticles(page)
    },
    handleDelete (article) {
      this.$confirm('确认删除么？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
      // console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
    .box-card {
        padding-bottom: 20px;
    }
    .el-pagination {
        padding-top: 20px;
    }
</style>
