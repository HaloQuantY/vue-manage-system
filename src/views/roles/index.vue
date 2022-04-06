<template>
  <div class="roles">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addNewRoleHanlder">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
            :class="{ 'bdbottom': true, 'bdtop': index === 0, 'flex-center': true }"
            v-for="(item, index) in scope.row.children"
            :key="item.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                :class="{ 'bdtop': innerIndex !== 0, 'flex-center': true }"
                v-for="(innerItem, innerIndex) in item.children"
                :key="innerItem.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable  @close="removeRightById(scope.row, innerItem.id)">
                      {{ innerItem.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                    type="warning"
                    closable
                    v-for="innerestItem in innerItem.children"
                    :key="innerestItem.id"
                    @close="removeRightById(scope.row, innerestItem.id)"
                    >
                      {{ innerestItem.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleHandler(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoleHandler(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="dispatchRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="addNewRoleDialogVisible"
    width="50%"
    @close="addNewRoleDialogCloseHandler('addNewRoleFormRef')"
    >
      <el-form
      :model="addNewRoleFormData"
      :rules="addNewRoleFormRules"
      ref="addNewRoleFormRef"
      label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addNewRoleFormData.roleName" placeholder="请填写角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addNewRoleFormData.roleDesc" placeholder="请填写角色描述"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addNewRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRoleFormSubmitHandler('addNewRoleFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
    title="添加角色"
    :visible.sync="editRoleDialogVisible"
    width="50%"
    >
      <el-form
      :model="editRoleFormData"
      :rules="addNewRoleFormRules"
      ref="editRoleFormRef"
      label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleFormData.roleName" placeholder="请填写角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleFormData.roleDesc" placeholder="请填写角色描述"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleFormSubmitHandler('editRoleFormRef')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
    title="分配权限"
    :visible.sync="dispatchRightDialogVisible"
    width="50%"
    @close="dispatchRightDialogCloseHandler"
    >
      <el-tree
      :props="rightsTreeProps"
      :data="rightsTree"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defaultCheckedIds"
      ref="dispatchTreeRef"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dispatchRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dispatchRightSubmitHandler('dispatchTreeRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, addNewRole, getRoleInfo, editRole, deleteRole, deleteRight, dispatchRight } from '@/api/roles'
import { getRightsTree } from '@/api/rights'

export default {
  name: 'RolesPage',
  data () {
    return {
      rolesList: [],
      addNewRoleDialogVisible: false,
      addNewRoleFormData: {
        roleName: '',
        roleDesc: ''
      },
      addNewRoleFormRules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述', trigger: 'blur' }
        ]
      },
      editRoleDialogVisible: false,
      editRoleFormData: {
        roleName: '',
        roleDesc: ''
      },
      dispatchRightDialogVisible: false,
      rightsTree: [],
      rightsTreeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckedIds: [],
      roleId: ''
    }
  },
  methods: {
    // 获得角色权限列表
    selfGetRolesList () {
      getRolesList()
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rolesList = res.data
          console.log(this.rolesList)
        })
    },
    // 添加角色按钮回调
    addNewRoleHanlder () {
      this.addNewRoleDialogVisible = true
    },
    // 添加角色对话框关闭 重置表单
    addNewRoleDialogCloseHandler (formRef) {
      this.$refs[formRef].resetFields()
    },
    // 添加角色对话框表单提交处理
    addNewRoleFormSubmitHandler (formRef) {
      this.$refs[formRef].validate((isValid) => {
        if (!isValid) {
          return this.$message.error('请填入合法信息')
        }
        // 发送请求完成添加操作
        addNewRole(this.addNewRoleFormData)
          .then(({ data: res }) => {
            if (res.meta.status !== 201) {
              this.$message.error(res.meta.msg)
            } else {
              this.selfGetRolesList()
              this.$message.success(res.meta.msg)
              this.addNewRoleDialogVisible = false
            }
          })
      })
    },
    // 编辑角色按钮点击回调
    editRoleHandler (roleId) {
      // 点击后根据角色id发送请求获得当前角色信息
      getRoleInfo(roleId)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editRoleFormData = res.data
          this.editRoleDialogVisible = true
        })
    },
    // 编辑角色信息表单
    editRoleFormSubmitHandler (formRef) {
      this.$refs[formRef].validate((isValid) => {
        if (!isValid) {
          return this.$message.error('请填入合法信息')
        }
        console.log(this.editRoleFormData)
        const { roleId, roleName, roleDesc } = this.editRoleFormData
        // 将角色信息表单信息提交后端完成编辑操作
        editRole(roleId, roleName, roleDesc)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              this.selfGetRolesList()
              this.$message.success(res.meta.msg)
              this.editRoleDialogVisible = false
            }
          })
      })
    },
    // 删除角色按钮点击回调
    deleteRoleHandler (roleId) {
      // 弹出messagebox
      this.$confirm('此操作将永久删除角色信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认后使用角色id向后端发送请求删除角色
        deleteRole(roleId)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              this.selfGetRolesList()
              this.$message.success(res.meta.msg)
            }
          })
      // 取消后关闭messagebox，弹出提示信息
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 角色下权限信息tag点击删除回调
    removeRightById (role, rightId) {
      // 弹出messagebox
      this.$confirm('此操作将永久删除权限，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除权限，获得角色id和权限id并发送请求完成删除操作
        const roleId = role.id
        deleteRight(roleId, rightId)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              role.children = res.data
              this.$message.success(res.meta.msg)
            }
          })
      }).catch(() => {
        this.$message.info('已取消权限删除')
      })
    },
    // 分配权限按钮点击回调
    dispatchRight (role) {
      // 获得roleId并保存，为之后的分配权限提交回调准备
      this.roleId = role.id
      // 根据角色信息获得默认勾选权限
      this.getDefaultKeysArr(role, this.defaultCheckedIds)
      // 获得所有权限列表
      getRightsTree()
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.rightsTree = res.data
          this.dispatchRightDialogVisible = true
        })
    },
    // 根据角色信息node递归返回默认勾选的三级权限
    getDefaultKeysArr (node, arr) {
      // 没有children则为三级权限
      if (!node.children || node.children.length === 0) {
        arr.push(node.id)
        return
      }
      node.children.forEach(childNode => {
        this.getDefaultKeysArr(childNode, this.defaultCheckedIds)
      })
    },
    // 分配角色对话框关闭 重置默认勾选权限列表和角色id
    dispatchRightDialogCloseHandler () {
      this.defaultCheckedIds = []
      this.roleId = ''
    },
    // 提交分配角色权限
    dispatchRightSubmitHandler (dispatchTreeRef) {
      console.log(this.roleId)
      const tree = this.$refs[dispatchTreeRef]
      // 获得当前被勾选的权限列表
      let checkedKeys = [...tree.getCheckedKeys(), ...tree.getHalfCheckedKeys()]
      // 转为由逗号分隔的字符串
      checkedKeys = checkedKeys.join(',')
      // 根据角色id和已勾选权限字符串发送请求，更新当前角色权限
      dispatchRight(this.roleId, checkedKeys)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.selfGetRolesList()
          this.dispatchRightDialogVisible = false
        })
    }
  },
  mounted () {
    this.selfGetRolesList()
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
