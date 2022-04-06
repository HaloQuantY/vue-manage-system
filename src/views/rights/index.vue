<template>
  <div class="rights">
    <el-card>
      <el-table :data="rightsList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/api/rights'

export default {
  name: 'RightsPage',
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    selfGetRightsList () {
      getRightsList()
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rightsList = res.data
        })
    }
  },
  mounted () {
    this.selfGetRightsList()
  }
}
</script>
