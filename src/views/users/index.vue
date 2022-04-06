<template>
  <div class="users">
    <el-card>
      <el-row :gutter="20" style="margin-bottom: 15px">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model.lazy="query"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="filteredUserList" border stripe style="margin-bottom: 15px">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="switchChangeHandler(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 右侧用户操作按钮 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserHandler(scope.row)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="dispatchUserRoleHandler(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userListParams.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="userListParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addUserDialogVisible"
    width="50%"
    @close="dialogCloseHandler('addForm')"
    >
      <el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"  show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddFormHandler('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
    title="编辑用户"
    :visible.sync="editUserDialogVisible"
    width="50%"
    >
      <el-form :model="editForm" status-icon :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditFormHandler('editForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="dispatchUserRoleDialogVisible"
    width="50%"
    @close="dispatchUserRoleDialogCloseHandler"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          <span>分配新角色：</span>
          <el-select v-model="selectedRoleId" placeholder="请选择新角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dispatchUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dispatchUserRoleSubmitHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, changeUserStatus, addNewUser, getUserInfo, editUser, deleteUser, dispatchUserRole } from '@/api/users'
import { getRolesList } from '@/api/roles.js'

export default {
  name: 'UsersPage',
  data () {
    const checkEmail = function (rule, value, callback) {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    const checkMobile = function (rule, value, callback) {
      const regMobile = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }

    return {
      // 用户列表数据
      userList: [],
      userListParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      query: '',
      // 添加用户对话框是否展示
      addUserDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3-10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3-10位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户对话框是否展示
      editUserDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      dispatchUserRoleDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectedRoleId: ''
    }
  },
  methods: {
    // 获得用户列表
    selfGetUserList (params) {
      getUserList(params)
        .then(({ data: res }) => {
          if (res.meta.status === 200) {
            this.userList = res.data.users
            this.total = res.data.total
          } else {
            this.$message.error(`请求错误：${res.meta.msg}`)
          }
        })
    },
    handleSizeChange (newSize) {
      this.userListParams.pagesize = newSize
      this.selfGetUserList(this.userListParams)
    },
    handleCurrentChange (newPage) {
      this.userListParams.pagenum = newPage
      this.selfGetUserList(this.userListParams)
    },
    switchChangeHandler (userInfo) {
      const id = userInfo.id
      const status = userInfo.mg_state
      changeUserStatus(id, status)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
            userInfo.mg_state = !userInfo.mg_state
          } else {
            console.log(res.data)
          }
        })
    },
    dialogCloseHandler (formRef) {
      this.$refs[formRef].resetFields()
    },
    submitAddFormHandler (formRef) {
      this.$refs[formRef].validate((isValid) => {
        if (!isValid) {
          return
        }
        addNewUser(this.addForm)
          .then(({ data: res }) => {
            if (res.meta.status === 201) {
              this.$message.success(res.meta.msg)
              this.selfGetUserList(this.userListParams)
              this.addUserDialogVisible = false
            } else {
              this.$message.error(res.meta.msg)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      })
    },
    // 显示修改用户对话框
    showEditDialog (userInfo) {
      this.editUserDialogVisible = true
      // user.js引入，根据id获得用户信息
      getUserInfo(userInfo.id)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.editForm = res.data
        })
    },
    // 提交修改用户表单
    submitEditFormHandler (formRef) {
      this.$refs[formRef].validate((isValid) => {
        if (!isValid) {
          return
        }
        editUser(this.editForm)
          .then(({ data: res }) => {
            if (res.meta.status === 200) {
              this.$message.success(res.meta.msg)
              this.selfGetUserList(this.userListParams)
              this.editUserDialogVisible = false
            } else {
              this.$message.error(res.meta.msg)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
      })
    },
    // 删除用户
    deleteUserHandler (userInfo) {
      // 弹出messageBox询问是否删除用户数据
      this.$confirm(`此操作将永久删除用户${userInfo.username}的信息，是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 根据id删除对应用户数据
        deleteUser(userInfo.id)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              this.$message.error(res.meta.msg)
            } else {
              this.selfGetUserList(this.userListParams)
              this.$message.success('用户删除成功')
            }
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    dispatchUserRoleHandler (userInfo) {
      this.userInfo = userInfo
      this.selfGetRoleList()
      this.dispatchUserRoleDialogVisible = true
    },
    selfGetRoleList () {
      getRolesList()
        .then(({ data: res }) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.roleList = res.data
          console.log(this.roleList)
        })
    },
    dispatchUserRoleDialogCloseHandler () {
      this.selectedRoleId = ''
    },
    dispatchUserRoleSubmitHandler () {
      dispatchUserRole(this.userInfo.id, this.selectedRoleId)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.selfGetUserList(this.userListParams)
          this.$message.success(res.meta.msg)
          this.dispatchUserRoleDialogVisible = false
        })
    }
  },
  computed: {
    // 搜索框过滤用户名
    filteredUserList () {
      if (this.query === '') {
        return this.userList
      }
      return this.userList.filter(item => item.username.includes(this.query))
    }
  },
  mounted () {
    this.selfGetUserList(this.userListParams)
  }
}
</script>
