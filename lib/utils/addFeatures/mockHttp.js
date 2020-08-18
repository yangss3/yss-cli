const fs = require('fs-extra')
const path = require('path')
const execCmd = require('../execCmd')

module.exports = async function (dist) {
  const mockHttpJs = `import MockAdapter from 'axios-mock-adapter'
    import http from '../request/http'

    const mock = new MockAdapter(http)

    mock.onPost('/api/login').reply(config => {
      const { username } = JSON.parse(config.data)
      return [
        200,
        {
          status: 'ok',
          data: {
            token: 'fj1240c06mw0fcxldm54',
            username
          }
        }
      ]
    })

    mock.onPost('/api/logout').reply(config => {
      return [
        200,
        {
          status: 'ok'
        }
      ]
    })
    `
  const mainJs = `import Vue from 'vue'
    import App from './App.vue'
    import router from './router'
    import store from './store'
    import http from './request'
    import './plugins'
    import './components'

    // mock HTTP 请求，只能用于开发环境，生产环境下请注释或删除下面这行
    import './__mock__/http'

    Vue.prototype.$http = http
    Vue.config.productionTip = false

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    `
  const routerJs = `import Vue from 'vue'
    import VueRouter from 'vue-router'
    import routes from './routes'
    import store from '../store'

    Vue.use(VueRouter)

    const router = new VueRouter({
      mode: 'history',
      base: process.env.BASE_URL,
      routes
    })

    router.beforeEach((to, from, next) => {
      document.title = to.meta?.title || ''
      if (to.matched.some(route => route.meta.requiresAuth)) {
        if (!store.state.auth?.token) {
          return next({
            path: '/login',
            query: { redirect: to.fullPath }
          }) 
        }
      }
      next()
    })

    export default router
    `
  const loginVue = `<template>
  <div>
    <h1 class="__text-center">欢迎登陆</h1>
    <div class="__p-5">
      <van-cell-group>
        <van-field v-model="username" label="用户名" placeholder="请输入用户名" />
        <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" />
      </van-cell-group>
      <van-button class="__mt-4" type="primary" block round @click="login">登录</van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      })
    }
  }
}
</script>
`
  const myVue = `<template>
  <base-layout>
    <base-header class="__elevation-1">
      <van-nav-bar :title="$route.meta.title" />
    </base-header>
    <base-content class="__px-4">
      <van-button class="__mb-4" block round @click="logout">退出</van-button>
    </base-content>
  </base-layout>
</template>

<script>
export default {
  name: 'my',
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>
`

  const mockHttpJsPath = path.resolve(dist, 'src/__mock__/http.js')
  const mainJsPath = path.resolve(dist, 'src/main.js')
  const routerJsPath = path.resolve(dist, 'src/router/index.js')
  const loginVuePath = path.resolve(dist, 'src/views/login/index.vue')
  const myVuePath = path.resolve(dist, 'src/views/main/my/index.vue')

  await Promise.all([
    fs.outputFile(mockHttpJsPath, mockHttpJs),
    fs.outputFile(mainJsPath, mainJs),
    fs.outputFile(routerJsPath, routerJs),
    fs.outputFile(loginVuePath, loginVue),
    fs.outputFile(myVuePath, myVue),
    execCmd(`npm i axios-mock-adapter -D`)
  ])
}
