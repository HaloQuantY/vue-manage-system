<template>
  <div class="home">
    HomePage
    <el-button @click="logout">logout</el-button>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
