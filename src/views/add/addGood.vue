<template>
  <div >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false">
      </el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeTab-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-form :model="addGoodForm" :rules="addGoodRules" ref="addGoodFormREF" label-width="100px" label-position="top">
      <el-tabs tab-position="left" v-model="activeTab" :before-leave="beforeTagLeave" @tab-click="tabChange">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addGoodForm.goods_cat"
              :options="goodlist"
              :props="props"
              @change="cascaderChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item1.attr_name" v-for="item1 in manyData" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2"  v-for="(item2, i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="upload"
            :headers="uploadObj"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodForm.goods_introduce">
          </quill-editor>
          <el-button class="addButton" type="primary" icon="el-icon-edit" @click="addGood">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="预览"
      :visible.sync="picDialog"
      width="40%">
      <img :src="picUrl" alt="" class="prePic">
    </el-dialog>
  </div>
</template>

<script >
import cloneDeep from 'lodash/cloneDeep'

export default {
  created() {
    this.getAllGoods()
  },
  data() {
    var checkPrice = (rule, value, callback) => {
      if(value == 0) return callback(new Error('价格不能为0'))
      callback()
    }
    var checkNum = (rule, value, callback) => {
      if(value == 0) return callback(new Error('数量不能为0'))
      callback()
    }
    var checkWeight = (rule, value, callback) => {
      if(value == 0) return callback(new Error('重量不能为0'))
      callback()
    }
    return {
      addGoodForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },//数据存放
      addGoodRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' },{ validator: checkPrice, trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' },{ validator: checkNum, trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' },{ validator: checkWeight, trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },//验证
      activeTab: "0",//展示的第几个标签页
      goodlist: [],//级联选择器所有商品信息
      props: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },//级联选择器配置
      manyData: [],
      onlyData: [],
      upload: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      uploadObj: {
      Authorization: window.sessionStorage.getItem('token')
      },//图片上传请求头
      picUrl: '',//预览图片地址
      picDialog: false,//图片预览对话框
    }
  },
  computed: {
    cateId() {
      return this.addGoodForm.goods_cat.length == 3?this.addGoodForm.goods_cat[2]:null
    }
  },
  methods: {
    async getAllGoods() {
      const {data} = await this.$http.get('categories')
      this.goodlist = data.data
    }, //获取级联选择器需要参数
    cascaderChange() {
      if(!this.cateId) return this.addGoodForm.goods_cat = []
      
    },//级联选择器选中节点变更
    beforeTagLeave(will,old) {
      if(old === "0" && !this.cateId) {
        this.$message.warning('请选择商品分类')
        return false
      }
    },
    async tabChange() {
      if(this.activeTab == "1") {
        const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel: 'many'}})
        if(data.meta.status !== 200) return this.$message.error('获取参数失败')
        data.data.forEach( e => {
          e.attr_vals = e.attr_vals.length?e.attr_vals.split(" "):[]
        })
        this.manyData = data.data
      }
      if(this.activeTab == "2") {
        const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel: 'only'}})
        if(data.meta.status !== 200) return this.$message.error('获取属性失败')
        this.onlyData = data.data
      }
    },/* 标签页变化触发该函数 */
    handlePreview(file) {
      console.log(file.response.data.tmp_path)
      this.picUrl=`http://www.ysqorz.top:8888/${file.response.data.tmp_path}`
      this.picDialog = true
    },//点击已上传图片预览时触发
    handleRemove(file) {
      const {response} = file
      let i = this.addGoodForm.pics.findIndex(e => e.pic ===response.data.tmp_path)
      this.addGoodForm.pics.splice(i, 1)
    },//图片删除
    handleSuccess(resp) {
      if(resp.meta.status !== 200) return this.$message.error("暂存失败")
      this.$message.success("暂存成功")
      const pic = {
        pic: resp.data.tmp_path
      }
      this.addGoodForm.pics.push(pic)
    },//图片上传成功触发
    addGood() {
      this.$refs.addGoodFormREF.validate( async ok => {
        if(!ok) return this.$message.error("请填写必要信息")
        const data = cloneDeep(this.addGoodForm)
        data.goods_cat = data.goods_cat.join(',')
        this.manyData.forEach(e => {
          const a = {
            attr_id: e.attr_id,
            attr_value: e.attr_vals.join(' ')
          }
          data.attrs.push(a)
        })
        this.onlyData.forEach(e => {
          const a = {
            attr_id: e.attr_id,
            attr_value: e.attr_vals
          }
          data.attrs.push(a)
        })
        const {data:res} = await this.$http.post('goods',data)
        console.log(res)
        if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success("商品添加成功")
        this.$router.replace('/goods')
      })
    },//添加商品
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-steps {
  margin: 15px 0;
}
.el-steps >>> .el-step__title {
  font-size: 12px;
}
.el-checkbox {
  margin: 5px !important;
}
.prePic {
  width: 100%;
}
.addButton {
  margin-top: 15px;
  float: right;
}
.quill-editor .ql-editor {
  min-height: 300px ;
}
</style>