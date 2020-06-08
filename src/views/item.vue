<template>
<div id="main">
	<div class="store-content item">
		<div class="item-box">
			<div class="gallery-wrapper">
				<div class="gallery">
					<div class="thumbnail">
						<ul>
							<li :class="{'on':index==imgIndex}" @click="tableImg(index)" v-for="(image,index) in shopInfo.imagesList" :key="index">
							<img :src="image"></li>
						</ul>
					</div>
					<div class="thumb">
						<ul>
							<li :class="{'on':index==imgIndex}" v-for="(image,index) in shopInfo.imagesList" :key="index">
							<img :src="image"></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="banner">
				<el-button style="margin-right: 10px;"@click="goBuiness"><i class="el-icon-s-shop"></i>进店逛逛</el-button>
				<el-button v-if="shopInfo.isCollection!='1'" @click="collection"><i class="el-icon-circle-check" ></i>收藏店铺</el-button>
				<el-button v-if="shopInfo.isCollection=='1'" @click="refuseCollection"><i class="el-icon-circle-check"  style="color:red"></i>取消收藏</el-button>
				<div class="sku-custom-title">
					<div class="params-price" v-if="speIndex>-1">
						<span><em>¥</em><i>{{shopInfo.speList[speIndex].price}}</i></span>
					</div>
					<div class="params-info">
						<h4>{{shopInfo.name}}</h4>
						<h6>{{shopInfo.tips}}</h6>
					</div>
				</div>
				<div class="sku-dynamic-params-panel">
					<div class="sku-dynamic-params clear">
						<span class="params-name">规格</span>
						<ul class="params-colors">
							<li v-for="(color,index) in shopInfo.speList" :key='index'>
								<!-- {{color.specifications}} -->
								<el-tag :type="speIndex==index?'primary':'info'" @click="speIndex=index">{{color.specifications}}</el-tag>
								<!-- <router-link :title="color.specifications" :to="{name: 'Item', query: {itemId:color.id}}">
								</router-link> -->
							</li>
						</ul>
					</div>
					<div class="sku-dynamic-params clear">
						<div class="params-name">数量</div>
						<div class="params-detail clear">
							<div class="item-num js-select-quantity">
								<span class="down" :class="{'down-disabled':count<=1}" @click="subCount">-</span>
								<span class="num">{{count}}</span>
								<span class="up"  @click="addCount">+</span>
							</div>
						</div>
					</div>
				</div>
				<div class="sku-status">
					<div class="cart-operation-wrapper clearfix">
						<span class="blue-title-btn js-add-cart" @click="addCarpanelData"><a>加入购物车</a></span>
						<span class="gray-title-btn" @click="checkOutHandle"><a>现在购买</a></span>
					</div>
				</div>
			</div>
		</div>
		<el-card>
			 <div slot="header" class="clearfix">
			    <span>商品评论</span>
			    <el-button style="float: right;  padding: 3px 0" type="text" @click="dialogFormVisible=true,comment=''">我也要评论</el-button>
			</div>
			<el-row :gutter="12">
			  <el-col :span="12" v-for="item in shopInfo.commentList" :key="item.id">
			    <el-card shadow="always">
					<div slot="header" class="clearfix">
					    <el-button style="float: right;  padding: 3px 0" type="text" v-if="userId==item.buinessId" @click="deleteComment(item.id)">删除</el-button>
					  </div>
					{{item.createDate}}
					{{item.createName}}:<br />
			        {{item.comment}}
					<i v-if="item.isLike==1" class="el-icon-ice-cream-square"   style="float: right;" @click="like(item.id)">{{item.likeNum}}</i>
				   <i v-else class="el-icon-ice-cream-square"   style="float: right;color:orangered" @click="delLike(item.id)">{{item.likeNum}}</i>
				</el-card>
			  </el-col>
			</el-row>
		</el-card>
	</div>
	
	<el-dialog title="评论" :visible.sync="dialogFormVisible">
		<el-input v-model="comment" placeholder="请输入评论内容"></el-input>
		<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="insertComment">确 定</el-button>
		  </span>
	</el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
		dialogFormVisible:false,
		userId:JSON.parse(y.getVal("userInfo")).id,
      itemId:this.$route.query.itemId,
      imgIndex : 0,
	  comment:'',
	  speIndex:-1,
      count : 1,
	  shopInfo:{}
    }
  },
  watch:{
    '$route.query.itemId'(){
      this.itemId = this.$route.query.itemId
    }
  },
  created(){
	  this.getShopInfo(this.$route.query.itemId)
  },
  methods: {
	  goBuiness(){//进店逛逛
		  //设置一个值，改变头部展示
		  y.setVal("showType","buiness");
		  y.setVal("buinessName",this.$route.query.buinessName);
		  this.$store.commit('setShowType',"buiness")
		  this.$store.commit('setBuinessName',this.$route.query.buinessName)
		  y.setVal("buinessId",this.shopInfo.buinessId);
		  //跳转页面
		 y.go('/buinessShop')
	  },
	  refuseCollection(){//取消收藏
		  let that=this
		  y.confirm("提示","确定要取消收藏吗？",fun=>{
			  y.delete('/api/jwt/collection/collection/'+that.shopInfo.buinessId,{},function(data){
				  if(data && data.success){
					  y.success("取消成功")
					  that.getShopInfo(that.$route.query.itemId)
				  }else{
					 y.error(data.message)
				 }
			  })
		  })
	  },
	  collection(){//收藏店铺
		  let that=this
		  var shop={
			  buinessId:that.shopInfo.buinessId
		  }
		  y.post('/api/jwt/collection/collection',shop,function(data){
			  if(data && data.success){
				  y.success("收藏成功")
				  that.getShopInfo(that.$route.query.itemId)
			  }else{
				 y.error(data.message)
			 }
		  })
	  },
	  deleteComment(id){
		  let that=this
		  y.confirm("提示","确定要删除评论吗？",fun=>{
			  y.delete('/api/jwt/comment/comment/'+id,{},function(data){
				  if(data && data.success){
					  y.success("删除成功")
					  that.getShopInfo(that.$route.query.itemId)
				  }else{
					 y.error(data.message)
				 }
			  })
		  })
	  },
	  insertComment(){
		  if(!this.comment){
			  y.error("请输入评论内容")
			  return false
		  }
		  var c={
			  comment:this.comment,
			  shopId:this.$route.query.itemId
		  }
		 let that=this
		 y.post('/api/jwt/comment/comment',c,data=>{
			 if(data && data.success){
				 y.success("发表评论成功")
				 that.dialogFormVisible=false
				 that.getShopInfo(that.$route.query.itemId)
			 }else{
				 y.error(data.message)
			 }
		 })
	  },
	  like(id){
		  var like={
			  commentId:id,
		  }
		  let that=this
		  y.post('/api/jwt/comment/likeComment',like,data=>{
			 if(data && data.success){
				 that.getShopInfo(that.$route.query.itemId)
			 }else{
				 y.error(data.message)
			 }
		  })
	  },
	  delLike(id){
		  var like={
			  commentId:id,
		  }
		  let that=this
		  y.delete('/api/jwt/comment/likeComment?commentId='+id,{},data=>{
			 if(data && data.success){
				 that.getShopInfo(that.$route.query.itemId)
			 }else{
				 y.error(data.message)
			 }
		  })
	  },
	 getShopInfo(id){
		 let that=this
		 var url=""
		 if(y.getVal("userInfo")){
			 url='/api/open/index/shop/'+id+'?userId='+JSON.parse(y.getVal("userInfo")).id
		 }else{
			 url='/api/open/index/shop/'+id
		 }
		 y.get(url,{},data=>{
			 if(data && data.success){
				 data.data.imagesList=[]
				 if(data.data.images.indexOf(",")!=-1){
					 var len=data.data.images.split(",").length
					 var imageList=data.data.images.split(",")
					 for(var i=0;i<len;i++){
					  data.data.imagesList.push(y.v.imgUrl+imageList[i])
					 }
				 }else{
					 data.data.imagesList.push(y.v.imgUrl+data.data.images)
				 }
				 that.shopInfo=data.data
			 }else{
				 that.shopInfo={}
			 }
		 })
	 },
    //图片的切换
    tableImg(index){
      this.imgIndex = index
    },
    //添加购物车的方法
    addCarpanelData(){
	if(y.isLogin(this.$route.fullPath)){
		if(this.speIndex<0){
			y.error("请先选择规格")
			return false
		}
		var shop={
			shopId:this.$route.query.itemId,
			num:this.count,
			specifications:this.shopInfo.speList[this.speIndex].specifications,
			price:this.shopInfo.speList[this.speIndex].price*this.count,
		}
		let that=this
		that.$store.commit('showCar')
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
    },
    //增加
    addCount () {
	if(y.isLogin(this.$route.fullPath)){
        this.count++
	  }
    },
    //减少
    subCount () {
	if(y.isLogin(this.$route.fullPath)){
        this.count--
      if(this.count<1){
        this.count = 1
      }
	  }
    },
    checkOutHandle () {//现在购买
	if(y.isLogin(this.$route.fullPath)){
		 if(this.speIndex<0){
		 	y.error("请先选择规格")
		 	return false
		 }
		 var itemList=[]
		var itemData={
				shopId:this.$route.query.itemId,
				num:this.count,
				price:this.shopInfo.speList[this.speIndex].price*this.count,
				images:this.shopInfo.imagesList[0],
				shopName:this.shopInfo.name,
				buinessId:this.shopInfo.buinessId,
				shopSpecifications:this.shopInfo.speList[this.speIndex].specifications,
			}
		  itemList.push(itemData)
		 var order={
		 	itemList:itemList,
		 	num:this.count,
		 	price:this.shopInfo.speList[this.speIndex].price*this.count
		 }
		  this.$store.commit('submitOrder',order)
		  y.go('/Checkout')
		 // this.$store.commit('checkOut',provisionalOrder)
		  //this.$router.push({name: 'Checkout'})
	  }
    },
  },
  components: {
    prompt
  }
}
</script>

<style>
.change-color{
	color:#00FFFF;
}
.item .item-box{
	width: 1098px;
  padding: 60px;
  margin-bottom: 20px;
  display: table;
	overflow: hidden;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  border-color: rgba(0,0,0,.14);
  box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
}
.banner, .gallery-wrapper{
	display: table-cell;
}
.gallery-wrapper{
	vertical-align: top;
}
.gallery{
	float: left;
    width: 540px;
    display: table-cell;
}
.thumb, .thumbnail{
	display: table-cell;
    vertical-align: middle;
}
.thumbnail li{
    width: 54px;
    height: 54px;
    margin-top: 10px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 5px;
    cursor: pointer;
}
.thumbnail li img{
    width: 54px;
    height: 54px;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 5px;
    cursor: pointer;
}
.thumbnail li:first-child{
	margin-top: 0;
}
.thumbnail li.on{
	padding: 10px;
    border: 3px solid #ccc;
    border: 3px solid rgba(0,0,0,.2);
}
item-box img{
	max-width: 100%;
    height: auto;
}
.thumb>ul{
	margin-left: 20px;
    width: 440px;
    height: 440px;
    position: relative;
}
.thumb li img{
	margin-left: 20px;
    width: 440px;
    height: 440px;
    position: relative;
}
.thumb li{
	position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: none;
    opacity: 0;
    text-align: center;
    user-select: none;
}
.thumb li.on{
	animation: thumb-change .35s ease-out 1;
    position: relative;
    display: block;
    z-index: 1;
    opacity: 1;
}
.item-box .banner{
	vertical-align: middle;
	width: 450px;
    margin-left: 10px;
}
.item-box .banner .sku-custom-title{
	overflow: hidden;
    padding: 8px 8px 18px 10px;
    position: relative;
}
.item-box .banner .params-price{
	position: absolute;
    right: 8px;
    bottom: 19px;
}
.item-box .banner .params-price span{
	display: block;
    color: #de4037;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
}
.item-box .banner .params-price span i{
	padding-left: 2px;
    font-size: 24px;
}
.item-box .banner .sku-custom-title .params-info{
	width: 360px;
}
.item-box .banner .sku-custom-title h4{
	font-size: 24px;
    line-height: 1.25;
    color: #000;
    margin-bottom: 13px;
}
.item-box .banner .sku-custom-title h6{
	font-size: 14px;
    line-height: 1.5;
    color: #bdbdbd;
}
.item-box .banner .sku-dynamic-params-panel{
	padding: 29px 0 8px 10px;
    border-top: 1px solid #ebebeb;
}
.item-box .banner .sku-dynamic-params{
	margin-bottom: 19px;
}
.item-box .banner .params-name{
	float: left;
    padding-right: 20px;
    font-size: 14px;
    color: #8d8d8d;
    line-height: 36px;
}
.item-box .banner .sku-dynamic-params .params-colors{
	float: left;
    line-height: 36px;
    margin: -10px 0 0 -10px;
    width: 402px;
}
.item-box .banner .sku-dynamic-params .params-colors>li{
	float: left;
    margin: 10px 0 0 10px;
}
.item-box .banner .sku-dynamic-params .params-colors>li a{
	display: block;
    width: 26px;
    height: 26px;
    border: 2px solid #E5E5E5;
    padding: 3px;
    text-align: center;
    color: #757575;
    border-radius: 50%;
}
.item-box .banner .sku-dynamic-params .params-colors>li.cur a{
	border-color: #B2B2B2;
    box-shadow: inset 0 0 0 1px #B2B2B2;
}
.item-box .banner .sku-dynamic-params .params-colors>li i, .item-box .banner .sku-dynamic-params .params-colors>li img{
    position: relative;
    display: block;
    width: 100%;
    border-radius: 50%;
}
.item-box .banner .sku-dynamic-params{
	margin-bottom: 19px;
}
.item-box .banner .params-detail{
    line-height: 36px;
    float: left;
    width: 392px;
}
.item-box .item-num{
	float: left;
    width: 128px;
}
.item-box .item-num .down:before, .item-box .item-num .up:before{
	content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    top: 0;
    height: 45px;
    background: url("../assets/img/cart-updown-item.png") no-repeat;
    background-size: 100% auto;
}
.item-box .item-num .down:before{
	content: " ";
    background-position: 0 -60px;
}
.item-box .item-num .down:hover:before{
	content: " ";
    background-position: 0 -180px;
}
.item-box .item-num .down.down-disabled:before, .item-box .item-num .down.down-disabled:hover:before{
	content: " ";
    background-position: 0 -300px;
}
.item-box .item-num .down, .item-box .item-num .up{
	position: relative;
    float: left;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 40px;
    text-indent: -9999em;
    cursor: pointer;
    user-select: none;
}
.item-box .item-num .down.down-disabled, .item-box .item-num .up.up-disabled{
	cursor: not-allowed;
}
.item-box .item-num .up:before{
	background-position: 0 0;
}
.item-box .item-num .up:hover:before{
	background-position: 0 -120px;
}
.item-box .item-num .up.up-disabled:before, .item-box .item-num .up.up-disabled:hover:before{
	content: " ";
    background-position: 0 -240px;
}
.item-box .item-num .num{
	position: relative;
    overflow: hidden;
    float: left;
    display: inline-block;
    width: 56px;
    height: 18px;
    margin: 7px 0 0;
    border: none;
    border-radius: 3px;
    line-height: 18px;
    text-align: center;
    font-size: 14px;
}
.item-box .item-num input{
	width: 56px;
    height: 18px;
    background-color: transparent;
    border: none;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    padding: 0;
}
.item-box .item-num ul{
	/*display: none;*/
    position: absolute;
    left: 0;
    top: 0;
    width: 56px;
}
.item-box .item-num ul li{
	width: 56px;
    height: 18px;
}
.item-box .sku-status{
	position: relative;
    border-top: 1px solid #ebebeb;
    padding: 30px 0 0 10px;
}
.item-box .blue-title-btn{
	float: left;
    display: inline-block;
    width: 143px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 7px;
    border: 1px solid #5c81e3;
    background-color: #5c85e5;
    background-image: linear-gradient(#779ae9,#5078df);
    color: #fff;
    cursor: pointer;
}
.item-box .blue-title-btn:hover{
	transition: all .15s ease-out;
    box-shadow: inset 0 1px 1px #7696DE, inset 0 0 2px #627DCA, inset 0 -2px 3px #5A77C7, inset 0 0 100px rgba(48,77,147,.4);
}
.item-box .blue-title-btn a, .item-box .green-title-btn a{
	color: #fff;
}
.item-box .cart-operation-wrapper .gray-title-btn{
	margin-left: 20px;
}
.item-box .gray-title-btn{
	display: inline-block;
    width: 143px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: linear-gradient(#fff,#fafafa);
    border: 1px solid #e0e0e0;
    border-radius: 7px;
    color: #8c8c8c;
    cursor: pointer;
}
.item-box .gray-title-btn:hover{
	transition: all .15s ease-out;
    background: linear-gradient(#f6f6f6,#ededed);
}

</style>
