<template>
	<div>
	<el-card style="position: fixed;top:20%;right:20px">
		 <div slot="header" class="clearfix">
		    <span>销量排行</span>
		  </div>
		  <div v-for="(item,index) in orderList" :key="item.id" style="padding:10px">
			   <el-avatar shape="square" :size="100" fit="fill" :src="item.imageList"></el-avatar>
			   <div style="float: right;">
			   <i class="el-icon-star-on" style="color: red;font-size:20px" v-if="index==0"></i>
			    {{item.name}}
				销量  <span style="color:#015E94">{{item.buyNum}}</span>
				</div>
		  </div>
	</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				orderList:[]
			}
		},
		methods:{
			getShopOrder(){//获取商品排行榜
			  let that=this
			  y.get('/api/open/index/shopOrder',{},data=>{
				  if(data && data.success){
					  that.orderList=data.data
					  var len=data.data.length
					  for(var i=0;i<len;i++){
						  if(data.data[i].images.indexOf(",")!=-1){
							  data.data[i].imageList=y.v.imgUrl+data.data[i].images.split(",")[0]
						  }else{
							  data.data[i].imageList=y.v.imgUrl+data.data[i].images
						  }
					  }
				  }else{
					  that.orderList=[]
				  }
			  })
			},
		},
		created(){
			this.getShopOrder()
		}
	}
</script>

<style>
</style>
