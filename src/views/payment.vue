<template>
  <div id="main">
  	<div class="content page-order-payment" v-if="orderList.length==0">
  	    <div class="gray-box clear">
  	        <div class="title">
  	            <h2>支付订单</h2>
  	        </div>
  	        <div class="box-inner order-info"  v-if="orderInfo.status==-1">
  	            <h3 >提交订单成功</h3>
  	            <!-- <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p> -->
  	            <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p>
  	        </div>
			<div class="box-inner order-info"  v-if="orderInfo.status==0">
			    <h3 >订单支付成功</h3>
			    <!-- <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p> -->
			    <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p>
			</div>
			<div class="box-inner order-info"  v-if="orderInfo.status==1">
			    <h3 >订单发货成功</h3>
			    <!-- <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p> -->
			    <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p>
			</div>
			<div class="box-inner order-info"  v-if="orderInfo.status==2">
			    <h3 >订单签收成功</h3>
			</div>
			<div class="box-inner order-info"  v-if="orderInfo.status==3">
			    <h3 >正在等待商家退款</h3>
			</div>
			<div class="box-inner order-info"  v-if="orderInfo.status==4">
			    <h3 >退款成功</h3>
			</div>
  	        <div class="box-inner payment-checkout-panel clear">
  	            <span class="jianguo-blue-main-btn big-main-btn js-payment-order" @click="payNow(orderInfo.orderId)" v-if="orderInfo.status==-1">
  	                <a>现在支付</a>
  	            </span>
                <!-- <span class='is-pay'>支付已完成~ -->
				<span  v-if="orderInfo.status!=-1 && orderInfo.status!=3 && orderInfo.status!=4" class="jianguo-blue-main-btn big-main-btn js-payment-order" @click="refuse(orderInfo.id)" >
				    <a>发起退款</a>
				</span>
				<!-- </span> -->
  	            <span class="prices"> 应付金额：   <em><span>¥ </span>{{orderInfo.price}}.00</em>   </span>
  	        </div>
  	    </div>
  	    <div class="confirm-detail">
  	        <div class="info-title">订单编号</div>
  	        <p class="info-detail">{{orderInfo.id}}</p>
  	    </div>
  	    <div class="confirm-detail">
  	        <div class="info-title">收货信息</div>
  	        <p class="info-detail">姓名：{{orderInfo.consigneeName}}</p>
  	        <p class="info-detail">联系电话：{{orderInfo.consigneePhone}}</p>
            <p class="info-detail">详细地址：{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.place}}{{orderInfo.address}}</p>
  	    </div>
		
  	   <div class="confirm-detail">
  	        <div class="info-title">物流信息</div>
			<div v-for="(item,index) in orderInfo.logList" :key='item.id'>
  	        <p class="info-detail">{{item.createDate}}</p>
  	        <p class="info-detail">{{item.tips}}</p>
			</div>
  	    </div>
  	    <div class="confirm-table-title clear">
  	        <span class="name fn-left">商品信息</span>
  	        <span class="subtotal fn-right">小计</span>
  	        <span class="num fn-right">数量</span>
  	        <span class="price fn-right">单价</span>
  	    </div>
  	    <div class="confirm-goods-table">
  	        <div class="cart-items clear" v-for="(item,index) in orderInfo.itemList" :key='index'>
  	            <div class="name fn-left hide-row">
  	                <div class="name-cell">
  	                   <a href="javascript:;" :title="item.shopName+'('+item.shopSpecifications+')'" target="_blank">{{item.shopName}}({{item.shopSpecifications}})</a><br>
  	                </div>
  	            </div>
  	            <div class="subtotal fn-right">
  	                <div class="subtotal-cell">¥ {{item.price}}.00</div>
  	            </div>
  	            <div class="goods-num fn-right">{{item.num}}</div>
  	            <div class="price fn-right">¥ {{item.price/item.num}}.00</div>
  	        </div>
  	    </div>
  	    <div class="order-discount-line">
  	        <p> 商品总计： <span>¥ {{orderInfo.price}}.00</span> </p>
  	        <!-- <p> 运费： <span>+ ¥ {{orderInfo.freight}}.00</span> </p> -->
  	    </div>
  	</div>
	
	<!-- 多个订单统一改付款 -->
	<div class="content page-order-payment" v-if="orderList.length>0">
	<div class="gray-box clear">
	    <div class="title">
	        <h2>支付订单</h2>
	    </div>
	    <div class="box-inner order-info">
	        <h3>提交订单成功</h3>
	        <p class="payment-detail">请在 <span>24 小时内</span>完成支付，超时订单将自动取消。</p>
	        <p class="payment-detail">我们将在您完成支付后的 72 小时内发货</p>
	    </div>
	    <div class="box-inner payment-checkout-panel clear">
	        <span class="jianguo-blue-main-btn big-main-btn js-payment-order" @click="payNow(ids)">
	            <a>现在支付</a>
	        </span>
	        <span class="prices"> 金额：   <em><span>¥ </span>{{countPirce}}.00</em>   </span>
	    </div>
	</div>
	</div>
	<div class="content page-order-payment" style="margin-top:-200px" v-if="orderList.length>0" v-for="(orderInfo,index) in orderList" :key="orderInfo.id">
	
	    <div class="confirm-detail">
	        <div class="info-title">订单编号</div>
	        <p class="info-detail">{{orderInfo.id}}</p>
	    </div>
	    <div class="confirm-detail">
	        <div class="info-title">收货信息</div>
	        <p class="info-detail">姓名：{{orderInfo.consigneeName}}</p>
	        <p class="info-detail">联系电话：{{orderInfo.consigneePhone}}</p>
	        <p class="info-detail">详细地址：{{orderInfo.consigneeAddress}}</p>
	    </div>
	<!--    <div class="confirm-detail">
	        <div class="info-title">发票信息</div>
	        <p class="info-detail">发票类型：电子发票</p>
	        <p class="info-detail">发票抬头：{{orderInfo.invoiceName}}</p>
	        <p class="info-detail">发票内容：购买商品明细</p>
	    </div> -->
		
	    <div class="confirm-table-title clear">
	        <span class="name fn-left">商品信息</span>
	        <span class="subtotal fn-right">小计</span>
	        <span class="num fn-right">数量</span>
	        <span class="price fn-right">单价</span>
	    </div>
		
		
		
	    <div class="confirm-goods-table">
	        <div class="cart-items clear" v-for="(item,index) in orderInfo.itemList" :key='index'>
	            <div class="name fn-left hide-row">
	                <div class="name-cell">
	                   <a href="javascript:;" :title="item.shopName+'('+item.shopSpecifications+')'" target="_blank">{{item.shopName}}({{item.shopSpecifications}})</a><br>
	                </div>
	            </div>
	            <div class="subtotal fn-right">
	                <div class="subtotal-cell">¥ {{item.price}}.00</div>
	            </div>
	            <div class="goods-num fn-right">{{item.num}}</div>
	            <div class="price fn-right">¥ {{item.price/item.num}}.00</div>
	        </div>
	    </div>
	    <div class="order-discount-line">
	        <p> 商品总计： <span>¥ {{orderInfo.price}}.00</span> </p>
	        <!-- <p> 运费： <span>+ ¥ {{orderInfo.freight}}.00</span> </p> -->
	    </div>
	</div>
	
  </div>
</template>

<script>
export default{
	data(){
		return{
			orderInfo:{},
			orderList:[],
			ids:'',
			countPirce:0
		}
	},
	created(){
		this.getOrderInfo(this.$route.query.id)
	},
  methods:{
	 refuse(id){
		 var order={
			 id:id,
			 status:3
		 }
		 let that=this
		 y.put('/api/jwt/order/orderInfo',order,data=>{
			 if(data && data.success){
				 y.success("发起退款成功")
				 that.getOrderInfo(this.$route.query.id)
			 }else{
				 y.error(data.message)
			 }
		 })
	 },
	getOrderInfo(id){
		let that=this
		that.orderInfo={}
		that.ids=""
		if(id.indexOf(",")!=-1){//如果是多个订单一起查
			y.get('/api/jwt/order/orderInfo?ids='+id,{},data=>{
				if(data && data.success){
					that.orderList=data.data
					var len=data.data.length
					for(var i=0;i<len;i++){
						if(data.data[i].status=='-1'){
							that.ids+=data.data[i].id+","
							that.countPirce+=Number(data.data[i].price)
						}
					}
				}else{
					that.orderList=[]
				}
			})
		}else{
			y.get('/api/jwt/order/order/'+id,{},data=>{
				if(data && data.success){
					that.orderInfo=data.data
				}else{
					that.orderInfo={}
				}
			})
		}
	},
    payNow(id){
		//调起支付宝沙盒
		if(this.ids){
			// var order={
			// 	id:this.ids,
			// 	price:this.countPirce
			// }
			// y.post('/payment/payMent',order,data=>{
				
			// })
			window.open(y.v.apiPath+"/payment/payMent?id="+this.ids+"&price="+this.countPirce)
		}else{
			window.open(y.v.apiPath+"/payment/payMent?id="+this.orderInfo.id+"&price="+this.orderInfo.price)
		}
    }
  }
}
</script>

<style>
  .header-desktop{
      display: none;
  }
  .content{
      clear: both;
      width: 1220px;
      min-height: 600px;
      padding: 0 0 25px;
      margin: 0 auto;
  }
  .page-order-payment{
      padding-top: 39px;
  }
  .gray-box{
      overflow: hidden;
      border: 1px solid #D1D1D1;
      border-color: rgba(0,0,0,.14);
      border-radius: 8px;
      box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
      background: #fff;
  }
  .page-order-payment .gray-box{
      margin: 0 auto 60px;
  }
  .gray-box .title{
      height: 60px;
      padding: 0 10px 0 28px;
      background: linear-gradient(#FFF,#F5F5F5);
      border-bottom: 1px solid #DCDCDC;
      border-radius: 10px 10px 0 0;
      box-shadow: 0 1px 7px rgba(0,0,0,.06);
      line-height: 60px;
      color: #646464;
  }
  .gray-box .title h2{
      font-size: 18px;
      font-weight: 400;
      color: #626262;
  }
  .page-order-payment .order-info{
      padding: 60px 0 55px;
      color: #333;
  }
  .page-order-payment .order-info h3{
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
  }
  .page-order-payment .order-info .payment-detail{
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
  }
  .page-order-payment .order-info .payment-detail span{
      font-weight: bolder;
      color: #DE4037;
  }
  .page-order-payment .order-info .payment-detail{
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
  }
  .page-order-payment .payment-checkout-panel{
      padding: 10px 10px 10px 0;
      line-height: 60px;
      background: #f9f9f9;
      border-top: 1px solid #e5e5e5;
      box-sizing: border-box;
  }
  .jianguo-blue-main-btn{
      background: linear-gradient(#6383C6,#4262AF);
      box-shadow: none;
  }
  .blue-main-btn, .gray-main-btn, .jianguo-blue-main-btn{
      display: block;
      padding: 1px;
      margin: 0 auto;
      border-radius: 6px;
      background: linear-gradient(#5598c9,#2a6da2);
      text-align: center;
      text-shadow: rgba(255,255,255,.496094) 0 1px 0;
      font-family: 'Microsoft Yahei','微软雅黑','PingFang SC',sans-serif;
      cursor: pointer;
      user-select: none;
  }
  .page-order-payment .big-main-btn{
      float: right;
      width: 120px;
      height: 40px;
      line-height: 40px;
      margin: 0 0 0 10px;
  }
  .jianguo-blue-main-btn a{
      display: block;
      border-radius: 6px;
      cursor: pointer;
      background: linear-gradient(#6F97E5,#527ED9);
      box-shadow: inset 0 1px 2px #7EA1E8;
      text-shadow: 0 -1px 0 #4F70B3;
      color: #FFF;
      transition: all .3s ease;
  }
  .page-order-payment .big-main-btn a{
      height: 40px;
      padding: 0;
      line-height: 40px;
      font-size: 16px;
  }
  .jianguo-blue-main-btn:hover a{
      box-shadow: inset 0 1px 1px #7696DE, inset 0 0 2px #627DCA, inset 0 -2px 3px #5A77C7, inset 0 0 100px rgba(48,77,147,.4);
  }
  .page-order-payment .prices{
      float: right;
      line-height: 24px;
      padding: 6px 20px 6px 0;
      font-size: 14px;
  }
  .page-order-payment .prices em{
      margin-left: 5px;
      font-size: 24px;
      color: #D44D44;
  }
  .page-order-payment .confirm-detail{
      padding: 0 30px 25px;
      border-top: 1px solid #d5d5d5;
  }
  .page-order-payment .confirm-detail .info-title{
      height: 14px;
      padding: 30px 0 17px;
      line-height: 14px;
      font-weight: bolder;
      color: #333;
  }
  .page-order-payment .confirm-detail .info-detail{
      line-height: 24px;
      color: #666;
  }
  .page-order-payment .confirm-table-title{
      padding: 3px 0 0 30px;
      border-top: 1px solid #D5D5D5;
      line-height: 54px;
      font-weight: bolder;
      color: #000;
  }
  .page-order-payment .confirm-table-title .num, .page-order-payment .confirm-table-title .price, .page-order-payment .confirm-table-title .subtotal{
      width: 175px;
      padding-right: 29px;
      text-align: right;
  }
  .page-order-payment .confirm-goods-table{
      padding-left: 30px;
      border-top: 1px solid #D5D5D5;
  }
  .page-order-payment .cart-items{
      height: 80px;
      border-top: 1px solid #D5D5D5;
  }
  .page-order-payment .cart-items:first-child{
      border-top: none;
  }
  .hide-row{
      overflow: hidden;
      word-break: keep-all;
  }
  .page-order-payment .cart-items .name{
      display: table;
      width: 540px;
      height: 100%;
  }
  .page-order-payment .cart-items .name-cell{
      display: table-cell;
      line-height: 22px;
      vertical-align: middle;
      color: #333;
  }
  .page-order-payment .cart-items .name-cell a{
      color: #333;
  }
  .page-order-payment .cart-items .goods-num, .page-order-payment .cart-items .price, .page-order-payment .cart-items .subtotal{
      width: 175px;
      padding-right: 29px;
      line-height: 80px;
      text-align: right;
  }
  .page-order-payment .cart-items .goods-num{
      width: 28px;
      padding-left: 147px;
      text-align: center;
  }
  .page-order-payment .order-discount-line{
      padding: 22px 30px 53px;
      border-top: 1px solid #D5D5D5;
      line-height: 24px;
      text-align: right;
      font-size: 12px;
  }
  .page-order-payment .order-discount-line p:first-child{
      line-height: 32px;
      text-align: right;
      font-size: 14px;
      font-weight: bolder;
  }
  .is-pay{
    float: right;
    width: 120px;
    height: 40px;
    line-height: 40px;
    margin: 0 0 0 10px;
    display: block;
    padding: 1px;
    text-align: center;
    font-size: 16px;
  }
</style>
