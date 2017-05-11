<template>
  <div class="results">
    <div class="results-warp" v-if="isResults">
      <div class="results-header lowRisk" :class="resultsInfo.className">
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
        <button type="button" v-if="isFive" @click="isFiveFn()" class="gxs-btn gxs-btn-default gxs-btn-block">查看十年风险结果</button>
        <button type="button" v-if="!isFive" @click="isFiveFn()" class="gxs-btn gxs-btn-default gxs-btn-block">查看五年风险结果</button>
      </div>
      <div class="gxs-cells-title">引发您患中风疾病的危险因素有：</div>
      <div class="gxs-flex">
        <router-link :to="{ name: 'resultsInfo', params: { id: item.index }}" class="gxs-flex-box" v-for="item in causeData">
          <button type="button">{{item.inputHint.title}}</button>
        </router-link>
      </div>
      <div class="gxs-cells-btn">
        <router-link to="/" type="button" class="gxs-btn gxs-btn-zz gxs-btn-block">重新自测</router-link>
      </div>
    </div>
    <div class="results-warp" v-if="isResultsW">
      <div class="gxs-cells-title gxs-cells-title-hint">您还未进行风险评估，<br>点击开始吧！</div>
      <div class="gxs-cells-btn">
        <router-link to="/" type="button" class="gxs-btn gxs-btn-default gxs-btn-block">开始自测</router-link>
      </div>
    </div>
  </div>
</template>


<script type='text/ecmascript-6'>
  import {mapState, mapMutations} from 'vuex'

  export default{
    data () {
      return {
        isFive: true,
        baseFive: null,
        baseTen: null,
        riskFive: null,
        riskTen: null,
        answerResultMap: null,
        rFive: 0,
        rTen: 0,
        resultsInfo: {},
        causeData: [],
        isResults: false,
        isResultsW: false
      }
    },
    methods: {
      cause () {
        for (let i = 0; i < this.answerResultMap.isSHow.length; i++) {
          if (this.surveyData.pages[i].inputHint !== undefined && this.answerResultMap.isSHow[i] === true && this.answerResultMap.isSHow[i] !== null) {
            this.causeData.push(this.surveyData.pages[i])
          }
        }
      },
      isFiveFn () {
        this.isFive = !this.isFive
      },
      background () {
        let num
        if (this.isFive) {
          num = this.rFive
        } else {
          num = this.rTen
        }
        if (num <= 3.5 && num >= 0) {
          this.resultsInfo.className = 'lowRisk'
          this.resultsInfo.info = '低危人群'
        } else if (num <= 7 && num >= 3.6) {
          this.resultsInfo.className = 'crisis'
          this.resultsInfo.info = '中危人群'
        } else if (num <= 10 && num >= 7.1) {
          this.resultsInfo.className = 'highRisk'
          this.resultsInfo.info = '高危人群'
        } else if (num > 10) {
          this.resultsInfo.className = 'VeryHighRisk'
          this.resultsInfo.info = '极高危人群'
        }
      },
      getRelapseInfo () {
        let _this = this
        _this.$ajax({
          method: 'post',
          url: 'http://czgy.mbjyy.net/activity/relapse/relapseInfo',
          data: {
            openId: _this.user
          }
        }).then((res) => {
          console.log(res.data)
          if (res.data.code === 0) {
            if (res.data.result !== null) {
              _this.isResults = true
              _this.baseFive = res.data.result.baseFive
              _this.baseTen = res.data.result.baseTen
              _this.riskFive = res.data.result.riskFive
              _this.riskTen = res.data.result.riskTen
              _this.answerResultMap = res.data.result.answerResultMap
              _this.rFive = parseInt(_this.riskFive / _this.baseFive)
              _this.rTen = parseInt(_this.riskTen / _this.baseTen)
              _this.cause()
              _this.background()
            } else {
              _this.isResultsW = true
            }
          }
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    computed: {
      ...mapState([
        'user', 'surveyData', 'codes'
      ]),
      ...mapMutations([
        'getUser', 'getQuery'
      ])
    },
    mounted () {
      this.codes = this.$store.commit('getQuery', 'code')
      if (!this.user) {
        this.$store.commit('getUser', this.getRelapseInfo())
      } else {
        this.getRelapseInfo()
      }
    }
  }
</script>


