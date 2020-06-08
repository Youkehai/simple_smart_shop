import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 第二部，创建一个store
let store = new Vuex.Store({
  state:{
		//头部展示内容
	showType:localStorage.getItem("showType")?localStorage.getItem("showType"):'system',
	buinessName:localStorage.getItem("buinessName")?localStorage.getItem("buinessName"):'',
    // 存放数据
    carPanelData:[],
    // 是否为最大值
    maxOff:false,
    // 控制隐藏显示
    carShow:false,
    // 地址
    receiveInfo : [{
      "name": "王某某",
      "phone": "13811111111",
      "areaCode": "010",
      "landLine": "64627856",
      "provinceId": 110000,
      "province": "北京市",
      "cityId": 110100,
      "city": "市辖区",
      "countyId": 110106,
      "county": "海淀区",
      "add": "上地十街辉煌国际西6号楼319室",
      "default": true
    },{
      "name": "李某某",
      "phone": "13811111111",
      "areaCode": "010",
      "landLine": "64627856",
      "provinceId": 110000,
      "province": "北京市",
      "cityId": 110100,
      "city": "市辖区",
      "countyId": 110106,
      "county": "海淀区",
      "add": "上地十街辉煌国际东6号楼350室",
      "default": false
    }],
    orderData:{}
  },
  getters: {
    // 计算
    // 数量
    totalCount (state) {
      let count = 0
      state.carPanelData.forEach((goods) => {
        count += goods.count
       })
      return count
    },
    // 价格
    totalPrice (state) {
      let price = 0
      state.carPanelData.forEach((goods) => {
        price += goods.count * goods.price
      })
      return price
    },
    // 全选
    allChecked (state) {
      let allChecked = true
      state.carPanelData.forEach((goods) => {
        if (!goods.check) {
          allChecked = false
        }
      })
      return allChecked
    },
    // 计算总金额
    ckeckPrice (state) {
      let price = 0
      state.carPanelData.forEach((goods) => {
        if (goods.check) {
          price += goods.price * goods.count
        }
      })
      return price
    },
    // 计算数量
    ckeckCount (state) {
      let count = 0
      state.carPanelData.forEach((goods) => {
        if (goods.check) {
          count += goods.count
        }
      })
      return count
    },
    // 当前加入的商品
    checkGoods (state) {
      let checkGoods = []
      state.carPanelData.forEach((goods) => {
        if (goods.check) {
          checkGoods.push(goods)
        }
      })
      return checkGoods
    }
  },
  mutations: {
    // 添加商品
    addCarpanelData (state, data) {
      // bOff是判断购物车是否添加过
      let bOff = true

      state.carPanelData.forEach(goods => {
        if (goods.sku_id === data.info.sku_id) {
          goods.count += data.count
          if (goods.count > goods.limit_num) {
            goods.count -= data.count
            state.maxOff = true
            bOff = false
            return
          }
          bOff = false
          state.carShow = true
        }
      })

      if (bOff) {
        state.carShow = true
        let goodsData = data.info
        Vue.set(goodsData, 'count', data.count)
        Vue.set(goodsData, 'check', true)
        state.carPanelData.push(goodsData)
      }
    },
    // 删除购物车商品
    delCarPanelData (state, id) {
      state.carPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          state.carPanelData.splice(index, 1)
        }
      })
    },
    closePrompt (state) {
      state.maxOff = false
    },
    // 显示购物车
    showCar (state) {
      state.carShow = true
    },
    // 隐藏购物车
    hideCar (state) {
      setTimeout(() => {
        state.carShow = false
      })
      state.carShow = false
    },
    // 增加
    plusCartPanelData (state, id) {
      state.carPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          if (goods.count >= goods.limit_num) return
          goods.count++
        }
      })
    },
    // 减少
    subCartPanelData (state, id) {
      state.carPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          if (goods.count <= 1) return
          goods.count--
        }
      })
    },
    checkGoods (state, id) {
      state.carPanelData.forEach((goods, index) => {
        if (goods.sku_id === id) {
          goods.check = !goods.check
        }
      })
    },
    // 控制全选
    allCheckGoods (state, allChecked) {
      state.carPanelData.forEach((goods, index) => {
        goods.check = !allChecked
      })
    },
    // 删除选中的商品
    delCheckGoods (state) {
      // 从前往后删除，会有个小bug：删除多个时会留下一个
      // state.carPanelData.forEach((goods,index) =>{
      //   if(goods.check){
      //     state.carPanelData.splice(index,1)
      //   }
      // })

      // 从后往前删除
      let i = state.carPanelData.length
      while (i--) {
        if (state.carPanelData[i].check) {
          state.carPanelData.splice(i, 1)
        }
      }
    },
    // 添加收货人信息
    submitReceive (state, data) {
      if (data.default) {
        state.receiveInfo.forEach((receive) => {
          receive.default = false
        })
        state.receiveInfo.push(data)
      }
    },
    submitOrder (state, data) {
      //state.orderData.unshift(data)
			state.orderData=data
      // let i = state.carPanelData.length
      // while (i--) {
      //   if (state.carPanelData[i].check) {
      //     state.carPanelData.splice(i, 1)
      //   }
      // }
    },
	setShowType (state, data) {
		state.showType=data
	},
	setBuinessName (state, data) {
		state.buinessName=data
	},
    // 支付成功
    payNow (state, id) {
      state.orderData.forEach((order, index) => {
        if (order.orderId === id) {
          order.isPay = true
        }
      })
    }
  }
})

//  第三步，将store暴露
export default store
