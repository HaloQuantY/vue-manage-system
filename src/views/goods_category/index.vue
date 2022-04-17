<template>
  <div class="goods-category">
    <el-card>
      <el-row>
        <el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button>
      </el-row>

      <!-- 分类表格 -->
      <zk-table
      class="zkTable"
      :data="categoryListData.categoryList"
      :columns="tableData.columns"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      index-text="#"
      border
      :show-row-hover="false"
      >
        <!-- 是否有效(cat_deleted) -->
        <template slot="isValid" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序(cat_level) -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCategoryDialogOpenHandler(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategoryMessageBoxOpenHandler(scope.row)">删除</el-button>
        </template>
      </zk-table>

      <!-- 分页组件 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="categoryListData.categoryRequestParams.pagenum"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="categoryListData.categoryRequestParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="categoryListData.total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogData.dialogVisible" @close="addCategoryDialogCloseHandler">
      <el-form :model="addCategoryDialogData.formData" :rules="addCategoryDialogData.formRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addCategoryDialogData.formData.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
          v-model="addCategoryDialogData.cascaderSelectedKeys"
          :options="addCategoryDialogData.parentCategoryList"
          :props="addCategoryDialogData.cascaderProps"
          @change="parentCategoryChangeHandler"
          clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCategoryDialogData.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryDialogConfirmHandler">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCategoryDialogData.dialogVisible" @close="editCategoryDialogCloseHandler">
      <el-form :model="editCategoryDialogData.formData" :rules="editCategoryDialogData.formRules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editCategoryDialogData.formData.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCategoryDialogData.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryDialogConfirmHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addNewCategory, getParentCategoryList, editCategory, deleteCategory } from '@/api/category'

export default {
  name: 'GoodsCategoryPage',
  data () {
    return {
      categoryListData: {
        // 请求categoryList的参数对象
        categoryRequestParams: {
          // categoryList层数，可以是1，2，3或不指定，不指定时默认请求3层categoryList
          type: undefined,
          // 当前在第几页，不指定则默认请求所有数据
          pagenum: 1,
          // 页面数据的容量，不指定则默认请求所有数据
          pagesize: 5
        },
        categoryList: [],
        total: undefined
      },
      tableData: {
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            prop: 'cat_deleted',
            type: 'template',
            template: 'isValid'
          },
          {
            label: '排序',
            prop: 'cat_level',
            type: 'template',
            template: 'level'
          },
          {
            label: '操作',
            type: 'template',
            template: 'operation'
          }
        ]
      },
      addCategoryDialogData: {
        dialogVisible: false,
        formData: {
          name: '',
          // 父级分类id，默认为0表示一级分类
          pid: 0,
          // 默认为0，表示一级分类
          level: 0
        },
        formRules: {
          name: [
            {
              required: true, message: '请输入分类名称', trigger: 'blur'
            }
          ]
        },
        parentCategoryList: [],
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        cascaderSelectedKeys: []
      },
      editCategoryDialogData: {
        dialogVisible: false,
        formData: {
          name: ''
        },
        formRules: {
          name: [
            {
              required: true, message: '请输入分类名称', trigger: 'blur'
            }
          ]
        },
        cateId: 0
      }
    }
  },
  methods: {
    // 获得categoryList数据
    selfGetCategoryList () {
      getCategoryList(this.categoryListData.categoryRequestParams)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.categoryListData.categoryList = res.data.result
          this.categoryListData.total = res.data.total
          console.log('categoryList: ', this.categoryListData.categoryList)
        })
    },
    // 分页组件pagesize变化回调
    handleSizeChange (newSize) {
      this.categoryListData.categoryRequestParams.pagesize = newSize
      this.selfGetCategoryList()
    },
    // 分页组件pagenum变化回调
    handleCurrentChange (newPagenum) {
      this.categoryListData.categoryRequestParams.pagenum = newPagenum
      this.selfGetCategoryList()
    },
    // 打开添加分类对话框回调
    openAddCategoryDialog () {
      getParentCategoryList()
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.addCategoryDialogData.parentCategoryList = res.data
        })
      this.addCategoryDialogData.dialogVisible = true
    },
    // 添加分类对话框确认回调
    addCategoryDialogConfirmHandler () {
      const { pid, name, level } = this.addCategoryDialogData.formData
      addNewCategory(pid, name, level)
        .then(({ data: res }) => {
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.selfGetCategoryList()
          this.addCategoryDialogData.dialogVisible = false
        })
    },
    // 级联选择器选中回调
    parentCategoryChangeHandler () {
      const seletedKeys = this.addCategoryDialogData.cascaderSelectedKeys
      if (seletedKeys.length > 0) {
        this.addCategoryDialogData.formData.level = seletedKeys.length
        this.addCategoryDialogData.formData.pid = seletedKeys[seletedKeys.length - 1]
      } else {
        this.addCategoryDialogData.formData.level = 0
        this.addCategoryDialogData.formData.pid = 0
      }
    },
    // 添加分类对话框关闭回调，重置表单和级联选择器数据
    addCategoryDialogCloseHandler () {
      this.addCategoryDialogData.formData.name = ''
      this.addCategoryDialogData.formData.pid = 0
      this.addCategoryDialogData.formData.level = 0
      this.addCategoryDialogData.cascaderSelectedKeys = []
    },
    // 编辑分类对话框打开回调，获得对应分类原有cateId
    editCategoryDialogOpenHandler (cateInfo) {
      this.editCategoryDialogData.dialogVisible = true
      this.editCategoryDialogData.cateId = cateInfo.cat_id
    },
    // 编辑分类对话框确认回调，发送请求修改分类名称
    editCategoryDialogConfirmHandler () {
      const cateId = this.editCategoryDialogData.cateId
      const cateName = this.editCategoryDialogData.formData.name
      editCategory(cateId, cateName)
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.selfGetCategoryList()
          this.$message.success(res.meta.msg)
          this.editCategoryDialogData.dialogVisible = false
        })
    },
    // 编辑分类对话框关闭回调，将表单项数据进行重置
    editCategoryDialogCloseHandler () {
      this.editCategoryDialogData.cateId = 0
      this.editCategoryDialogData.formData.name = ''
    },
    // 删除分类messageBox打开回调
    deleteCategoryMessageBoxOpenHandler (cateInfo) {
      const cateId = cateInfo.cat_id
      this.$confirm('将对分类进行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(cateId)
          .then(({ data: res }) => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.selfGetCategoryList()
            this.$message.success(res.meta.msg)
          })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  },
  mounted () {
    this.selfGetCategoryList()
  }
}
</script>

<style lang="scss" scoped>
.zkTable {
  margin-top: 15px;
  margin-bottom: 15px;
  .el-icon-success {
    color: lightgreen;
  }
  .el-icon-error {
    color: crimson;
  }
}
.el-cascader {
  width: 100%;
}
</style>
