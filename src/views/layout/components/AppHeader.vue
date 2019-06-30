<template>
  <el-row class="cz">
    <el-col :span="14">江苏传智博客教育科技股份有限公司</el-col>
    <el-col :span="10">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30px" :src="userInfo.photo">
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>

          <!-- 给组件注册原生事件： @原生事件类型。native="处理函数" -->
          <!-- .native 修饰符 -->
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
    // console.log(userInfo)
  },
  methods: {
    handleLogout () {
      window.localStorage.removeItem('user_Info')

      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .cz {
    height: 60px;
    line-height: 60px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #000;
  }
</style>
