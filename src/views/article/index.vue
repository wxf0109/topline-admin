<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>筛选条件</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动形式">
                    <el-date-picker
                        v-model="form.value1"
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
                <span>共找到15条符合条件的内容</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
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
                prop="status"
                label="状态">
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalCount"
                :disabled="articleLoading"
                @current-change="handleCurrentChange"
                >
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
export default {
  name: '',
  data () {
    return {
      articles: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      totalCount: 0,
      articleLoading: false
    }
  },

  created () {
    this.loadArticles()
  },

  methods: {
    loadArticles (page = 1) {
      this.articleLoading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page,
          per_page: 10
        },
        headers: {
          // Authorization: `Bearer ${userInfo.token}` // 注意 Bearer 和 token 中间要有空格
        }
      }).then(data => {
        console.log(data)
        this.articles = data.results
        this.totalCount = data.total_count
        this.articleLoading = false
      })
    },

    onSubmit () {
      console.log('submit!')
    },
    handleCurrentChange (page) {
      // console.log(page)
      this.loadArticles(page)
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
