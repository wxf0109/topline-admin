<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png" alt>
      </div>
      <div class="login-form">
        <!-- 表单验证：
        rules  配置验证规则
        将需要验证的字段通过 prop 属性配置到 el-form-item 组件上
        ref  过去表单组件，可以手动调用表单组件的验证方法 -->
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item   prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item   prop="code">
            <el-col :span="12">
              <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="10" :offset="2">
              <el-button @click="handleCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="checked">
            <el-checkbox v-model="form.checked"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import '@/vendor/gt'

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '15076653737',
        code: '',
        checked: true
      },
      loginLoading: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        checked: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null
    }
  },
  methods: {
    handleLogin () {
      // consoele.log(111)
      // 表单组件有一个方法，validate可以用于获取当前表单的验证状态
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }

        this.login()
      })
    },

    login () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => {
        this.$message({
          showClose: true,
          message: '登陆成功',
          type: 'success'
        })

        this.loginLoading = false

        // 路由跳转，都是用name去跳转，路由传参方便
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log(err)
        if (err.response.status === 400) {
          this.$message.error('登陆失败')
        }
        this.loginLoading = false
      })
    },
    handleCode () {
      const { mobile } = this.form

      if (this.captchaObj) {
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind'
          }, (captchaObj) => {
            this.captchaObj = captchaObj
            captchaObj.onReady(() => {
              captchaObj.verify()
            }).onSuccess(() => {
              console.dir(captchaObj.getValidate())
              const {
                geetest_challenge: challenge,
                geetest_validate: validate,
                geetest_seccode: seccode
              } = captchaObj.getValidate()
              axios({
                method: 'GET',
                url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                params: {
                  challenge,
                  validate,
                  seccode
                }
              }).then(res => {
                console.log(res.data)
              }).catch(error => {
                console.log(error)
              })
            })
            // 这里可以调用验证实例 captchaObj 的实例方法
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
  background-color: #156;
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    .el-checkbox {
      margin-right: 10px;
    }
    .login-head {
      padding-bottom: 20px;
      display: flex;
      justify-content: center;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
