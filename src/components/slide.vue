<template>
	<div class="carousel-wrap" id="carousel">
		<transition-group tag='ul' class='slide-ul' name='list'>
			<li v-for="(list,index) in slideList" v-show="index===currentIndex" @mouseenter="stop" @mouseleave="go" v-bind:key="list.clickUrl+index">
				<a :href="list.clickUrl">
					<img :src="list.image" :alt="list.desc" />
				</a>
			</li>
		</transition-group>
		<div class="carousel-items">
			<span v-for="(item,index) in slideList.length" :class="{'active':index === currentIndex}" @mouseover="change(index)" >

			</span>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				slideList:[
					{
						'clickUrl' : '#',
						'desc' : '第一张图',
						'image' : 'https://img.alicdn.com/tps/i4/TB1JTF6Ahn1gK0jSZKPSutvUXXa.jpg_q100.jpg_.webp'
					},
					{
						'clickUrl' : '#',
						'desc' : '第二张图',
						'image' : 'https://aecpm.alicdn.com/tfscom/TB1RVmXzxn1gK0jSZKPXXXvUXXa.jpg'
					},
					{
						'clickUrl' : '#',
						'desc' : '第三张图',
						'image' : 'https://img.alicdn.com/tps/i4/TB1YSQPyQT2gK0jSZPcSuwKkpXa.jpg'
					},
					{
						'clickUrl' : '#',
						'desc' : '第四张图',
						'image' : 'https://img.alicdn.com/simba/img/TB1DO9wwYj1gK0jSZFOSuw7GpXa.jpg'
					},
					{
						'clickUrl' : '#',
						'desc' : '第五张图',
						'image' : 'http://img.alicdn.com/imgextra/i4/593040/O1CN01ilvBit1YKMdEoCEaC_!!593040-0-lubanu.jpg_q100.jpg_.webp'
					}
				],
				currentIndex:0,
				timer: ''
			}
		},
		methods:{
			// 开始
			 go() {
                this.timer = setInterval(() => {
                    this.autoPlay()
                }, 3000)
            },
            //停止
            stop() {
                clearInterval(this.timer)
                this.timer = null
            },
            //改变
            change(index) {
                this.currentIndex = index
            },
            //自动
            autoPlay() {
                this.currentIndex++
                if (this.currentIndex > this.slideList.length - 1) {
                    this.currentIndex = 0
                }
            }
		},
		created() {
			//异步处理
         this.$nextTick(() => {
           this.timer = setInterval(() => {
             this.autoPlay()
           }, 3000)
         })
       }
	}
</script>

<style>
 .carousel-wrap {
   height: 453px;
   width: 100%;
   overflow: hidden;
   background-color: #fff;
   border-radius: 10px;
}

.slide-ul {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-ul li {
  position: absolute;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
}

.carousel-items {
  position: absolute;
  z-index: 10;
  top: 380px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-size: 0;
}

.carousel-items span {
  display: inline-block;
  height: 6px;
  width: 30px;
  margin: 0 3px;
  background-color: #b2b2b2;
  cursor: pointer;
}
.carousel-items .active {
  background-color: orange;
}

.list-enter-to {
  transition: all 1s ease;
  transform: translateX(0);
}

.list-leave-active {
  transition: all 1s ease;
  transform: translateX(-100%)
}

.list-enter {
  transform: translateX(100%)
}

.list-leave {
  transform: translateX(0)
}
</style>
