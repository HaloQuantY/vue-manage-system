<template>
  <div class="layout">
    <el-container class="layout__container">
      <el-header class="layout__container__header">
        <div class="titlebox">
          <img src="../assets/images/heima.png" alt="logo">
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="logout">logout</el-button>
      </el-header>

      <el-container class="layout__container__inner-container">
        <el-aside width="200px">
          <MenuComponent/>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MenuComponent from './menu'

export default {
  name: 'LayoutComponent',
  components: {
    MenuComponent
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse () {
      this.isMenuCollapse = !this.isMenuCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .layout__container {
    height: 100%;
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 0;
      line-height: 60px;
      background-color: #373d41;
      color: #333;
      .titlebox {
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
        span {
          font-size: 24px;
          color: #eee;
        }
      }
    }
    &__inner-container {
      .el-aside {
        background-color: #333744;
      }
    }
  }
}
</style>
