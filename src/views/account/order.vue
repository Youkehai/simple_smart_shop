<template>
<div class="account-content">
	<div class="account-order">
		<div class="gray-box">
			<div class="title columns-title pre-title">
				<h2>我的订单</h2>
				  <el-dropdown trigger="click" style="float: right;">
					  <span class="el-dropdown-link">
						全部状态<i class="el-icon-arrow-down el-icon--right"></i>
					  </span>
					  <el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="selectByStatus('')">全部状态</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('-1')">代付款</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('0')">待发货</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('1')">待收货</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('2')">已签收</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('3')">待退款</el-dropdown-item>
						<el-dropdown-item @click.native="selectByStatus('4')">已退款</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
				
				<!-- <div class="gray-btn-menu sort-status-menu">
					<span class="label"><i class="arrow"></i> 全部状态 </span>
					<ul class="menu-list">
						<li class="selected"><a href="javascript:;">全部状态</a></li>
						<li class=""><a href="javascript:;">代付款</a></li>
						<li class=""><a href="javascript:;">待收货</a></li>
						<li class=""><a href="javascript:;">已完成</a></li>
					</ul>
				</div> -->
			<!-- 	<div class="gray-btn-menu sort-time-menu -gray-btn-menu-on">
					<span class="label"><i class="arrow"></i> 最近三个月 </span>
					<ul class="menu-list">
						<li class="selected"><a href="javascript:;">最近三个月</a></li>
						<li class=""><a href="javascript:;">今年内</a></li>
						<li class=""><a href="javascript:;">2016年</a></li>
						<li class=""><a href="javascript:;">2015年</a></li>
					</ul>
				</div> -->
			</div>
			<div class="js-list-inner">
				<div class="box-inner order-cart order-list-cart clear" v-for="(order,index) in orderData" :key='index'>
					<div class="gray-sub-title cart-title">
						<span class="date">{{order.createDate}}</span>
						<span class="order-id"> 订单号： <a href="javascript:;">{{order.id}}</a> </span>
						<span class="order-detail">
						<router-link :to='{name:"Payment",query:{id:order.id}}'>查看详情&gt;</router-link>
					  </span>
					  <span class="sub-total">应付总额</span>
						<span class="num">数量</span>
						<span class="price">单价</span>
					</div>
					<div class="cart">
						<div class="cart-items clear" v-for="(item,index) in order.itemList" :key='index'>
							<div class="prod-info clear">
								<!-- <div class="items-thumb">
									<a href="javascript:;" target="_blank">
									<img :src="item.ali_image">
									</a>
								</div> -->
								<div class="items-params clear">
									<div class="name vh-center">
										<a href="javascript:;" :title="item.shopName+'('+item.shopSpecifications+')'" target="_blank">{{item.shopName}}({{item.shopSpecifications}})</a>
									</div>
									<div class="detail"></div>
								</div>
								<div class="num">{{item.num}}</div>
								<div class="price">¥ {{item.price/item.num}}.00</div>
							</div>
						</div>
					</div>
					<div class="prod-operation">
						<div class="total">¥ {{order.price}}.00</div>
						<div class="status">
						<router-link class="blue-small-btn js-payment-order" v-if="order.status==-1" :to='{name:"Payment",query:{id:order.id}}'>现在付款</router-link>
						<span v-if="order.status==-1" class="blue-small-btn js-payment-order" @click="cancleOrder(order.id)">取消订单</span>
						<span v-if="order.status==0">待发货</span>
						<span v-if="order.status==1" class="blue-small-btn js-payment-order" @click="getOrderLog(order.id)">查看物流</span>
						<span v-if="order.status==1" class="blue-small-btn js-payment-order" @click="sure(order.id)">确认签收</span>
						<span v-if="order.status==2">已签收</span>
						<span v-if="order.status==3">等待退款</span>
						<span v-if="order.status==4" style="color:red">已退款</span>
					  </div>
					</div>
				</div>
			</div>
		</div>
				<el-pagination
				style="margin-left:40%"
				 @size-change="handleSizeChange"
				 @current-change="handleCurrentChange"
				 :page-sizes="[8,16,32]"
				 :page-size="page.size"
				 layout="sizes, prev, pager, next"
				 :total="page.total">
				</el-pagination>
			</div>
			<el-dialog  title="物流信息"
			  :visible.sync="dialogLine"
			  >
			  <el-timeline>
				<el-timeline-item v-for="item in logList"  :key="item.id" :timestamp="item.createDate" placement="top">
				  <el-card>
					<h4>{{item.tips}}</h4>
					<!-- <p>{{item.createDate}}</p> -->
				  </el-card>
				</el-timeline-item>
			  </el-timeline>
		  </el-dialog>
</div>
</template>

<script>
export default{
	data(){
		return{
			dialogLine:false,
			orderData:[],
			logList:[],
			page:{
				size:10,
				total:0,
				current:1,
				status:''
			}
		}
	},
	methods:{
		cancleOrder(id){//取消订单
			let that=this;
			y.confirm("提示","你确定要取消订单吗？",function(){
				y.delete('/api/jwt/order/order/'+id,{},data=>{
					if(data  && data.success){
						y.success("取消成功")
						that.getAllOrder();
					}else{
						y.error(data.message)
					}
				})
			})
			
		},
		selectByStatus(status){
			this.page.status=status
			this.getAllOrder()
		},
		handleSizeChange(val) {
		  this.page.size=val
		  this.getAllOrder()
		  },
		handleCurrentChange(val) {
		  this.page.current=val
		  this.getAllOrder()
		},
		getOrderLog(id){//获取订单物流信息
			let that=this
			y.get('/api/jwt/logistics/logistics?id='+id,{},data=>{
				if(data && data.success){
					that.logList=data.data
					that.dialogLine=true
				}else{
					that.logList=[]
				}
			})
		},
		getAllOrder(){
			let that=this
			y.get('/api/jwt/order/myOrderFinish',this.page,data=>{
				if(data && data.success){
					that.orderData=data.data.records
					that.page.total=data.data.total
				}else{
					that.orderData=[]
					that.page.total=0
				}
			})
		},
		sure(id){//签收订单
			var order={
				id:id,
				status:2
			}
			let that=this
			y.put('/api/jwt/order/orderInfo',order,data=>{
				if(data && data.success){
					//增加一条物流信息
					var log={
						orderId:id,
						createDate:y.getNowDate(),
						tips:"已签收，签收人：本人"
					}
					y.post('/api/jwt/logistics/logistics',log,data=>{
						if(data && data.success){
							y.success("签收成功")
							that.getAllOrder()
						}else{
							y.error(data.message)
						}
					})
				}else{
							y.error(data.message)
						}
			})
		},
	},
	created(){
		this.getAllOrder()
	}
}
</script>

<style>
.account-order .gray-box{
	margin-bottom: 20px;
}
.gray-box .columns-title h2{
	float: left;
}
.gray-btn-menu{
	display: inline-block;
    height: 36px;
    background: #F2F2F2;
    background: linear-gradient(#FFF,#F5F5F5);
    border: 1px solid #DBDDE2;
    border-radius: 4px;
    line-height: 36px;
    cursor: pointer;
    text-align: center;
    user-select: none;
}
.account-order .sort-status-menu{
	width: 112px;
}
.gray-box .title .gray-btn-menu, .gray-box .title span.gray-normal-btn{
	margin: 10px 0 0 10px;
}
.gray-box .title .gray-btn-menu{
	overflow: visible;
    float: right;
}
.gray-btn-menu .label{
	position: relative;
    z-index: 1;
    display: block;
    padding: 0 13px 0 16px;
    text-align: left;
    color: #666;
}
.gray-box .title .gray-btn-menu .label{
	overflow: visible;
    float: none;
    margin-top: 0;
}
.gray-btn-menu .label .arrow{
	float: right;
    width: 10px;
    height: 7px;
    margin: 16px 0 0 6px;
    background: url(../../assets/img/btn-icon-new.png) -15px -571px no-repeat;
}
.gray-btn-menu .menu-list{
	display: none;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 100%;
    padding: 38px 0 6px;
    background: #FFF;
    border: 1px solid #dbdde2;
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 #EEE;
}
.gray-btn-menu-on .menu-list, .white-btn-menu-on .menu-list{
	display: block;
}
.gray-btn-menu .menu-list li{
	height: 24px;
    line-height: 24px;
    padding: 0 3px 3px;
    text-align: left;
    font-size: 12px;
}
.gray-btn-menu .menu-list li a{
	display: block;
    padding: 0 15px;
    border-radius: 3px;
    color: #999;
}
.gray-btn-menu .menu-list li a:hover{
	background: #C7C7CA;
    color: #FFF;
}
.gray-btn-menu .menu-list li.selected a{
	background: #8F9096;
    color: #FFF;
    cursor: default;
}
.account-order .sort-time-menu{
	width: 118px;
}
.gray-btn-menu-on .label .arrow, .white-btn-menu-on .label .arrow{
	margin-top: 15px;
    background-position: -15px -521px;
}
.gray-btn-menu-on, .white-btn-menu-on{
	position: relative;
    z-index: 10;
    height: auto;
    background: #FFF;
}
.gray-btn-menu-on{
	border: 1px solid #DBDDE2;
}
.gray-box, .gray-btn-menu-on:hover{
	background: #FFF;
}
.gray-box .gray-sub-title{
	height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
}
.account-order .gray-box .box-inner:first-child .gray-sub-title{
	border-top: none;
}
.order-list-cart .cart-title span{
	float: right;
    text-align: center;
}
.order-list-cart .cart-title .operation, .order-list-cart .cart-title .order-detail, .order-list-cart .cart-title .sub-total{
	float: right;
}
.order-list-cart .cart-title .date, .order-list-cart .cart-title .order-id{
	float: left;
    text-align: left;
}
.order-list-cart .cart-title .date{
	width: 130px;
    padding-left: 6px;
}
.order-list-cart .cart-title .order-detail{
	width: 82px;
    padding-left: 24px;
    text-align: right;
}
.order-list-cart .cart-title .sub-total{
	width: 102px;
    padding-right: 18px;
    border-left: 1px solid #DBDBDB;
    text-align: right;
}
.order-list-cart .cart-title .operation{
	width: 95px;
    height: 38px;
    padding-right: 23px;
}
.order-list-cart .cart-title .num{
	width: 70px;
}
.order-list-cart .cart-title .price{
	width: 85px;
    padding-right: 27px;
    text-align: left;
}
.gray-box .gray-sub-title a{
	color: #6989E0;
}
.order-list-cart .cart{
	float: left;
    width: 737px;
    padding: 0;
    border-right: 1px solid #EBEBEB;
}
.order-cart .cart-items{
	position: relative;
    padding: 18px 0 28px;
    border-top: 1px solid #EFEFEF;
}
.order-list-cart .cart-items{
	height: 110px;
    padding: 0;
}
.order-cart .cart-items:first-child{
	border-top: none;
}
.order-cart .prod-info{
	position: relative;
    margin-left: 138px;
}
.order-list-cart .prod-info{
	padding: 15px 0 15px 111px;
    margin-left: 0;
    position: relative;
}
.order-list-cart .items-thumb{
	position: absolute;
	left: 30px;
    top: 15px;
    width: 78px;
    height: 78px;
    border: 1px solid #EBEBEB;
    border-radius: 3px;
}
.order-list-cart .items-thumb img{
    width: 78px;
    height: 78px;
}
.order-list-cart .items-params{
	float: left;
    height: 50px;
    padding: 15px 0;
    margin-left: 29px;
    border-bottom: none;
    line-height: 25px;
}
.order-cart .items-params .name{
	overflow: hidden;
    float: left;
    color: #666;
    width: 435px;
    height: 44px;
    text-align: left;
}
.order-list-cart .prod-info .name{
	float: none;
    width: 220px;
    height: 25px;
    line-height: 25px;
}
.order-list-cart .prod-info .vh-center{
	height: auto;
    line-height: 50px;
}
.hide-row, .order-cart .items-params .name, .support-cart .items-detail .detail{
	text-overflow: ellipsis;
    white-space: nowrap;
}
.order-list-cart .prod-info .num, .order-list-cart .prod-info .operation, .order-list-cart .prod-info .price, .order-list-cart .prod-info .subtotal{
	float: right;
    line-height: 80px;
    text-align: center;
}
.order-list-cart .prod-info .operation{
	display: table;
    width: 95px;
    height: 80px;
    padding-right: 23px;
    line-height: 25px;
}
.order-list-cart .prod-info .num{
	width: 70px;
}
.order-list-cart .prod-info .price{
	width: 150px;
    padding-right: 27px;
    text-align: center;
}
.order-list-cart .prod-operation{
	float: right;
    display: table;
    height: 110px;
}
.order-list-cart .prod-operation .total{
	display: table-cell;
    padding-right: 78px;
    line-height: 14px;
    text-align: right;
    vertical-align: middle;
}
.order-list-cart .prod-operation .status{
	display: table-cell;
    width: 75px;
    padding: 0 0px;
    text-align: left;
    vertical-align: middle;
}
.blue-small-btn, .orange-small-btn, .white-gray-small-btn{
	display: inline-block;
    height: 30px;
    padding: 0 13px;
    border-radius: 4px;
    line-height: 30px;
    font-size: 12px;
    cursor: pointer;
}
.blue-small-btn{
	background: #6383C6;
    background: linear-gradient(#7EA3F5,#5A82F0);
    box-shadow: 0 1px 2px rgba(255,255,255,.1) inset, 0 0 0 1px rgba(0,0,0,.2) inset, 0 1px 3px rgba(0,0,0,.1);
    color: #FFF;
}
.blue-small-btn:hover{
	box-shadow: 0 1px 1px #7696DE inset, 0 0 2px #627DCA inset, 0 -2px 3px #5A77C7 inset, 0 0 100px rgba(48,77,147,.4) inset, 0 0 0 1px rgba(0,0,0,.3) inset, 0 1px 3px rgba(0,0,0,.1);
    color: #FFF;
}

</style>
