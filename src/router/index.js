import Vue from 'vue'
import Router from 'vue-router'
import '../assets/css/header.css'
import '../assets/css/reset.css'
import Home from '../views/home'
import PageOne from '../views/page_one'
import PageTwo from '../views/page_two'
import buinessShop from '../views/buinessShop'
import PageFive from '../views/page_five'
import Item from '@/views/item'
import Cart from '@/views/cart'
import Checkout from '@/views/checkout'
import Payment from '@/views/payment'
import Account from '@/views/account'
import Order from '@/views/account/order'
import Address from '@/views/account/address'
import Login from '@/views/login.vue'
import paySuccess from '@/views/paySuccess.vue'
import userInfo from '@/views/account/userInfo.vue'
import collectionList from '@/views/account/collectionList.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
	{
	  path: '/Login',
	  component: Login,
	  meta:{showAll:true}
	},
    {
      path: '/Home',
      component: Home
    },
    {
      path: '/PageOne',
      component: PageOne
    },
    {
      path: '/PageTwo',
      component: PageTwo
    },
	{
	  path: '/buinessShop',
	  component: buinessShop
	},
    {
      path: '/PageFive',
      component: PageFive
    },
    {
      path: '/item',
      name: 'Item',
      component: Item
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment
    },
	{
	  path: '/paySuccess',
	  name: 'paySuccess',
	  component: paySuccess
	},
	
    {
      path: '/account',
      component: Account,
      children: [
        {
          path: '',
          name: 'Account',
          component: Order
        },
        {
          path: '/address',
          name: 'Address',
          component: Address
        },
		{
		  path: '/userInfo',
		  name: 'userInfo',
		  component: userInfo
		},
		{
		  path: '/collectionList',
		  name: 'collectionList',
		  component: collectionList
		},
		
      ]
    }
  ]
})
