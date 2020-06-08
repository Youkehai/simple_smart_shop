<template>
  <div class="login-container">
    <el-form ref="loginForm" v-if="formType=='login'" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">smartshop</h3>
      </div>

      <el-form-item prop="username" v-if="loginType=='password'">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password" v-if="loginType=='password'">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'"></i>
          </span>
        </el-form-item>
      </el-tooltip>
	  <el-form-item prop="email" v-if="loginType=='code'">
	  		  <span class="svg-container">
	  		    <i class="el-icon-suitcase-1"></i>
	  		  </span>
	  <el-input
	      ref="name"
	      v-model="loginForm.email"
	      placeholder="请输入邮箱"
	      name="name"
	      type="text"
	      tabindex="1"
	      autocomplete="on"
	    >
	  		<el-button slot="append"  :disabled="disable" @click="getCode()">获取验证码{{codeTime}}</el-button>
	  		</el-input>
	  </el-form-item>
	  <el-form-item prop="code" v-if="loginType=='code'">
	  		  <span class="svg-container">
	  		    <i class="el-icon-warning-outline"></i>
	  		  </span>
	  <el-input
	      ref="name"
	      v-model="loginForm.code"
	      placeholder="请输入验证码"
	      name="name"
	      type="text"
	      tabindex="1"
	      autocomplete="on"
	    />
	  </el-form-item>
     <div style="position:relative;float: left;">
         <div class="tips">
          <el-button type='text' @click="formType='regist'">注册</el-button>
        </div>
      </div>
	  <div style="position:relative;float: right;">
	      <div class="tips">
	       <el-button type='text' @click="loginType='code'">验证码登录</el-button>
	     </div>
	   </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" v-if="loginType=='password'" @click.native.prevent="handleLogin">登录</el-button>
	  <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" v-else @click.native.prevent="codeLogin">登录</el-button>
    </el-form>


    <el-form ref="registForm" v-if="formType=='regist'" :model="registForm" :rules="registRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">smartshop</h3>
      </div>
			<el-steps :active="active" finish-status="success">
			  <el-step title="账号信息"></el-step>
			  <el-step title="企业信息"></el-step>
			  <el-step title="注册成功"></el-step>
			</el-steps>
      <el-form-item prop="username" v-if="active==1">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="name"
          v-model="registForm.name"
          placeholder="请输入商户名称"
          name="name"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
	  <el-form-item prop="cardNum" v-if="active==1">
	    <span class="svg-container">
	      <i class="el-icon-user-solid"></i>
	    </span>
	    <el-input
	      ref="name"
	      v-model="registForm.cardNum"
	      placeholder="统一社会信用代码"
	      name="name"
	      type="text"
	      tabindex="1"
	      autocomplete="on"
	    />
	  </el-form-item>
	  <el-form-item prop="email"  v-if="active==0">
		  <span class="svg-container">
		    <i class="el-icon-suitcase-1"></i>
		  </span>
	  <el-input
	      ref="name"
	      v-model="registForm.email"
	      placeholder="请输入邮箱"
	      name="name"
	      type="text"
	      tabindex="1"
	      autocomplete="on"
	    >
		<el-button slot="append"  :disabled="disable" @click="validateEmail()">获取验证码{{codeTime}}</el-button>
		</el-input>
	  </el-form-item>
	  <el-form-item prop="code" v-if="active==0">
		  <span class="svg-container">
		    <i class="el-icon-warning-outline"></i>
		  </span>
	  <el-input
	      ref="name"
	      v-model="registForm.code"
	      placeholder="请输入验证码"
	      name="name"
	      type="text"
	      tabindex="1"
	      autocomplete="on"
	    />
	  </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual v-if="active==0">
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleRegist"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'"></i>
          </span>
        </el-form-item>
      </el-tooltip>
     <div style="position:relative;float: left;">
         <div class="tips">
          <el-button type='text' @click="formType='login'">登录</el-button>
        </div>
      </div>
			<el-button :loading="loading" type="primary" v-if="active==0" style="width:100%;margin-bottom:30px;" @click.native.prevent="validateCode">下一步</el-button>
      <el-button :loading="loading" type="primary" v-if="active==1" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegist">注册</el-button>
			<el-button :loading="loading" type="primary" v-if="active==2" style="width:100%;margin-bottom:30px;" @click.native.prevent="login">立即登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位数'))
      } else {
        callback()
      }
    }
	const validateEmail = (rule, value, callback) => {
	  if (value.indexOf("@") ==-1) {
	    callback(new Error('请输入正确的邮箱'))
	  } else {
	    callback()
	  }
	}
    return {
			 active: 0,
		loginType:'password',
		codeTime:'',
		disable:false,
      loginForm: {
        username: '15574996662@163.com',
        password: '123456',
		email:'',
		code:''
      },
      registForm:{
        name:'',
		email:'',
		code:'',
        password:'',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
		email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
		code: [{ required: true, trigger: 'blur', message: '请输入验证码', }],
      },
      registRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称', }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
		cardNum:[{required: true, trigger: 'blur', message: '请输入统一社会信用代码',}]
      },
      formType:'login',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
	  goUrl:'/'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
	  if(this.$route.query.recditUrl){
		  this.goUrl=this.$route.query.recditUrl
	  }
    // this.$notify({
    //     title: '账号',
    //     dangerouslyUseHTMLString: true,
    //     message: '管理员账号:1000 <br>普通用户:1005 <br>密码都是123456',
    //      // showClose: false,
    //      duration: 0
    //   });
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  //管理员账号密码：1000 12345678
  methods: {
	validateCode(){
		if(!this.registForm.email){
			 this.$message.error("请输入邮箱")
			 return false
		}
		if(this.registForm.email.indexOf("@")==-1){
			this.$message.error("请输入正确的邮箱")
			return false
		}
		if(!this.registForm.code){
			 this.$message.error("请输入验证码")
			 return false
		}
		let that=this
		y.post('/api/open/user/validateCode?email='+this.registForm.email+"&code="+this.registForm.code,{},data=>{
			if(data && data.success){
				that.active++
			}else{
				 y.error(data.message)
			}
		})
	},
	  validateEmail(){//验证邮箱是否注册
	  if(!this.registForm.email){
	  	 this.$message.error("请输入邮箱")
	  	 return false
	  }
	  if(this.registForm.email.indexOf("@")==-1){
	  	this.$message.error("请输入正确的邮箱")
	  	return false
	  }
	  var that=this
		  y.get('/api/open/user/emailRegist?email='+this.registForm.email,{},function(data){
			  if(data && data.success){
				  that.getCode()
				  return true
			  }else{
				  y.error("该邮箱已注册")
				  return false
			  }
		  })
	  },
	  codeLogin(){
		  this.$refs.loginForm.validate(valid => {
		    if (valid) {
		      this.loading = true
		      //请求登录接口并跳转
		      var loginUser={
		        email:this.loginForm.username,
		        code:this.loginForm.password
		      }
		      y.post('/api/open/user/codeLogin',loginUser,function(data){
		        if(data &&data.success){
		          y.setVal("jwt",data.attributes.token)
		          y.setVal("userInfo",JSON.stringify(data.data))//放入用户信息
		          y.success("登录成功")
		          y.go(that.goUrl)
		        }else{
		          that.loading = false
		          y.error("账号或密码不正确")
		        }
		      })
		    } else {
		      console.log('error submit!!')
		      return false
		    }
		  })
	  },
	 getCode(){
	 	var that=this;
		var email=""
		if(this.formType=='login'){
			if(!this.loginForm.email){
				 this.$message.error("请输入邮箱")
				 return false
			}
			if(this.loginForm.email.indexOf("@")==-1){
				this.$message.error("请输入正确的邮箱")
				return false
			}
			email=this.loginForm.email
		}else{
			if(!this.registForm.email){
				 this.$message.error("请输入邮箱")
				 return false
			}
			if(this.registForm.email.indexOf("@")==-1){
				this.$message.error("请输入正确的邮箱")
				return false
			}
			email=this.registForm.email
		}
	 	y.post('/api/open/user/sendEmail?email='+email,{},function(data){
	 		if(data && data.success){
	 			that.$message.success("发送成功");
	 			that.disable=true
	 			that.codeTime=10
	 			var timeInterval = setInterval(() => {
	 				that.codeTime--;
	 				if(that.codeTime==0){
	 					that.codeTime=''
	 					that.disable=false
	 					clearInterval(timeInterval)
	 				}
	 			}, 1000)
	 		}else{
	 			that.$message.error(data.message);
	 		}
	 	})
	 	
	  },
    handleRegist(){
      var that=this;
    this.$refs.registForm.validate(valid => {
        if (valid) {
          y.post('/api/open/user/regist',this.registForm,function(data){
            if(data && data.success){
              y.success("注册成功")
               that.$notify({
                  title: '提示',
                   type: 'success',
                  message: '您的登录账号为'+data.data.username+"您可使用邮箱或账号登录",
                  duration: 0
                });
				that.active++
      //         var loginUser={
      //           email:data.data.username,
      //           password:that.registForm.password
      //         }
      //         y.post('/api/open/user/login',loginUser,function(data1){
      //           if(data1 &&data1.success){
      //             y.setVal("jwt",data1.attributes.token)
      //             y.setVal("userInfo",JSON.stringify(data1.data))//放入用户信息
				  // y.go(that.goUrl)
      //             y.success("登录成功")
      //           }else{
      //             that.loading = false
      //             y.error("账号或密码不正确")
      //           }
      //         })
            }else{
              y.error(data.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
	login(){
		let that=this
		var loginUser={
		  email:that.registForm.email,
		  password:that.registForm.password
		}
		y.post('/api/open/user/login',loginUser,function(data1){
		  if(data1 &&data1.success){
			y.setVal("jwt",data1.attributes.token)
			y.setVal("userInfo",JSON.stringify(data1.data))//放入用户信息
				  y.go(that.goUrl)
			y.success("登录成功")
		  }else{
			that.loading = false
			y.error("账号或密码不正确")
		  }
		})
	},
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      var that=this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          //请求登录接口并跳转
          var loginUser={
            email:this.loginForm.username,
            password:this.loginForm.password
          }
          y.post('/api/open/user/login',loginUser,function(data){
            if(data &&data.success){
              y.setVal("jwt",data.attributes.token)
              y.setVal("userInfo",JSON.stringify(data.data))//放入用户信息
              y.success("登录成功")
              y.go(that.goUrl)//如果是管理员跳转首页
            }else{
              that.loading = false
              y.error("账号或密码不正确")
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
  //  display: inline-block;
   // height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      color: $light_gray;
     height: 47px;
      caret-color: $cursor;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 1000px;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
