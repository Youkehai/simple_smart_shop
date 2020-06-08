<template>
  <div id="pop">
  	<div class="module-dialog-layer" style="display: block;"></div>
    <div class="module-dialog clear module-dialog-address module-dialog-show">
      <div class="dialog-panel">
        <div class="topbar">
          <div class="dialog-tit clear">
            <h4 class="js-dialog-title">管理收货地址</h4>
          </div>
          <span class="dialog-close" @click="closePop">x</span>
        </div>
        <div class="dialog-con js-dialog-container">
          <div class="animate-layer">
            <div class="dialog-inner js-address-add">
              <div class="save-address-box">
                <div class="address-form">
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="收货人姓名" v-model="receive.consigneeName">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3" :class="{'form-invalid-item':phoneError}">
                      <input type="text" class="js-verify" placeholder="手机号" v-model="receive.consigneePhone">
                      <div class="verify-error"></div>
                    </div>
                  </div>
		  <!-- <div class="module-form-row clear">
					<div class="form-item-v3 area-code-w fn-left form-valid-item">
                      <input type="text" class="js-verify js-address-area-code" placeholder="区号（可选）" v-model="receive.areaCode">
                      <div class="verify-error"></div>
                    </div>
                    <div class="form-item-v3 telephone-w fn-right form-valid-item">
                      <input type="text" class="js-verify js-address-telephone" placeholder="固定电话（可选）" v-model="receive.landLine">
                      <div class="verify-error"></div>
                    </div> 
                  </div>-->
                  <div class="module-form-row clear">
                    <div class="form-item-v3 select-item province-wrapper">
                      <select name="province_code" class="province select-province js-form-province js-verify" v-model="receive.provinceInfo" @change="changePro(receive.provinceInfo)">
                        <option value="0">请选择省份</option>
                        <option :value="province.provId+','+province.name" v-for="(province,index) in proList" :key='index'>{{province.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="module-form-row clear">
                    <div class="form-item-v3 select-item city-wrapper fn-left form-focus-item">
                      <select class="city select-city js-form-city js-verify" v-model="receive.cityInfo" @change="changeCity(receive.cityInfo)">
                        <option value="0">请选择城市</option>
                        <option :value="city.cityId+','+city.name" v-for="(city,index) in cityList" :key='index'>{{city.name}}</option>
                      </select>
                    </div>
                    <div class="form-item-v3 select-item district-wrapper fn-right form-focus-item">
                      <select class="city select-city js-form-city js-verify" v-model="receive.placeInfo">
                        <option value="0">请选择区县</option>
                        <option :value="county.countyId+','+county.name" v-for="(county,index) in countryList" :key='index'>{{county.name}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="详细地址，如街道名称，楼层，门牌号码等" v-model="receive.address">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row fn-clear">
                    <input type="checkbox" class="hide" value="1">
                    <span class="blue-checkbox" :class="receive.isDefault=='1'?'blue-checkbox-on':''" @click="chooseDefault"></span>设为默认
                  </div>
                  <div class="dialog-blue-btn big-main-btn js-verify-address" v-if="!receive.id"  @click="submitReceive"><a>保存</a>
                  </div>
					  <div class="dialog-blue-btn big-main-btn js-verify-address"  v-if="receive.id" @click="update"><a>修改</a>
                  </div>
                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import addList from '@/lib/addList'
  export default {
    data () {
      return {
        addList,
        receive: {
			provinceInfo:'0',
			cityInfo:'0',
			placeInfo:'0',
			consigneeName:'',
			consigneePhone:'',
			address:'',
			checked:false,
			isDefault:'0'
        },
        right: false,
        phoneError: false,
		proList:[],
		cityList:[],
		countryList:[]
      }
    },
    created () {
		if(this.oldReceive && this.oldReceive.id){
			this.receive=this.oldReceive
			this.receive.provinceInfo=this.oldReceive.provinceId+","+this.oldReceive.province
			this.changePro(this.receive.provinceInfo)
			this.receive.cityInfo=this.oldReceive.cityId+","+this.oldReceive.city
			this.changeCity(this.receive.cityInfo)
			this.receive.placeInfo=this.oldReceive.placeId+","+this.oldReceive.place
		}
		this.getCityData()
    },
    props: {
      oldReceive: {
        type: Object
      },
      receiveIndex: {
        type: Number
      }
    },
    computed: {
      receiveInfo () {
        return this.$store.state.receiveInfo
      }
    },
    methods: {
		getCityData(){//获取所有省市
		  let that=this
		  y.get('/api/open/address/pro',{},data=>{
			  that.proList=data.data
		  })
		},
			
		changePro(a){//获取所有省市
		  let that=this
		  this.receive.provinceId=a.split(",")[0]
		  this.receive.province=a.split(",")[1]
		  y.get('/api/open/address/city?proId='+this.receive.provinceId,{},data=>{
			  that.cityList=data.data
		  })
		},
		changeCity(a){
			let that=this
			this.receive.cityId=a.split(",")[0]
			this.receive.city=a.split(",")[1]
			y.get('/api/open/address/country?cityId='+this.receive.cityId,{},data=>{
			  that.countryList=data.data
			})
		},
      closePop ()　{
        this.$emit('close')
      },
      chooseDefault () {
		  if( this.receive.isDefault==0){
				this.receive.isDefault = 1
		  }else{
			  this.receive.isDefault = 0
		  }
        //this.receive.checked = !this.receive.checked
      },
      validate () {
       if(!this.receive.consigneeName){
		  y.error("请输入收货人名称")
		  return false
       }
       if (this.receive.consigneePhone.length!=11) {
         this.phoneError = true
         return true
       }
       if(!this.receive.province){
		   y.error("请选择省")
		  return false
       }
       if(!this.receive.city){
		   y.error("请选择市")
		  return false
       }
       if(!this.receive.placeInfo){
		   y.error("请选择区域")
		  return false
       }
       if(!this.receive.address){
		   y.error("请输入详细地址")
		  return false
       }
	   return true;
      },
	  update(){
		  if(this.validate()){
			  this.receive.placeId=this.receive.placeInfo.split(",")[0]
			  this.receive.place=this.receive.placeInfo.split(",")[1]
			  let that=this
			  y.put('/api/jwt/address/address',this.receive,data=>{
				 if(data && data.success){
					 that.receive={}
					that.$emit('close')
					y.success("修改成功")
				 }else{
					 y.error(data.message)
				 }
			  })
		  }
	  },
      submitReceive () {
		 this.receive.placeId=this.receive.placeInfo.split(",")[0]
		 this.receive.place=this.receive.placeInfo.split(",")[1]
		 let that=this
		 y.post('/api/jwt/address/address',this.receive,data=>{
			 if(data && data.success){
				 that.receive={}
				that.$emit('close')
				y.success("新增成功")
			 }else{
				 y.error(data.message)
			 }
		 })
      }
    }
  }
</script>

<style>
#pop .module-dialog-layer{
    display: none;
    position: fixed;
    _position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: .6;
}
#pop .module-dialog .dialog-panel, .module-dialog:after{
    display: inline-block;
    vertical-align: middle;
}
#pop .module-dialog:after{
    content: '';
    height: 100%;
    margin-left: -.25em;
}
#pop .module-dialog{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1001;
    text-align: center;
    opacity: 0;
    transition: opacity .2s ease-in;
}
#pop .module-dialog-show{
    opacity: 1;
}
#pop .module-dialog .dialog-panel{
    position: relative;
    width: 450px;
    min-width: 200px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1) inset, 1px 0 3px rgba(0,0,0,.1);
    text-align: left;
    height: 592px;
}
#pop .module-dialog .topbar{
    overflow: hidden;
    width: 100%;
    height: 60px;
    background: linear-gradient(#FFF,#F5F5F5);
    border-bottom: 1px solid #DCDCDC;
    border-radius: 10px 10px 0 0;
    box-shadow: 2px 0 5px rgba(0,0,0,.1);
}
#pop .module-dialog-address .topbar{
    position: relative;
    z-index: 10;
}
#pop .module-dialog .dialog-tit{
    height: 60px;
    padding: 0 15px;
    line-height: 60px;
}
#pop .module-dialog .dialog-tit h4{
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: #666;
}
#pop .module-dialog .dialog-close{
    overflow: hidden;
    display: block;
    position: absolute;
    right: 10px;
    top: 15px;
    z-index: 20;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    color: #000;
    opacity: .2;
    cursor: pointer;
    transition: all .3s linear;
}
#pop .module-dialog .dialog-close:hover{
    opacity: .3;
}
.module-dialog .animate-layer{
    position: relative;
}
#pop .module-dialog-address .save-address-box{
    width: 450px;
    padding-top: 29px;
}
#pop .address-form{
    width: 370px;
    margin: 0 auto;
}
.account-address .address-form{
    padding: 30px;
    margin: 0;
}
#pop .module-form-row{
    position: relative;
    padding-bottom: 10px;
    margin: 0 auto;
}
#pop .address-form .module-form-row{
    padding-bottom: 15px;
}
#pop .module-form-row .form-item-v3{
    position: relative;
    height: 46px;
    background: #FFF;
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 0 3px 5px -4px rgba(0,0,0,.4) inset, -1px 0 3px -2px rgba(0,0,0,.1) inset;
    line-height: 46px;
    font-size: 18px;
    opacity: .618;
    transition: opacity .3s ease;
}
#pop .module-form-row .form-item-v3 i{
    position: absolute;
    left: 15px;
    top: 0;
    font-size: 16px;
    color: #BEBEBE;
}
#pop .module-form-row .form-item-v3 input{
    padding: 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
}
#pop .address-form .form-item-v3 input{
  width: 330px;
}
#pop .address-form .form-item-v3:after{
  position: absolute;
  right: 13px;
  top: 50%;
  z-index: 11;
  height: 26px;
  padding: 0 10px;
  margin-top: -13px;
  background: #D16D62;
  border-radius: 4px;
  line-height: 26px;
  font-size: 12px;
  color: #FFF;
  visibility: hidden;
  content: "手机号格式错误";
  opacity: 0;
  transition: all .3s ease-in;
}
#pop .module-form-row .form-invalid-item{
  opacity: 1;
  border: 1px solid #D16D62;
}
#pop .module-form-row .form-invalid-item:after{
  visibility: visible;
  opacity: 1;
}
#pop .address-form .area-code-w{
    width: 118px;
}
#pop .address-form .telephone-w{
    width: 238px;
}
#pop .module-form-row div.select-item{
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
}
#pop .module-form-row .form-item-v3 select{
    margin: 0 0 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: #333;
}
#pop .address-form .select-province{
    width: 370px;
}
#pop .form-focus-item{
    z-index: 1;
    opacity: 1;
    border: 1px solid #6B93F2;
}
#pop .module-form-row div.select-item{
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
}
#pop .module-form-row .form-item-v3 select{
    height: 48px;
    padding: 0 15px;
    margin: 0;
    background: -webkit-linear-gradient(top,#FAFAFA,#F5F5F5);
    background: linear-gradient(#FAFAFA,#F5F5F5);
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 2px 0 0 rgba(255,255,255,.4) inset, 1px 0 0 rgba(255,255,255,.3);
    line-height: 48px;
    text-indent: 0;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
}
#pop .address-form .select-city, #pop .address-form .select-district{
    width: 180px;
}
#pop .blue-checkbox, #pop .blue-checkbox-disable, #pop .blue-checkbox-on{
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    background: url(../assets/img/checkbox-bg.png) no-repeat;
    cursor: pointer;
}
#pop .address-form .blue-checkbox{
    top: 0;
    float: left;
    margin-right: 5px;
}
#pop .blue-checkbox-on, .choose-checkbox-on .blue-checkbox{
  background: url(../assets/img/checkbox-bg.png) 0 -20px no-repeat;
}
#pop .dialog-blue-btn{
    padding: 1px;
    background: #6383C6;
    background: linear-gradient(#6383C6,#4262AF);
    border-radius: 6px;
    text-align: center;
    color: #FFF;
}
#pop .disabled-btn{
    opacity: .4;
}
#pop .disabled-btn, .disabled-btn a{
    cursor: not-allowed;
    -webkit-transition: none;
    transition: none;
    pointer-events: none;
}
#pop .dialog-blue-btn a{
    display: block;
    padding: 2px 0;
    background: #5F7ED7;
    background: linear-gradient(#6F97E5,#527ED9);
    border-radius: 5px;
    box-shadow: inset 0 1px 2px #7EA1E8;
    text-shadow: 0 -1px 0 #4F70B3;
    color: #FFF;
}
#pop .big-main-btn a{
    height: 42px;
    line-height: 42px;
    font-size: 18px;
}
</style>
