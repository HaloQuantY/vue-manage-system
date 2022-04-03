<template>
  <el-submenu :index="`${menuItem.order}`">
    <template slot="title">
      <i :class="iconObj[menuItem.id]"></i>
      <span>{{ menuItem.authName }}</span>
    </template>
    <el-menu-item-group>
      <el-menu-item
      v-for="item in menuItem.children"
      :key="item.id"
      :index="`/${item.path}`"
      >
        <i class="el-icon-menu"></i>
        <span slot="title">{{ item.authName }}</span>
      </el-menu-item>
    </el-menu-item-group>
  </el-submenu>
</template>

<script>
export default {
  name: 'MenuItem',
  props: ['menuItem', 'iconObj']
}
</script>
