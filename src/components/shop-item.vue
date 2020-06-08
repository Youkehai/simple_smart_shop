<template>
  <div class="item">
  	<div>
  		<div class="item-img"><img :alt="item.name" :src="item.pageImage?item.pageImage:'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1827856217,3079745107&fm=26&gp=0.jpg'" style="opacity: 1;">
  		</div>
  		<h6>{{item.name}}</h6>
  		<h3 >{{item.tips}}</h3>
  		<div class="params-colors">
  			<ul class="colors-list">
  				<li v-for="(item,index) in item.speList" :key='index'>
					<el-tag :type="itemIndex==index?'primary':'info'" @click="itemIndex=index">{{item.specifications}}</el-tag>
         <!--   <a href="javascript:;" :title="item.specifications" @click="tab(index)">
               <img :src="item.spec_json.image">
			  </a> -->
			  </li>
  			</ul>
  		</div>
  		<div class="item-btns clearfix">
  			<span class="item-gray-btn"><router-link :to="{name: 'Item', query: {itemId:item.id,buinessName:item.buinessName}}">查看详情</router-link>
        </span>
        <span class="item-blue-btn" @click="addCarpanelData(item.id)">加入购物车
        </span>
  		</div>
  		<div class="item-price clearfix">
  			<i>¥</i><span>{{item.minPrice}}-{{item.maxPrice}}</span>
  		</div>
			<p style="color:grey;	font-size: 10px;float: right;margin-right:10px"><i class="el-icon-goods" style="color:palevioletred"></i>{{item.buinessName}}</p>
  		<div class="discount-icon">false</div>
  		<div class="item-cover">
  			<router-link :to="{name: 'Item', query: {itemId:item.id}}"></router-link>
  		</div>
  	</div>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        itemIndex: 0
      }
    },
    props:{
      item : Object
    },
	created(){
		if(this.item.images.indexOf(",")!=-1){
			this.item.imageList=this.item.images.split(",")
		}
		this.item.pageImage=y.v.imgUrl+this.item.pageImage
		if(this.item.speList && this.item.speList.length>0){
			var len=this.item.speList.length
			this.item.minPrice=this.item.speList[0].price
			this.item.maxPrice=this.item.speList[len-1].price
		}
	},
    methods:{
      //添加购物车的方法
      addCarpanelData(id){
				//判断是否登录
		if(y.isLogin(this.$route.fullPath)){
			//传入后台需要shopId,num,price,buinessId
			var shop={
				shopId:id,
				num:1,
				specifications:this.item.speList[this.itemIndex].specifications,
				price:this.item.speList[this.itemIndex].price,
			}
			let that=this
			y.post('/api/jwt/shopCar/shopCar',shop,data=>{
				if(data && data.success){
					y.success("添加成功")
					that.$store.commit('showCar')
					that.speIndex=-1
				}else{
					y.error(data.message)
				}
			})
		}
      }
    }
  }
</script>

<style>
</style>
