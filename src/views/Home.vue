<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '250px'">
        <div class="collapseControl" @click="changeCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#56CCF3"
          unique-opened
          :collapse="isCollapse"
          :default-active="path"
          router
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconGather[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + childItem.path"
              v-for="childItem in item.children"
              :key="childItem.id"
              @click="changePath('/' + childItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ childItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script >
export default {
  created() {
    this.getMenuList();
    this.path = window.sessionStorage.getItem('path')
  },
  data() {
    return {
      menuList: [],
      iconGather: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      path: '',
    };
  },
  methods: {
    //登出
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.replace("/");
    },
    //获取菜单列表
    async getMenuList() {
      const { data } = await this.$http.get("/menus");
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      this.menuList = data.data;
    },
    //切换左侧菜单折叠状态
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    changePath(path) {
      window.sessionStorage.setItem('path', path)
      this.path = path
    }
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  color: white;
  font-size: 20px;
  padding-left: 20px;
}
.el-aside {
  background-color: #333744;
  transition: width 0.5s;
}
.collapseControl {
  background-color: #999;
  text-align: center;
  letter-spacing: 3px;
  color: #fff;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
}
.el-aside .el-menu {
  border: none;
}
.el-aside .iconfont {
  margin-right: 10px;
}
.el-main {
  background-color: #eaedf1;
}
</style>