<template>
  <div >
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          show-icon>
        </el-alert>
        <el-row>
          <el-col>
            选择商品分类： 
            <el-cascader
              v-model="value"
              :options="options"
              :props="props"
              clearable
              @change="handleChange"
              ></el-cascader>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName"  @tab-click="handleClick" >
          <el-tab-pane label="动态参数" name="many" :disabled="!valueLength">
            <el-button type="primary" size="mini" :disabled="!valueLength"
            @click="addInfoDialog = true">添加参数</el-button>
             <el-table
              :data="manyData"
              style="width: 100%">
                <el-table-column type="expand">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(tag, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleClose(scope.row, i)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="$event.target.blur(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  label="#"
                  type="index">
                </el-table-column>
                <el-table-column
                  label="参数名称"
                  prop="attr_name">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template v-slot="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"
                    @click="editInfo(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                    @click="deleteInfo(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
             </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only" :disabled="!valueLength">
            <el-button type="primary" size="mini" :disabled="!valueLength"
            @click="addInfoDialog = true">添加属性</el-button>
            <el-table
              :data="onlyData"
              style="width: 100%">
                <el-table-column type="expand">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(tag, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      @close="handleClose(scope.row, i)">
                      {{tag}}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"                                      
                      @keyup.enter.native="$event.target.blur(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else  size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  label="#"
                  type="index">
                </el-table-column>
                <el-table-column
                  label="属性名称"
                  prop="attr_name">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template v-slot="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"
                    @click="editInfo(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                    @click="deleteInfo(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
             </el-table>
          </el-tab-pane>
        </el-tabs>
    </el-card>
    <!-- 添加属性对话框 -->
    <el-dialog
      :title="`添加${addDialogTitle}`"
      :visible.sync="addInfoDialog"
      width="50%"
      @close="addInfoDialogClose"
      >
      <el-form :model="addInfoForm" :rules="addInfoRules" ref="addInfoForm" label-width="100px" >
        <el-form-item :label="addDialogTitle" prop="content">
          <el-input v-model="addInfoForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑信息对话框 -->
    <el-dialog
      :title="`编辑${addDialogTitle}`"
      :visible.sync="editDialog"
      width="50%"
      @close="editDialogClose"
      >
      <el-form :model="editInfoForm" :rules="editInfoRules" ref="editInfoForm" label-width="120px">
        <el-form-item :label="`编辑${addDialogTitle}`" prop="attr_name">
          <el-input v-model="editInfoForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
export default {
  async created() {
    const {data} = await this.$http.get('categories')
    this.options = data.data
  },
  data() {
    return {
      value: [],//级联选择器value
      options: [],//级联选择器options
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },//级联选择器props
      activeName: 'many',//当前标签页
      manyData: [],
      onlyData: [],
      addInfoDialog: false,//添加属性/参数对话框
      addInfoForm: {
        content: '',
      },//添加参数对话框中表单
      addInfoRules: {
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      editDialog: false,//编辑信息对话框
      editInfoForm: {},
      editInfoRules: {
        attr_name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
    }
  },
  computed: {
    valueLength() {
      return this.value.length == 3
    },//判断数组长度
    cateId() {
      if(this.valueLength) {
        return this.value[this.value.length-1]
      }
      return false
    },//数组最后一位id
    addDialogTitle() {
      return this.activeName == 'many'? '动态参数':'静态属性'
    }
  },
  methods: {
    handleChange() {
      this.manyData = []
      this.onlyData = []
      if(!this.valueLength) return this.value = []
      this.handleClick()
    },//级联选择器选中节点发生变化
    async handleClick() {
      const id = this.value[this.value.length-1]
      const {data} = await this.$http.get(`categories/${id}/attributes`, {params:{sel:this.activeName}})
      if(data.meta.status !== 200) return this.$message.error('数据获取失败')
      data.data.forEach(e => {
        e.attr_vals = e.attr_vals?e.attr_vals.split(' '):[]
        e.inputVisible = false
        e.inputValue = ''
      })
      console.log(data.data)
      if(this.activeName === 'only') {
         this.onlyData = data.data
      }
      else{
         this.manyData = data.data
      }
    },//点击不同标签页
    addInfoDialogClose() {
      this.$refs.addInfoForm.resetFields()
    },//清空对话框中的表单
    addInfo() {
      this.$refs.addInfoForm.validate( async ok => {
        if(!ok) return
        const {data} = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addInfoForm.content,
          attr_sel: this.activeName
        }) 
        if(data.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success(data.meta.msg)
        this.addInfoDialog = false
        this.handleClick()
      })
    },//添加动态参数或静态属性
    deleteInfo(info) {
      this.$messageBox.confirm('此操作将永久删除该信息, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then( async val => {
        const {data} = await this.$http.delete(`categories/${this.cateId}/attributes/${info.attr_id}`)
        if(data.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success(data.meta.msg)
        this.handleClick()
      })
      .catch( error => this.$message("删除操作已取消"))
    },//删除属性
    async editInfo(info) {
      const {data} = await this.$http.get(`categories/${this.cateId}/attributes/${info.attr_id}`)
      if(data.meta.status !== 200) return this.$message.error('数据获取失败')
      this.editInfoForm = data.data
      this.editDialog = true
    },//打开编辑信息对话框
    editDialogClose() {
      this.$refs.editInfoForm.resetFields()
    },//编辑信息对话框,清空表单验证
    editCategory() {
      this.$refs.editInfoForm.validate(async ok => {
        if(ok) {
          const {data} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editInfoForm.attr_id}`, {
            attr_name: this.editInfoForm.attr_name,
            attr_sel: this.activeName,
          })
          if(data.meta.status !== 200) return this.$message.error('数据编辑失败')
          this.editDialog = false
          this.handleClick()
        }
      })
    },//编辑商品信息
    showInput(info) {
      info.inputVisible = true
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
    },
    async handleInputConfirm(info) {
      let a = info.inputValue.trim()
      if(a.length == 0) {
        info.inputVisible = false;
        info.inputValue = "";
        return
      }//空串没内容直接返回
      let i = info.attr_vals.findIndex(e => e == a
      )
      if(i !== -1) {
        info.inputVisible = false;
        info.inputValue = "";
        this.$message('请勿添加重复内容')
        return
      }//重复不添加
      info.attr_vals.push(a)
      const {data} = await this.changInfo(info)
      if(data.meta.status !== 200) return this.$message.error('添加失败')
      info.inputVisible = false;
      info.inputValue = "";
    },//添加tag
    async changInfo(info) {
      const data = await this.$http.put(`categories/${this.cateId}/attributes/${info.attr_id}`, {
        attr_name: info.attr_name,
        attr_sel: this.activeName,
        attr_vals: info.attr_vals.join(" "),
      })
      return data
    },
    async handleClose(info, index) {
      info.attr_vals.splice(index, 1)
      const {data} = await this.changInfo(info)
      if(data.meta.status !== 200) return this.$message.error('删除失败')
    },//删除标签
  }

}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-cascader {
  width: 300px;
}
.el-tag {
  margin: 0 10px;
}
.el-input {
  width: 150px;
}
</style>