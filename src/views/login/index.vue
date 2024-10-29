<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handleChange">{{ formType ? '返回登录' : '注册账号' }}</el-link>
            </div>
            <el-form ref="loginFormRef" :model="loginForm" style="max-width: 600px" class="demo-ruleForm"
                :rules="rules">
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginForm.passWord" type="password" placeholder="密码"
                        :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item v-if="formType" prop="validCode">
                    <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock"> <template #append>
                            <span @click="countdownChange">{{ countdown.validText }}</span>
                        </template></el-input>

                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button type="primary" :style="{ width: '100%' }" @click="submitForm(loginFormRef)">
                    {{ formType ? '注册' : '登录' }}
                </el-button>
            </el-form-item>
        </el-card>
    </el-row>
</template>

<script setup>
import { ref, reactive, computed, toRaw } from 'vue'
import { getCode, userAuthentication, login, menuPermissions } from '../../api'
//导入element-plus图标组件
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
// import { ElMessage } from 'element-plus';
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

//表单数据
const loginForm = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})
//切换表单（0登录 1注册）
const formType = ref(0)
//点击切换登录注册
const handleChange = () => {
    formType.value = formType.value ? 0 : 1
}

//账号检验规则
const validateUser = (rule, value, callback) => {
    //不能为空
    if (value === '') {
        callback(new Error('请输入账号'))
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对，请输入正确的手机号'))
    }
}

//密码校验
const validatePass = (rule, value, callback) => {
    //不能为空
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        const reg = /^[a-zA-Z0-9_-]{4,16}$/
        reg.test(value) ? callback() : callback(new Error('密码格式不对，需要4-16位字符，请确认格式'))
    }

}



//表单校验
const rules = {
    userName: [{ validator: validateUser, trigger: 'blur' }],
    passWord: [{ validator: validatePass, trigger: 'blur' }]
}
//发送短信验证码
const countdown = reactive({
    validText: '获取验证码',
    time: 60
})

let flag = false
const countdownChange = () => {
    //如果发送了验证码，不处理
    if (flag) return
    //判断手机号是否正确
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
        return ElMessage({
            message: '请检查手机号是否正确',
            type: 'warning'
        })
    }
    //倒计时
    const time = setInterval(() => {
        if (countdown.time <= 0) {
            countdown.time = 60
            countdown.validText = '获取验证码'
            flag = false
            clearInterval(time)
        } else {
            countdown.time -= 1
            countdown.validText = `剩余(${countdown.time})`
        }
    }, 1000)
    flag = true

    getCode({
        tel: loginForm.userName
    }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage.success('发送成功')
        }
    })
}

const router = useRouter()
const store = useStore()
const loginFormRef = ref()

const routerList = computed(() => store.state.menu.routerList)
//表单提交
const submitForm = async (formEl) => {
    if (!formEl) return
    //手动触发校验
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(loginForm, 'submit!')
            //注册页面
            if (formType.value) {
                userAuthentication(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage.success('注册成功，请登录')
                        //跳转到登录页面
                        formType.value = 0
                    }
                })
            } else {
                //登录页面
                login(loginForm).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage.success('登录成功')
                        console.log(data);
                        //将token和用户信息缓存到浏览器
                        localStorage.setItem('pz_token', data.data.token)
                        localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo))
                        // menuPermissions().then(({ data }) => {
                        //     store.commit('dynamicMenu', data.data)
                        //     console.log(routerList, 'routerList');
                        //     toRaw(routerList.value).forEach(item => {
                        //         router.addRoute('main', item)
                        //     })
                        //     //跳转到首页
                        //     router.push('/')
                        // })
                        router.push('/')
                    }
                })
            }
        } else {
            console.log('error submit!', fields);
        }

    })
}
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;
    background-image: url('../../assets/4bcd2607-1781-49ba-9788-eb98caf3ba64.jpg');
    background-size: cover;
    background-position: center;
    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>