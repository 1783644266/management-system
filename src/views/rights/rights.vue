<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" width="70px"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
            <el-tag type="success" v-if="scope.row.level == 1">二级权限</el-tag>
            <el-tag type="info" v-if="scope.row.level == 2">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script >
export default {
  async created() {
    const { data } = await this.$http.get("/rights/list");
    console.log(data);
    this.rightsList = data.data;
  },
  data() {
    return {
      rightsList: [],
    };
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
</style>