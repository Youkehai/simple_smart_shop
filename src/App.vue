<template>
  <div id="app">
    <headerNav v-if="!$route.meta.showAll"></headerNav>
    <router-view/>
    <footerNav v-if="!$route.meta.showAll"></footerNav>
  </div>
</template>

<script>
import headerNav from './components/header-nav'
import footerNav from './components/footer-nav'
export default {
  name: 'App',
  components: {
    headerNav,
    footerNav
  }
}
</script>

<style>

</style>
