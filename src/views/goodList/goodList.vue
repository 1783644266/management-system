<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="allGoods.query" clearable
           @clear="getGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
      :data="goodList" 
      style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          width="300"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量">
        </el-table-column>
        <el-table-column
          width="200"
          label="创建时间">
          <template v-slot="scope">
            {{scope.row.upd_time*1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGood(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="allGoods.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="allGoods.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script >
export default {
  created() {
    this.getGoods()
  },
  data() {
    return {
      search: '',//搜索关键字
      goodList: [],
      allGoods: {
        pagenum: 1,
        pagesize: 10,
        query: ''
      },
      total: 0,
    }
  },
  methods: {
    async getGoods() {
      const {data} = await this.$http.get(`goods`,{params:this.allGoods})
      if(data.meta.status !== 200) return this.$message.error("数据获取失败")
      this.total = data.data.total
      this.goodList = data.data.goods
    },//获取商品列表信息
    handleSizeChange(val) {
      this.allGoods.pagesize = val
      this.getGoods()
    },//分页器变动
    handleCurrentChange(val) {
      this.allGoods.pagenum = val
      this.getGoods()
    },
    searchGoods() {
      this.allGoods.pagenum = 1
      this.allGoods.pagesize = 10
      this.getGoods()
    },//搜索商品
    async deleteGood(info) {
      this.$messageBox.confirm(`是否确认删除该商品`,'警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async val => {
        const {data} = await this.$http.delete(`goods/${info.goods_id}`)
        if(data.meta.status !== 200) return this.$message.error("商品删除失败")
        this.$message.success("商品删除成功")
        this.getGoods()
      })
      .catch(err => this.$message("删除操作已取消"))
    }
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin: 20px 0;
}
.el-table >>> .cell{
  white-space: nowrap;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
/* .el-select-dropdown__wrap .el-scrollbar__wrap {
  margin-bottom: 0!important;
} */
</style>