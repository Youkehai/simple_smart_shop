<template>
  <!--商品-->
  <div  class="nav-goods-panel ">
  		<ul  class="nav-goods-list">
  			<!---->
  			<li  class="jianguopro2">
  				<a  href="">
  					<div  class="item-thumb">
  						<img  alt="" height="160" width="160" src="../assets/img/goods/ironenergy.png"> </div>
  					<div  class="item-name">方舟反应堆</div>
  					<div  class="item-price">¥ 156,666,666.00 起</div>
  				</a>
  			</li>
  			<li  class="jianguopro">
  				<a  href="">
  					<div  class="item-thumb">
  						<img  alt="" height="160" width="160" src="../assets/img/goods/batsuit.png"> </div>
  					<div  class="item-name">蝙蝠侠战衣</div>
  					<div  class="item-price">¥ 250,000.00 起</div>
  				</a>
  			</li>
  		</ul>
  </div>
</template>

<script>
</script>

<style>
  .nav-goods-panel{
  	    height: 0px;
  	    position: relative;
  	    overflow: hidden;
  	   	background: #E7E7E7;
  	   	opacity: 0;
  }
  .active .nav-goods-panel{
  	    height: 300px;
  	    position: relative;
  	    overflow: hidden;
  	   	background: #E7E7E7;
  	   	opacity: 1;
  }
  .nav-goods-list{
  	visibility: visible;
  	opacity: 1;
  	width: 100%;
      height: 270px;
      padding-top: 52px;
      text-align: center;
  }
  .nav-goods-list li{


  	position: relative;
      display: inline-block;

      height: 260px;
      font-size: 14px;
  }
</style>
