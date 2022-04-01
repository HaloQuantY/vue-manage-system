<template>
  <div class="login">
    <div class="login__wrapper">
      <div class="avatar-box">
        <img src="../assets/images/logo.png" alt="avatar">
      </div>
      <div class="form-box">
        <el-form ref="loginForm" :model="form" :rules="validatorRules" size="medium">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginRequest } from '@/api/login.js'

export default {
  name: 'LoginComponent',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      validatorRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 11, message: '用户名长度为3-11位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '密码为6-11位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      const username = this.form.username
      const password = this.form.password
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.$message.error('用户名或密码不符合规则，请确认后提交')
        } else {
          loginRequest(username, password)
            .then(({ data: res }) => {
              if (res.meta.status === 200) {
                this.$message.success(res.meta.msg)
                window.sessionStorage.setItem('token', res.data.token)
                this.$router.push('/home')
              } else {
                this.$message.error(res.meta.msg)
              }
            })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #2b4b6b;
  .login__wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .avatar-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .form-box {
      position: absolute;
      right: 20px;
      bottom: 0;
      left: 20px;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
