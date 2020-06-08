<template>
  <div id="header">
  	<div class="nav-global">
  		<div class="container" style="padding:10px">
  			<h1 class="nav-logo">
  				<a href="javascript:;"></a>
				<span v-if="showType=='buiness'" style="color:white;padding-left:60px;font-size: 25px;">{{buinessName}}</span>
  			</h1>
  			<ul class="nav-aside">
  				<li class="nav-user">
  					<a href="javascript:;">个人中心</a>
  					<!--active-->
  					<div class="nav-user-wrapper">
  						<div class="nav-user-list">
  							<dl class="nav-user-avatar">
  								<dd><span class="ng-scope"></span></dd>
  								<dt class="ng-binding">{{userInfo.name?userInfo.name:'请登录'}}</dt>
  							</dl>
  							<ul>
								<el-tag v-if="userInfo.status && userInfo.status=='2'" style="margin-left:50px">审核中</el-tag>
								<el-tag  v-if="userInfo.status && userInfo.status=='1'"  type="success" style="margin-left:50px">正式商户</el-tag>
								<el-tag v-if="userInfo.status && userInfo.status=='0'" style="margin-left:50px">普通商户</el-tag>
								<el-button v-if="userInfo.status && userInfo.status=='0'" style="margin-left:20px" type="text" @click="applyToShop">申请成为正式商户</el-button>
					<router-link tag='li' class="order" to='/account'><a href="javascript:;">我的订单</a></router-link>
  								<li class="information"><router-link tag='li' class="order" to='/userInfo'><a href="javascript:;">账户资料</a></router-link></li>
  								<li class="address"><router-link tag='li' class="order" :to="{name:'Address'}"><a href="javascript:;">收货地址</a></router-link></li>
  								<li class="logout" @click="logout"><a href="javascript:;">退出</a></li>
  							</ul>
  						</div>
  					</div>
  				</li>
  				<!--active-->
          <carPanel></carPanel>
  			</ul>
  			<ul class="nav-list">
			<!-- 	  <el-autocomplete
				      class="inline-input"
				      v-model="searchVal"
				      :fetch-suggestions="querySearch"
				      placeholder="请输入商品进行搜索"
				      @select="handleSelect"
				    ></el-autocomplete> -->
  			</ul>
  		</div>
  	</div>
  	<div class="nav-sub" :class="{active:isActive}">
  		<div class="nav-sub-wrapper">
  			<div class="container">
  				<ul class="nav-list">
  					<li @click="setVal"><router-link to='/Home'>商城首页</router-link></li>
  					<!-- <li><router-link to='/PageOne'>特别展示</router-link></li>
  					<li class="active"><router-link to='/Shop'>官方配件</router-link></li> -->
					<li class="margin-left" v-if="showType=='system'" v-for="item in typeList" :key="item.id" @click="goPage(item.id,item.name)">{{item.name}}</li>
					<li class="margin-left" v-if="showType=='buiness'" @click="goPage2('','全部')">全部</li>
					<li class="margin-left" v-if="showType=='buiness'" v-for="item in shopTypeList" :key="item.id" @click="goPage2(item.id,item.name)">{{item.name}}</li>
  					<!-- <li><router-link to='/PageTwo'>周边产品</router-link></li>
  					<li><router-link to='/PageThree'>第三方配件</router-link></li>
  					<li><router-link to='/PageFour'>全部商品</router-link></li>
  					<li><router-link to='/PageFive'>服务</router-link></li> -->
  				</ul>
  			</div>
  		</div>
      <Goods></Goods>
  	</div>
  </div>
</template>

<script>
  import carPanel from  './car-panel'
  import Goods from  './goods'
export default {
  data(){
	return{
	  restaurants: [],
	  userInfo:JSON.parse(y.getVal("userInfo"))?JSON.parse(y.getVal("userInfo")):'',
	  searchVal:'',
	  isActive :false,
	  typeList:[],
	  shopTypeList:[],
	}
  },
  computed:{
	  showType:function(){
		  return this.$store.state.showType
	  },
	  buinessName:function(){
		  return this.$store.state.buinessName
	  }
  },
  created(){
		  this.getShopType()
		  this.getBuinessShopType()
	  },
  methods:{
	  setVal(){
		   this.$store.commit('setShowType',"system")
		   y.setVal("showType","system");
	  },
	  goPage(id,name){
		  y.go('/PageTwo?typeId='+id+"&name="+name)
	  },
	  goPage2(id,name){
		  y.go('/buinessShop?typeId='+id+"&name="+name)
	  },
	  getShopType(){
		  var that=this
		  y.get('/api/open/index/shopType',{},data=>{
			  if(data && data.success){
				  that.typeList=data.data
			  }else{
				  that.typeList=[]
			  }
		  })
	  },
	  getBuinessShopType(){
		  var that=this
		  y.get('/api/open/index/buinessShopType',{},data=>{
			  if(data && data.success){
				  that.shopTypeList=data.data
			  }else{
				  that.shopTypeList=[]
			  }
		  })
	  },
	  getUserInfo(){
		  var that=this
		  y.get('/api/jwt/user/userInfo',{},data=>{
			  if(data && data.success){
				  y.setVal("userInfo",JSON.stringify(data.data))//放入用户信息
				  that.userInfo=data.data
			  }
		  })
	  },
	  applyToShop(){//申请成为正式商户
		  var user={
			  id:this.userInfo.id,
			  status:'2'
		  }
		  var that=this
		  y.confirm("提示","确定要申请成为正式商户吗？",function(){
			  y.put('/api/jwt/user/userInfo',user,data=>{
				  if(data && data.success){
					  y.success("申请成功")
					  that.getUserInfo()
				  }else{
					  y.error(data.message)
				  }
			  })
		  })
	  },
	  logout(){//退出登录
		  y.confirm("提示","确定要退出登录吗?",function(){
			  localStorage.clear()
			  y.go('/Login')
		  })
	  },
	  handleSelect(item) {
		  console.log(item);
		},
	   querySearch(queryString, cb) {
		  var restaurants = this.restaurants;
		  var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		  // 调用 callback 返回建议列表的数据
		  cb(results);
		},
		createFilter(queryString) {
			return (restaurant) => {
			  return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		  },
      },
      components: {
        carPanel,
        Goods
      }
    }
</script>

<style scoped="scoped">
	.margin-left{
		list-style-type:none;
		margin-left:10px;
		margin-right: 10px;
	}
</style>
