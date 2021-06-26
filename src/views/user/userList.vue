<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409EFF"
              inactive-color="#DCDFE6"
              @change="switchChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-tooltip
              placement="top"
              content="修改用户信息"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserInfo(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              content="删除用户"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              placement="top"
              content="设置用户信息"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        id="el-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="addUserForm"
        :rules="rules"
        ref="addUserForm"
        label-width="70px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="clearEditForm"
    >
      <el-form
        :model="editUserdata"
        :rules="editRules"
        ref="editFormREF"
        label-width="70px"
        
      >
        <el-form-item label="用户名" >
          <el-input v-model="editUserdata.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserdata.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserdata.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script >
export default {
  created() {
    this.getUserList();
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      var check = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (value == "") return callback(new Error("邮箱不能为空"));
      if (!check.test(value)) return callback(new Error("邮箱格式不正确"));
      callback();
    };
    var checkMobile = (rule, value, callback) => {
      var check = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (value == "") return callback(new Error("手机号不能为空"));
      if (!check.test(value)) return callback(new Error("手机号格式不正确"));
      callback();
    };

    return {
      query: "",
      pagenum: 1, //当前是第几页
      pagesize: 5, //每页多少条数据
      userList: [],
      total: 0,
      dialogVisible: false, //展示增加用户对话框
      editDialogVisible: false, //展示修改用户对话框
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, //新增用户信息
      editUserdata: {
        // username: "",
        // email: "",
        // mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [{required: true, validator: checkEmail, trigger: "blur" }],
        mobile: [{required: true, validator: checkMobile, trigger: "blur" }],
      }, //新增用户信息的表单验证
      editRules: {
        email: [{required: true, validator: checkEmail, trigger: "blur" }],
        mobile: [{required: true, validator: checkMobile, trigger: "blur" }],
      },//更改用户信息的表单验证
    };
  },
  methods: {
    async getUserList() {
      const { query, pagenum, pagesize } = this;
      let { data } = await this.$http.get("/users", {
        params: {
          query,
          pagenum,
          pagesize,
        },
      });
      console.log(data);
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      this.total = data.data.total;
      this.userList = data.data.users;
    }, //获取用户列表
    handleSizeChange(data) {
      this.pagesize = data;
      this.getUserList();
    },
    handleCurrentChange(data) {
      this.pagenum = data;
      this.getUserList();
    },
    async switchChange(newV) {
      const { data } = await this.$http.put(
        `users/${newV.id}/state/${newV.mg_state}`
      );
      console.log(data);
      if (data.meta.status !== 200) {
        newV.mg_state = !newV.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success(data.meta.msg);
    }, //switch开关状态变化
    dialogClose() {
      this.$refs.addUserForm.resetFields();
    }, // dialong弹窗关闭，清空表格信息
    addUser() {
      this.$refs.addUserForm.validate(async (ok) => {
        if (ok) {
          const { data } = await this.$http.post("/users", this.addUserForm);
          if (data.meta.status !== 201)
            return this.$message.error("添加用户失败");
          this.$message.success(data.meta.msg);
          this.dialogVisible = false;
        }
      });
      this.getUserList()
    },
    async editUserInfo(id) {
      const {data} = await this.$http.get(`/users/${id}`)
      if(data.meta.status !== 200) return this.$message.error('获取失败')
      this.editUserdata = data.data
      this.editDialogVisible = true
    }, //根据用户id获取相关信息
    clearEditForm() {
      this.$refs.editFormREF.resetFields()
    }, //清空editForm
    changeUserInfo() {
      this.$refs.editFormREF.validate( async ok => {
        if(ok) {
          const {data} = await this.$http.put(`/users/${this.editUserdata.id}`,{
            email: this.editUserdata.email,
            mobile: this.editUserdata.mobile
          })
          if(data.meta.status !== 200) return this.$message.error('更新失败')
          this.$message.success(data.meta.msg)
          this.editDialogVisible = false
        }
      })
      this.getUserList()
    },//发送更改用户信息的请求
    async deleteUser(user) {
      const data = await this.$messageBox.confirm(`是否确认删除${user.username}此用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => this.$message('已取消删除'))
      if(data == 'confirm') {
        const {data} = await this.$http.delete('/users/' + user.id)
        if(data.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success(data.meta.msg)
        this.getUserList()
      }
    },//删除用户
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 20px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}
.el-table {
  margin-top: 20px;
}
#el-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  font-size: 15px;
}
</style>