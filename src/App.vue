<template>
  <div class="gxs-vh">
    <input type="text" v-model="city" placeholder="请输入城市">
    <input type="text" placeholder="请输入查询公交" v-model="bus">
    <button type="button" v-on:click="search()">查询</button>
    <div class="" v-for="(item,index) in busRoutes">
      <div class="">{{index+1}}</div>
      <div class="">{{item.key_name}}</div>
      <div class="">{{item.terminal_name}} - {{item.front_name}}</div>
      <div class="" v-for="(bus, index) in item.stationdes">
        {{index}}{{bus.name}}
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        city: '北京',
        bus: '476',
        busRoutes: null
      }
    },
    components: {},
    methods: {
      search () {
        this.$http.jsonp('http://op.juhe.cn/189/bus/busline', {
          params: {
            dtype: '',
            city: this.city,
            bus: this.bus,
            key: '4e2c3e04007647aff7d43b8697fe16cc'
          }
        }).then(function (response) {
          console.log(response.data)
          if (response.data.reason === 'success') {
            this.busRoutes = response.data.result
          } else {
            this.busRoutes = '未查询到数据'
          }
        })
      }
    },
    mounted () {

    },
    computed: {},
    watch: {}
  }
</script>

<style>

</style>
