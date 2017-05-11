<template>
  <div class="results">
    <div class="results-header" :class="resultsInfo.className">
      <div class="results-eval">
        <p class="results-eval-info">您现在属于中风</p>
        <p class="results-eval-end">{{resultsInfo.info}}</p>
      </div>
      <div class="results-chance">
        <div class="results-chance-data results-chance-stroke">
          <p class="results-chance-title" v-if="isFive">未来五年患中风的几率</p>
          <p class="results-chance-title" v-if="!isFive">未来十年患中风的几率</p>
          <p class="results-chance-num" v-if="isFive"><span>{{riskFive}}</span>%</p>
          <p class="results-chance-num" v-if="!isFive"><span>{{riskTen}}</span>%</p>
        </div>
        <div class="results-chance-data results-chance-multiple">
          <p class="results-chance-title">比同龄同性别健康者高出</p>
          <p class="results-chance-num" v-if="isFive"><span>{{rFive}}</span>倍</p>
          <p class="results-chance-num" v-if="!isFive"><span>{{rTen}}</span>倍</p>
        </div>
      </div>
    </div>
    <div class="gxs-cells-btn">
      <button type="button" v-if="isFive" @click="isFiveFn()" class="gxs-btn gxs-btn-default gxs-btn-block gxs-btn-default-style">查看十年风险结果</button>
      <button type="button" v-if="!isFive" @click="isFiveFn()" class="gxs-btn gxs-btn-default gxs-btn-block gxs-btn-default-style">查看五年风险结果</button>
    </div>
    <div class="gxs-cells-title">引发您患中风疾病的危险因素有：</div>
    <div class="gxs-cells gxs-cells-arrow">
      <router-link :to="{ name: 'resultsInfo', params: { id: item.index }}" class="gxs-cell" v-for="item in causeData">
        <div class="gxs-cell-bd gxs-cell-default">{{item.inputHint.title}}</div>
        <div class="gxs-cell-ft"></div>
      </router-link>
    </div>
    <div class="gxs-cells-btn">
      <button type="button" class="gxs-btn gxs-btn-info gxs-btn-block">确定</button>
    </div>
  </div>
</template>


<script type='text/ecmascript-6'>
  import {mapState} from 'vuex'

  export default{
    data () {
      return {

      }
    },
    computed: {
      ...mapState([
        'user', 'surveyData'
      ])
    },
    mounted () {
      this.$ajax({
        method: 'post',
        url: 'http://139.198.11.46:8080/activity/relapse/relapseInfo',
        data: {
          openId: this.user
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.baseFive = res.data.result.baseFive
          this.baseTen = res.data.result.baseTen
          this.riskFive = res.data.result.riskFive
          this.riskTen = res.data.result.riskTen
          this.answerResultMap = res.data.result.answerResultMap
          this.rFive = parseInt(this.riskFive / this.baseFive)
          this.rTen = parseInt(this.riskTen / this.baseTen)
          this.cause()
          this.background()
        }
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
</script>


