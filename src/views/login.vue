<template>
  <div class="login">
    <div class="login-container">
      <div class="logo-container">
        <img src="~assets/img/logo.png" alt="" />
      </div>
      <el-form
        class="elFormContainer"
        ref="elFormContainer"
        :model="loginForm"
        :rules="formRules"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="用户名:admin"
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="密码:123456"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script >
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.elFormContainer.validate( async valid => {
        if (valid) {
          const { loginForm } = this;
          const {data} = await this.$http.post("/login", loginForm)
          if(data.meta.status !== 200) return this.$message.error({message: '登录失败'})
          const token = data.data.token;
          window.sessionStorage.setItem('token', token)
          this.$message.success({message: '登录成功'})
          this.$router.push('/home')
        }
      });
    },
    reset() {
      this.$refs.elFormContainer.resetFields();
    },
  },
};
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #2d4d6d;
}
.login-container {
  width: 500px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo-container {
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px solid #eee;
  overflow: hidden;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 10px #eee;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
}
.logo-container img {
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.elFormContainer {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  position: absolute;
  bottom: 5%;
}
.btns {
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
}
</style>