<template>
  <el-menu
  class="el-menu-vertical-demo"
  background-color="#333744"
  text-color="#fff"
  active-text-color="#ffd04b"
  unique-opened
  router
  :default-active="activeIndex"
  @select="onSelectHandler"
  >
    <MenuItem v-for="item in menuData" :key="item.id" :menuItem="item" :iconObj="iconObj"/>
  </el-menu>
</template>

<script>
import { getMenuList } from '@/api/menu'
import MenuItem from './MenuItem.vue'

export default {
  name: 'MenuComponent',
  components: {
    MenuItem
  },
  data () {
    return {
      menuData: [],
      iconObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      activeIndex: ''
    }
  },
  methods: {
    getMenuData () {
      getMenuList()
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.menuData = res.data
            console.log(this.menuData)
          } else {
            this.$message.error(res.meta.msg)
          }
        })
    },
    onSelectHandler (index) {
      this.activeIndex = index
    }
  },
  mounted () {
    this.getMenuData()
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  border: none;
}
</style>
