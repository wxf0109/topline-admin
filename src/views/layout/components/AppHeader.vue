<template>
  <el-row class="cz">
    <el-col :span="14">江苏传智博客教育科技股份有限公司</el-col>
    <el-col :span="10">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <!-- <img width="30" src="userInfo.photo"> -->
          {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
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
