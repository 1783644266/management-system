<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="searchObj.query">  
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80" align="center"></el-table-column>
        <el-table-column label="是否付款" width="100" align="center" >
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80" align="center">
          <template v-slot="scope">
            {{scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
           <template v-slot="scope">
            {{scope.row.create_time*1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderInfo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchObj.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="searchObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 订单编辑对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editOrderDialog"
      width="50%"
      @close="editOrderDialogClose">
      <el-form :model="editOrder" :rules="editOrderRules" ref="editOrderREF" label-position="left" label-width="90px">
        <el-form-item label="订单价格" prop="order_price" >
          <el-input v-model="editOrder.order_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
            <el-switch
              v-model="editOrder.is_send"
              active-text="已发货"
              inactive-text="未发货"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item label="是否付款" prop="pay_status">
          <el-switch
            v-model="editOrder.pay_status"
            active-text="已付款"
            inactive-text="未付款"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
import cloneDeep from 'lodash/cloneDeep'


export default {
  created() {
    this.getAllOrders()
  },
  data() {
    var checkPrice = (rule, value, callback)=> {
      if(value == 0) return callback(new Error("价格不能为0"))
      callback()
    }
    return {
      searchObj: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      total: 0,
      orderList: [],
      editOrder: {},
      editOrderDialog: false,
      editOrderRules: {
        order_price: [{ required: true, message: '请输入价格', trigger: 'blur' },
        {validator: checkPrice, trigger: 'blur'}],
        pay_status: [{ required: true, message: '请选择付款状态', trigger: 'blur' }],
        is_send: [{ required: true, message: '请选择发货状态', trigger: 'blur' }],
      },
    }
  },
  methods: {
    async getAllOrders() {
      const {data} = await this.$http.get('orders', {params: this.searchObj})
      if(data.meta.status !== 200) return this.$message.error("获取失败")
      this.$message.success("获取成功")
      this.orderList = data.data.goods
      this.total = data.data.total
    },//获取全部订单
    handleSizeChange(val) {
      this.searchObj.pagesize = val
      this.getAllOrders()
    },
    handleCurrentChange(val) {
      this.searchObj.pagenum = val
      this.getAllOrders()
    },
    editOrderInfo(info) {
      this.editOrder = cloneDeep(info)
      this.editOrder.is_send = this.editOrder.is_send == "是"? 1:0
      this.editOrderDialog = true
    },//编辑订单信息
    editOrderDialogClose() {
      this.$refs.editOrderREF.resetFields()
      this.editOrder = {}
    },
    changeOrder() {
      this.$refs.editOrderREF.validate( async ok => {
        if(!ok) return this.$message.error("请填写必要信息")
        const {data} = await this.$http.put(`orders/${this.editOrder.order_id}`,this.editOrder)
        this.editOrderDialog = false
        this.getAllOrders()
      })
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin: 15px 0;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>