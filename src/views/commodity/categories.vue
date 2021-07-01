<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button></el-col>
      </el-row>
      <vue-tree
        class="vue-tree"
        :data="allCategories"
        :columns="columns"
        :show-index="true"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <template #valid="scope">
          <i
            class="el-icon-circle-check"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen; font-size: 15px"
          ></i>
          <i
            class="el-icon-circle-close"
            v-else
            style="color: lightgreen; font-size: 15px"
          ></i>
        </template>
        <template #level="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level == 2">三级</el-tag>
        </template>
        <template #operation="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            @click="editCategory(scope.row)">编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            @click="deletaCategory(scope.row)">删除</el-button
          >
        </template>
      </vue-tree>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-row-hover="false"
        :current-page="1"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialog"
      width="50%"
      @close="addCategoryDialogClose"
    >
      <el-form :model="addCategory"  :rules="rules" ref="addCategoryForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCategory.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称:" >
          <el-cascader
            v-model="parent"
            :options="options"
            :props="props"
            clearable	
            >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="cascaderChange"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCategoryDialog"
      width="50%"
      class="special"
      >
      <span>分类名称 &nbsp;&nbsp;&nbsp;</span><el-input  v-model="cate.cat_name" ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
export default {
  created() {
    this.getCategories();
  },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      allCategories: [], //全部商品分类数据
      total: 0, //总分类数量
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "valid",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addCategoryDialog: false,//添加分类对话框
      editCategoryDialog: false,//编辑分类对话框
      cate: {cat_name: ''},//分类新名称,用于put与delete请求
      ruleForm: {
        cat_name: '',
      },
      rules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      addCategory: {
        cat_pid: 0,//父级分类ID
        cat_name: '',
        cat_level: 0,
      },
      parent: [],
      options: [],//级联选择器配置
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true,
      },//级联选择器配置
    };
  },
  methods: {
    async getCategories() {
      const { data } = await this.$http("/categories", {
        params: this.queryInfo,
      });
      console.log(data);
      if (data.meta.status !== 200)
        return this.$message.error("分类数据获取失败");
      this.$message.success(data.meta.msg);
      this.total = data.data.total;
      this.allCategories = data.data.result;
    }, //获取全部商品分类
    handleSizeChange(newV) {
      this.queryInfo.pagesize = newV;
      this.getCategories();
    },
    handleCurrentChange(newV) {
      this.queryInfo.pagenum = newV;
      this.getCategories();
    },
    async showAddCategoryDialog() {
      const {data} = await this.$http.get('categories',{params:{type:2}})
      this.options = data.data
      this.addCategoryDialog = true
    },
    addCategoryDialogClose() {
      this.parent = []
      this.addCategory.cat_name = ""
      this.addCategory.cat_pid = 0
      this.addCategory.cat_level = 0
    },//增加分类对话框关闭，重置相关信息
    cascaderChange() {
      this.$refs.addCategoryForm.validate( async ok => {
        if(ok) {
          if(this.parent.length > 0) {
            this.addCategory.cat_pid = this.parent[this.parent.length-1]
            this.addCategory.cat_level = this.parent.length
          }
          else {
            this.addCategory.cat_pid = 0
            this.addCategory.cat_level = 0
          }
        }
        const {data} = await this.$http.post('/categories',this.addCategory)
        console.log(data)
        if(data.meta.status !== 201) return this.$message.error("创建失败")
        this.$message.success(data.meta.msg)
        this.addCategoryDialog = false
        this.getCategories()
      })
    },
    async editCategory(info) {
      console.log(info)
      const {data} = await this.$http.get(`categories/${info.cat_id}`)
      this.cate = data.data
      this.editCategoryDialog = true
    },//点击编辑按钮，展示编辑对话框
    async editCategoryName() {
      if(!this.cate.cat_name) return this.$message.error('分类名称不能为空')
      const {data} = await this.$http.put(`categories/${this.cate.cat_id}`,{cat_name:this.cate.cat_name})
      if(data.meta.status !== 200) return this.$message.error('分类名称更新失败')
      this.$message.success(data.meta.msg)
      this.editCategoryDialog = false
      this.getCategories()
    },//更新分类名称
    async deletaCategory(info) {
      this.cate = info
      this.$messageBox.confirm(`是否确认删除此${info.cat_name}分类`,'警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then( async val => {
        const {data} = await this.$http.delete(`categories/${this.cate.cat_id}`)
        if(data.meta.status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功!')
        this.getCategories()
      })
      .catch(error => this.$message('删除操作已取消'))
    },//删除分类
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.vue-tree {
  margin: 15px 0;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
.el-cascader {
  width: 100%;
}
.special .el-input {
  width: 85%;
}
</style>