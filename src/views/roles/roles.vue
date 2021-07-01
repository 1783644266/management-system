<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRoleDialog = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope" >
            <el-row
              :class="[
                'bottom-border',
                index == 0 ? 'top-border' : '',
                'ycenter',
              ]"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
              v-if="item1.children.length"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="removeRight(scope.row, item1.id)" >
                  {{item1.authName}}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row
                  :class="[index !== 0 ? 'top-border' : '', 'ycenter']"
                  v-for="(item2, index) in item1.children"
                  :key="item2.id"
                  v-if="item2.children.length"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRight(scope.row, item2.id)"
                      >{{item2.authName}}</el-tag
                    >
                    <!-- 二级权限 -->
                  </el-col>
                  <el-col class="especial" :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                    <!-- 三级权限 -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>

        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="290">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row)"
              >删除</el-button
            >
            <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="setRoleRight(scope.row)">分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialog"
      width="50%"
      center
      @close="clearRoleForm"
      :lock-scroll="false"
    >
      <el-form
        label-width="100px"
        ref="addRoleForm"
        :model="addRole"
        :rules="addRolerule"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc" ref="desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editRoleDialog"
      width="50%"
      center
      @close="clearEditRoleForm"
      :lock-scroll="false"
    >
      <el-form
        label-width="100px"
        ref="editRoleForm"
        :model="editRole"
        :rules="addRolerule"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRole.roleDesc" ref="editDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOldRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色权限对话框 -->
    <el-dialog
      title="设置权限"
      :visible.sync="setRoleRightDialog"
      width="50%"
      @close="setRoleRightDialogClose"
    >
      <el-tree ref="tree" :data="allRight" :props="defaultProps" show-checkbox
      node-key="id" default-expand-all :default-checked-keys	="currentRoleRight"	></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRoleNewRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script >
export default {
  created() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const { data } = await this.$http.get("/roles");
      if (data.meta.status !== 200)
        return this.$message.error("角色列表获取失败");
      this.rolesList = data.data;
    }, //获取角色列表
    clearRoleForm() {
      this.$refs.desc.clear();
      this.$refs.addRoleForm.resetFields();
    }, //清空添加角色列表
    addNewRole() {
      this.$refs.addRoleForm.validate(async (ok) => {
        if (ok) {
          const { data } = await this.$http.post("/roles", this.addRole);
          if (data.meta.status !== 201)
            return this.$message.error(data.meta.msg);
          this.$message.success(data.meta.msg);
          this.addRoleDialog = false;
          this.getRoles();
        }
      });
    }, //添加角色
    clearEditRoleForm() {
      this.$refs.editDesc.clear();
      this.$refs.editRoleForm.resetFields();
    },
    async showEditDialog(info) {
      this.editRoleDialog = true;
      const { data } = await this.$http.get("/roles/" + info.id);
      this.$message.success("查询用户信息成功");
      this.editRole = data.data;
    }, //查询预修改角色信息
    editOldRole() {
      this.$refs.editRoleForm.validate(async (ok) => {
        const { data } = await this.$http.put(
          "/roles/" + this.editRole.roleId,
          this.editRole
        );
        if (data.meta.status !== 200) return this.$message.error("更改失败");
        this.$message.success("更新成功");
        this.editRoleDialog = false;
        this.getRoles();
      });
    }, //更改角色信息
    async deleteRole(info) {
      console.log(info);
      const result = await this.$messageBox
        .confirm(`是否确认删除${info.roleName}此角色?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false,
        })
        .catch((err) => this.$message("已取消删除操作"));
      if (result == "confirm") {
        const { data } = await this.$http.delete("/roles/" + info.id);
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
        this.$message.success(data.meta.msg);
        this.getRoles();
      }
    }, //删除角色信息
    async removeRight(role, right) {
      console.log(role);
      const result = await this.$messageBox
        .confirm("此操作将永久删除该权限, 是否继续?", "警告！", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: false,
        })
        .catch((error) => this.$message("操作已取消"));
      if (result == "confirm") {
        const { data } = await this.$http.delete(
          `roles/${role.id}/rights/${right}`
        );
        console.log(data.data);
        if (data.meta.status !== 200)
          return this.$message.error("取消权限失败");
        this.$message.success(data.meta.msg);
        role.children = data.data;
      }
    }, //删除角色权限
    async setRoleRight(info) {
      this.setRoleRightDialog = true
      //info为当前角色信息
      const {data} = await this.$http.get(`rights/tree`)
      this.getCurrentRoleRightID(info, this.currentRoleRight)
      this.allRight = data.data
      this.RoleId = info.id
    },
    getCurrentRoleRightID(node, array) {
      if(!node.children) return array.push(node.id)
      node.children.forEach(e => this.getCurrentRoleRightID(e, array))
    },//递归查找角色权限ID
    setRoleRightDialogClose() {
      this.allRight = []
      this.RoleId = ''
      this.currentRoleRight = []
    },//对话框关闭重置权限数据
    async setRoleNewRight() {
      let array = [...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      let currentRoleRightId = array.join(',')
      const {data} = await this.$http.post(`roles/${this.RoleId}/rights`,{rids:currentRoleRightId})
      if(data.meta.status !== 200) return this.$message.error('权限更新失败')
      this.$message.success('权限更新成功')
      this.setRoleRightDialog = false
      this.getRoles()
    },//通过tree组件更新角色权限
  },
  data() {
    return {
      rolesList: [],
      addRole: {
        roleName: "",
        roleDesc: "",
      },
      editRole: {
        roleName: "",
        roleDesc: "",
      },
      addRolerule: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      addRoleDialog: false, //展示增加角色对话框
      editRoleDialog: false, //编辑角色信息对话框
      setRoleRightDialog: false,//设置角色权限对话框
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      allRight: [],//所有权限
      currentRoleRight: [],//当前角色权限
      RoleId: '',//当前预变更权限角色ID
    
    };
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.top-border {
  border-top: 1px solid #eee;
}
.bottom-border {
  border-bottom: 1px solid #eee;
}
.especial .el-tag {
  margin: 5px 10px;
}
.ycenter {
  display: flex;
  align-items: center;
}
</style>