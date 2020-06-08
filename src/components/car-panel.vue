<template>
  <li class="nav-cart" @mouseenter="carShowhandle" @mouseleave="carHidehandle">
  	<a href="javascript:;">购物车</a>
  	<!--根据class改变颜色-->
  	<span class="cart-empty-num" :class="{'cart-num':count>0}">
  		<i>{{count}}</i>
  	</span>
  	<div class="nav-cart-wrapper" v-if="carShow">
  		<div class="nav-cart-list">
  			<div class="empty" v-if="count<=0">
  				<h3>购物车为空</h3>
  				<p>您还没有选购任何商品，现在前往商城选购吧!</p>
  			</div>
  			<div class="full" v-else>
  				<div class="nav-cart-items">
  					<ul>
  						<li class="clear"  v-for="(item,index) in carPanelData" :key = 'index'>
  							<div class="cart-item js-cart-item cart-item-sell">
  								<div class="cart-item-inner">
  									<div class="item-thumb">
  										<img :src="item.imagesList">
  									</div>
  									<div class="item-desc">
  										<div class="cart-cell">
  											<h4>
  												<a href="#/item/100027401">{{item.shopInfo.name}}</a>
  											</h4>
  											<p class="attrs">
  												<span>{{item.specifications}}</span>
  											</p>
  											<h6>
  												<span class="price-icon">¥</span><span class="price-num">{{item.price}}</span>
                          <span class="item-num">* {{item.num}}</span>
  											</h6>
  										</div>
  									</div>
  									<div class="del-btn" @click="delCarPanelData(item.id)">删除</div>
  								</div>
  							</div>
  						</li>
  					</ul>
  				</div>
  				<div class="nav-cart-total">
  					<p>共 <strong class="ng-binding">{{count}}</strong> 件商品</p>
  					<h5>合计：<span class="price-icon">¥</span><span class="price-num ng-binding" ng-bind="cartMenu.totalPrice">{{totle}}</span></h5>
  					<h6>
              <router-link to='/Cart' class="nav-cart-btn">去购物车</router-link>
  					</h6>
  				</div>
  			</div>
  		</div>
  	</div>
  </li>
</template>

<script>
  export default {
	  data(){
		  return{
			  carPanelData:[],
			  totle:0,
			  count:0,
		  }
	  },
    computed:{
      carShow(){
         return this.$store.state.carShow
      }
    },
	watch:{
		"$store.state.carShow"(val){
			if(val){
				this.getCarPanlData()
			}
		}
	},
	created(){
		this.getCarPanlData()
	},
    methods:{
	  getCarPanlData(){//获取购物车数据
		  let that=this
		  if(y.isLogin("/","skip")){
			  y.get('/api/jwt/shopCar/shopCar',{},data=>{
				  if(data && data.success){
					  var len=data.data.length
					  var price=0
					  var count=0
					  for(var i=0;i<len;i++){
						  if(data.data[i].shopInfo.images.indexOf(",")!=-1){
							 data.data[i].imagesList=y.v.imgUrl+data.data[i].shopInfo.images.split(",")[0]
						  }else{
							 data.data[i].imagesList=y.v.imgUrl+data.data[i].shopInfo.images
						  }
						  price+=Number(data.data[i].price)
						  count+=Number(data.data[i].num)
					  }
					  that.count=count
					  that.totle=price
					   that.carPanelData=data.data
				  }else{
					  that.carPanelData=[]
					  that.count=0
				  }
			  })
		  }
	  },
      delCarPanelData(id){//删除购物车
	   let that=this
	   y.delete('/api/jwt/shopCar/shopCar/'+id,{},data=>{
		   if(data && data.success){
			   that.getCarPanlData()
		   }else{
			   y.error(data.message)
		   }
	   })
      },
      carShowhandle(){
        this.$store.commit('showCar')
      },
      carHidehandle(){
        this.$store.commit('hideCar')
      }
  }
}
</script>

<style>

</style>
