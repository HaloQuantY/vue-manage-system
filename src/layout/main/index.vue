<template>
  <div class="main-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MainContent'
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
