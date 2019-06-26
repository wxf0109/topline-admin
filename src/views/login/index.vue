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
              <el-button
              @click="handleCode"
              :disabled="!!codeTimer || codeLoadging"
              >
                {{codeTimer ? `剩余${codeSecons}秒` : '获取验证码'}}
              </el-button>
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

const djs = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {// 表单数据
        mobile: '15076653737',
        code: '',
        checked: true// 是否同意用户协议
      },
      loginLoading: false, // 登录按钮的 loading状态
      rules: { // 表单验证规则
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
      captchaObj: null, // 通过 initGeetest 得到的极验验证码对象
      codeSecons: djs, // 倒计时的时间
      codeTimer: null, // 倒计时定时器
      sendMobie: '', // 保存初始化验证码之后发送短息的手机号
      codeLoadging: false
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
        window.localStorage.setItem('user_Info', JSON.stringify(res.data.data))
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
      this.$refs['ruleForm'].validateField('mobile', errorMessage => {
        // 判断  如果有错误  return 不往后执行
        if (errorMessage.trim().length > 0) {
          return
        }
        // 手机号码验证通过
        // 验证是否有验证码插件对象
        if (this.captchaObj) {
          // 验证通过  初始化验证 码
        // this.showGeetest()
        // 如果用户输入 的手机号和之前初始化的验证码手机号不一致，就基于当前手机号重新初始化
        // 否则，直接 verify 显示
          if (this.form.mobile !== this.sendMobile) {
          // 重新初始化验证码插件

            // 重新初始化之前，将原来的验证码插件删除
            document.body.removeChild(document.querySelector('.geetest_panel'))
            this.showGeetest()
          } else {
            this.captchaObj.verify()
          }
        } else {
        // 这是第一次的初始化验证码
          this.showGeetest()
        }
      })
    },
    showGeetest () {
      // const { mobile } = this.form
      // 函数中的 function 函数中的 this 指向window
      // 初始化验证码时禁用按钮
      this.codeLoadging = true

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${this.form.mobile}`
      }).then(res => {
        const data = res.data.data
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏按钮式
          }, (captchaObj) => {
            this.captchaObj = captchaObj
            // 这里可以调用验证实例 captchaObj 的实例方法
            captchaObj.onReady(() => {
              // 只有 ready 了才能显示验证码
              this.sendMobile = this.form.mobile
              captchaObj.verify()

              // 验证码初始化完成后，解除禁用发送验证码按钮
              this.codeLoadging = false
            }).onSuccess(() => {
              console.dir(captchaObj.getValidate())
              const {
                geetest_challenge: challenge,
                geetest_validate: validate,
                geetest_seccode: seccode
              } = captchaObj.getValidate()
              axios({
                method: 'GET',
                url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${this.form.mobile}`,
                params: {
                  challenge,
                  validate,
                  seccode
                }
              }).then(res => {
                // 发送倒计时
                this.codeCountDown()
              })
            })
            // 这里可以调用验证实例 captchaObj 的实例方法
          }
        )
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSecons--
        if (this.codeSecons <= 0) {
          this.codeSecons = djs
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
        }
      }, 1000)
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
