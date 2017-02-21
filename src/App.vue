<template>

</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        data: null,
        defUrl: 'https://free-api.heweather.com/v5', // 统一的api请求地址
        key: '', // 这里输入自己的key，不要直接拿我的
        forecast: null,
        now: null,
        hourly: null,
        suggestion: null,
        basic: null,
        city: null
      }
    },
    mounted () {
      this.$http.get(this.defUrl + '/weather', {// 获取全部数据
        params: {
          city: '北京',
          key: this.key
        }
      }).then(function (response) {
        this.forecast = response.data.HeWeather5[0].daily_forecast // 7-10天预报
        this.now = response.data.HeWeather5[0].now // 实况天气
        this.hourly = response.data.HeWeather5[0].hourly_forecast // 每小时预报（逐小时预报），最长10天
        this.suggestion = response.data.HeWeather5[0].suggestion // 生活指数
        this.basic = response.data.HeWeather5[0].basic
        this.city = response.data.HeWeather5[0].aqi
        this.getImg(this.now.cond.code)
      })
    }
  }
</script>
