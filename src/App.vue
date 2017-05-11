<template>
  <div class="gxs-survey gxs-vh">
    <div class="gxs-survey-title">
      <h3>{{surveyData.title}}</h3>
    </div>
    <div class="gxs-survey-body">
      <!--<transition-group name="custom-classes-transition" :enter-active-class="animatedIn" :leave-active-class="animatedOut">-->
      <div class="gxs-survey-box" v-for="(item, eq) in surveyData.pages" v-show="eq==surveyData.index" :key="eq">
        <h4 class="gxs-survey-box-title"><img src="./assets/images/icon-title.png" alt="">{{surveyData.index+1}}.{{item.title}}</h4>
        <div class="gxs-form" :class="error ? 'gxs-form-error' : '' ">
          <Checkbox :info="item" v-if="item.type == 'checkbox'"></Checkbox>
          <RadioBox :info="item" v-if="item.type == 'radio'"></RadioBox>
          <TextBox :info="item" v-else-if="item.type == 'text'||item.type == 'number'"></TextBox>
          <TextRadio :info="item" v-else-if="item.type == 'TextRadio'"></TextRadio>
        </div>
        <!-- 显示默认提示 -->
        <PageInit :pageInitData="item.pageInit"></PageInit>
        <!-- 选择后指定出现的提示 -->
        <SurveyWarning :info="item.inputHint" v-if="isSHow[eq]"></SurveyWarning>
        <transition name="custom-classes-transition" enter-active-class="animated fast fadeIn" leave-active-class="animated fast fadeOut">
          <div class="gxs-survey-box-error" v-if="error">{{error}}</div>
        </transition>
      </div>
      <!--</transition-group>-->
    </div>
    <div class="gxs-survey-footer">
      <div type="button" class="prev" @click="prev()" v-show="isPrev">上一页</div>
      <div class="gxs-progress"><span>{{surveyData.index+1}}</span> / {{surveyData.pages.length}}</div>
      <div type="button" class="next" @click="next()" v-show="isNext">下一页</div>
      <div type="button" class="complete" @click="complete()" v-show="isComplete">完成</div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  import RadioBox from './template/Radio'
  import Checkbox from './template/Checkbox'
  import TextBox from './template/Text'
  import TextRadio from './template/TextRadio'
  import PageInit from './template/PageInit'
  import SurveyWarning from './template/SurveyWarning'
  import {mapState, mapMutations} from 'vuex'

  export default{
    data () {
      return {
        isComplete: false,
        isPrev: false,
        isNext: true,
        error: '',
        animatedIn: 'animated fast fadeInRight',
        animatedOut: 'animated fast fadeOutLeft',
        completeData: {},
        isSHow: [],
        risk: '',
        base: ''
      }
    },
    components: {
      RadioBox, TextBox, TextRadio, Checkbox, PageInit, SurveyWarning
    },
    computed: {
      ...mapState([
        'user', 'surveyData', 'codes'
      ]),
      ...mapMutations([
        'getUser', 'getQuery'
      ])
    },
    methods: {
      next () {
        this.animatedIn = 'animated fast fadeInRight'
        this.animatedOut = 'animated fast fadeOutLeft'
        if (this.validation()) {
          this.surveyData.index >= this.surveyData.pages.length - 1 ? this.surveyData.index = this.surveyData.pages.length : this.surveyData.index++
        }
      },
      prev () {
        this.animatedIn = 'animated fast fadeInLeft'
        this.animatedOut = 'animated fast fadeOutRight'
        if (this.surveyData.index <= 0) {
          this.surveyData.index = 0
          this.isPrev = false
        } else {
          this.surveyData.index--
        }
      },
      complete () {
        if (this.validation()) {
          this.completeData.x3 = 'Chinese'
          this.calculation()
          let $this = this
          this.$ajax({
            method: 'post',
            url: 'http://czgy.mbjyy.net/activity/relapse/saveCalcResult',
            data: {
              openId: $this.user,
              baseFive: $this.base.five,
              baseTen: $this.base.ten,
              riskFive: $this.risk.five,
              riskTen: $this.risk.ten,
              answerResultMap: {complete: $this.completeData, isSHow: $this.isSHow}
            }
          }).then(function (res) {
            if (res.data.code === 0) {
              $this.$router.push({path: '/results'})
            } else {
              window.alert(res.data.message)
            }
          }).catch(function (err) {
            window.alert('提交失败' + ',' + err)
          })
        }
      },
      validation () {
        let isText = null
        let surveysIndex = this.surveyData.pages[this.surveyData.index]
        let surveysIndexs = surveysIndex.index
        if (this.surveyData.pages[this.surveyData.index].type === 'TextRadio') {
          let ary = 0
          for (let i = 0; i < surveysIndex.choices.length; i++) {
            if (surveysIndex.choices[i].value.length > 0) {
              ary++
              if (ary >= surveysIndex.choices.length) {
                if (surveysIndex.name === 'SBP') {
                  isText = surveysIndex.choices[0].value
                  if (isText > 250) {
                    this.error = '血压值最大为250'
                    return false
                  }
                  if (isText < 90) {
                    this.error = '血压值最小为90'
                    return false
                  }
                  if (isText >= 140) {
                    this.$set(this.isSHow, this.surveyData.index, true)
                  } else {
                    this.$set(this.isSHow, this.surveyData.index, false)
                  }
                  if (surveysIndex.choices[0].value === '我不知道' || surveysIndex.choices[0].value === '我不知道') {
                    isText = 120
                  }
                } else if (surveysIndex.name === 'HEIGHTWEIGHT') {
                  if (surveysIndex.choices[0].value === '我不知道' || surveysIndex.choices[1].value === '我不知道') {
                    isText = 22.84
                  } else {
                    isText = surveysIndex.choices[1].value / Math.pow(surveysIndex.choices[0].value / 100, 2)
                  }
                  if (isText >= 24) {
                    this.$set(this.isSHow, this.surveyData.index, true)
                  } else {
                    this.$set(this.isSHow, this.surveyData.index, false)
                  }
                } else {
                  isText = surveysIndex.choices[i].value
                }

                this.$set(this.completeData, surveysIndexs, isText)
                this.error = ''
                return true
              }
            } else {
              this.error = '请填写或选择此项'
              return false
            }
          }
        } else {
          if (surveysIndex.value.length > 0) {
            if (surveysIndex.inputHint) {
              if (surveysIndex.value instanceof Array) {
                isText = surveysIndex.value[0]
              } else {
                isText = surveysIndex.value
              }
              for (let y = 0; y < surveysIndex.inputHint.choices.length; y++) {
                if (isText === surveysIndex.inputHint.choices[y]) {
                  this.$set(this.isSHow, this.surveyData.index, true)
                  break
                } else {
                  this.$set(this.isSHow, this.surveyData.index, false)
                }
              }
            } else {
              isText = surveysIndex.value
              this.$set(this.isSHow, this.surveyData.index, false)
            }
            if (isText === '是' || isText === '是的，一年前' || isText === '是的，一年内') {
              isText = 'y'
            } else if (isText === '否' || isText === '没有') {
              isText = 'n'
            } else if (isText === '男') {
              isText = 'm'
            } else if (isText === '女') {
              isText = 'f'
            }
            this.$set(this.completeData, surveysIndexs, isText)
            this.error = ''
            return true
          } else {
            if (surveysIndex.inputHint) {
              this.$set(this.isSHow, this.surveyData.index, false)
            }
            if (surveysIndex.type === 'radio') {
              this.error = '请选择此项'
            } else if (surveysIndex.type === 'checkbox') {
              this.error = '请选择此项'
            } else {
              this.error = '请填写此项'
            }
            return false
          }
        }
      },
      calculation () {
        let base = {}
        let risk = {}
        let e = 2.71828182845904523536
        let age, sex, race, bmi, cigs, drink, diet, activity, stress, familys, sbp, hyprx, dm, cvd, lvh, af, cognitive, poorMemory, injury, miniStroke
        age = this.completeData.x1
        if (this.completeData.x2 === 'm') {
          sex = 1
        } else {
          sex = 0
        }
        race = this.completeData.x3
        bmi = this.completeData.x4
        if (this.completeData.x5 === 'y') {
          cigs = 1
        } else if (this.completeData.x5 === 'n') {
          cigs = 0
        }
        if (this.completeData.x6 === 'y') {
          drink = 1
        } else if (this.completeData.x6 === 'n') {
          drink = 0
        }
        if (this.completeData.x7 === 'y') {
          diet = 0
        } else if (this.completeData.x7 === 'n') {
          diet = 1
        }
        if (this.completeData.x8 === 'y') {
          activity = 0
        } else if (this.completeData.x8 === 'n') {
          activity = 1
        }
        if (this.completeData.x9 === 'y') {
          stress = 1
        } else if (this.completeData.x9 === 'n') {
          stress = 0
        }
        if (this.completeData.x10 === 'y') {
          familys = 1
        } else if (this.completeData.x10 === 'n') {
          familys = 0
        }
        if (this.completeData.x11 <= 119) {
          sbp = 119
        } else {
          sbp = this.completeData.x11
        }
        if (this.completeData.x12 === 'y') {
          hyprx = 1
        } else if (this.completeData.x12 === 'n') {
          hyprx = 0
        }
        if (this.completeData.x13 === 'y') {
          dm = 1
        } else if (this.completeData.x13 === 'n') {
          dm = 0
        }
        if (this.completeData.x14 === 'y') {
          cvd = 1
        } else if (this.completeData.x14 === 'n') {
          cvd = 0
        }
        if (this.completeData.x15 === 'y') {
          lvh = 1
        } else if (this.completeData.x15 === 'n') {
          lvh = 0
        }
        if (this.completeData.x16 === 'y') {
          af = 1
        } else if (this.completeData.x16 === 'n') {
          af = 0
        }
        if (this.completeData.x17 === 'y') {
          cognitive = 1
        } else if (this.completeData.x17 === 'n') {
          cognitive = 0
        }
        if (this.completeData.x18 === 'y') {
          poorMemory = 1
        } else if (this.completeData.x18 === 'n') {
          poorMemory = 0
        }
        if (this.completeData.x19 === 'y') {
          injury = 1
        } else if (this.completeData.x19 === 'n') {
          injury = 0
        }
        if (this.completeData.x20 === 'y') {
          miniStroke = 1
        } else if (this.completeData.x20 === 'n') {
          miniStroke = 0
        }
        let ceAge,
          cesbp,
          cehyprx,
          cedm,
          ceCigs,
          ceCvd,
          ceAf,
          ceLvh,
          ceInter
        if (sex === 1) {
          ceAge = 0.0505
          cesbp = 0.0140
          cehyprx = 0.3263
          cedm = 0.1060
          ceCigs = 0.5147
          ceCvd = 0.5195
          ceAf = 0.6061
          ceLvh = 0.8415
        } else {
          ceAge = 0.0657
          cesbp = 0.0197
          cehyprx = 2.5432
          ceInter = 0.0134
          cedm = 0.5442
          ceCigs = 0.5294
          ceCvd = 0.4326
          ceAf = 1.1497
          ceLvh = 0.8488
        }
        let d33, dbmi, rrBmi
        if (race === 'white') {
          d33 = 0
        } else {
          d33 = 1
        }

        let Chinese = 'Chinese'
        let Indian = 'Indian'
        let Japanese = 'Japanese'
        let Malay = 'Malay/Indonesian/other South East Asian'

        if (race === Chinese.toLowerCase()) {
          dbmi = bmi - 24
        } else if (race === Indian.toLowerCase() | race === Japanese.toLowerCase() | race === Malay.toLowerCase()) {
          dbmi = bmi - 23
        } else {
          dbmi = bmi - 25.0
        }

        if (dbmi < 0) {
          rrBmi = 0
        } else {
          rrBmi = 0.02 * (1 + dbmi)
        }

        let L, M, baseL
        if (sex === 1) {
          L = (age * ceAge) +
            (sbp * cesbp) +
            (hyprx * cehyprx) +
            (dm * cedm) +
            (cigs * ceCigs) +
            (cvd * ceCvd) +
            (af * ceAf) +
            (lvh * ceLvh)

          baseL = (age * ceAge) + (119 * cesbp)

          M = 5.6770
          risk.five = 100 * (1 - Math.pow(0.9642, Math.pow(e, (L - M))))
          risk.ten = 100 * (1 - Math.pow(0.9044, Math.pow(e, (L - M))))

          base.five = 100 * (1 - Math.pow(0.9642, Math.pow(e, (baseL - M))))
          base.ten = 100 * (1 - Math.pow(0.9044, Math.pow(e, (baseL - M))))
        } else if (sex === 0) {
          L = (age * ceAge) +
            (sbp * cesbp) +
            (hyprx * (cehyprx - ceInter * sbp)) +
            (dm * cedm) +
            (cigs * ceCigs) +
            (cvd * ceCvd) +
            (af * ceAf) +
            (lvh * ceLvh)

          baseL = (age * ceAge) + (119 * cesbp)

          M = 7.5766

          risk.five = 100 * (1 - Math.pow(0.9741, Math.pow(e, (L - M))))
          risk.ten = 100 * (1 - Math.pow(0.9353, Math.pow(e, (L - M))))

          base.five = 100 * (1 - Math.pow(0.9741, Math.pow(e, (baseL - M))))
          base.ten = 100 * (1 - Math.pow(0.9353, Math.pow(e, (baseL - M))))
        }

        risk.five = risk.five + (rrBmi + 0.2 * d33 + 0.2 * diet + 0.1 * drink + 0.1 * stress + 0.1 * activity + 0.05 * familys)

        if (cognitive === 1) {
          risk.five = 1.8 * risk.five
        } else if (cognitive === 0 & poorMemory === 1) {
          risk.five = 1.4 * risk.five
        }

        if (injury === 1) {
          risk.five = 1.2 * risk.five
        }

        if (miniStroke === 1) {
          risk.five = risk.five + 10
        }

        risk.ten = risk.ten + (rrBmi + 0.2 * d33 + 0.2 * diet + 0.1 * drink + 0.1 * stress + 0.1 * activity + 0.05 * familys)

        if (cognitive === 1) {
          risk.ten = 1.8 * risk.ten
        } else if (cognitive === 0 & poorMemory === 1) {
          risk.ten = 1.4 * risk.ten
        }

        if (injury === 1) {
          risk.ten = 1.2 * risk.ten
        }

        if (miniStroke === 1) {
          risk.ten = risk.ten + 15
        }
        risk.five = risk.five.toFixed(2)
        risk.ten = risk.ten.toFixed(2)
        if (risk.five > 92.989999999999995) {
          risk.five = 92.989999999999995
        }
        if (risk.ten > 92.989999999999995) {
          risk.ten = 92.989999999999995
        }

        base.five = base.five.toFixed(2)
        base.ten = base.ten.toFixed(2)
        this.risk = risk
        this.base = base
      }
    },
    mounted () {
      this.codes = this.$store.commit('getQuery', 'code')
      if (!this.user) {
        this.$store.commit('getUser', this.getRelapseInfo())
      } else {
        this.getRelapseInfo()
      }
      this.$store.state['surveyData'] = {
        title: '算复发',
        index: 0,
        pages: [
          {
            title: '您多大年龄(岁)？',
            type: 'number',
            index: 'x1',
            name: 'AGE',
            choices: ['是', '否'],
            value: '',
            placeholder: '请输入您的年龄',
            before: '年龄',
            after: '岁'
          },
          {
            title: '您的性别？',
            type: 'radio',
            index: 'x2',
            name: 'GENDER',
            choices: ['男', '女'],
            value: ''
          },
          {
            title: '您的身高和体重？',
            index: 'x4',
            type: 'TextRadio',
            name: 'HEIGHTWEIGHT',
            choices: [
              {
                value: '',
                name: 'HEIGHT',
                text: {
                  type: 'number', textPlaceholder: '请输入您的身高', before: '身高', after: '厘米'
                },
                radio: {type: 'radio', choices: '我不知道'}
              }, {
                value: '',
                name: 'WEIGHT',
                text: {type: 'number', textPlaceholder: '请输入您的体重', before: '体重', after: '公斤'},
                radio: {type: 'radio', choices: '我不知道'}
              }
            ],
            inputHint: {
              isShowHint: false,
              title: '身体超重',
              info: '您应在6-12个月内减轻体重5%-10%，腰围控制在男≤90cm，女≤85cm。'
            }
          },
          {
            title: '目前（或曾经）吸烟吗？',
            index: 'x5',
            type: 'radio',
            name: 'H_SMK',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '吸烟',
              info: '吸烟是中风的一个重要危险因素，被动吸烟者中风风险是主动吸烟的2倍。请及时戒烟，不吸烟者应避免被动吸烟。如果即刻戒烟，吸烟导致的中风风险将迅速下降，5年后吸烟带来的中风风险几乎消失',
              choices: ['是']
            }
          },
          {
            title: '您每天饮酒的酒精量会超过10g吗（约相当于1听330毫升啤酒）？',
            index: 'x6',
            type: 'radio',
            name: 'H_DRINK',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '饮酒过度',
              info: '大量饮酒者应减少饮酒或戒酒。轻中度饮酒可能具有一定保护作用，不饮酒者不提倡用少量饮酒方法预防心脑血管疾病。避免酗酒，男性不超过2个标准杯/天，女性不超过1个标准杯/天（1标准杯=12g酒精）。',
              choices: ['是']
            }
          },
          {
            title: '您每天食用水果和蔬菜的种类至少有6种吗？',
            index: 'x7',
            type: 'radio',
            name: 'DIET',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '饮食不均衡',
              info: '每日饮食种类应多样化，使能量和营养的摄入趋于合理；增加蔬菜、水果和低脂奶制品的摄入并减少饱和脂肪的摄入，同时建议多摄入富含坚果类食物的地中海饮食，可能有利于降低中风风险。',
              choices: ['否']
            }
          },
          {
            title: '您每周至少进行2小时30分钟的体育锻炼吗？',
            index: 'x8',
            type: 'radio',
            name: 'activity',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '缺少运动',
              info: '应选择适合自己的体育锻炼来降低中风风险。建议健康成年人从事有氧运动（例如跑步），每周3-4次，每次持续约40分钟，可涉及中度至强度的体力活动。',
              choices: ['否']
            }
          },
          {
            title: '在过去的一年，您是否曾有过巨大的精神或情感压力？',
            index: 'x9',
            type: 'radio',
            name: 'stress',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '压力过大',
              info: '情绪应激与中风等心血管事件密切相关。如果您曾有过巨大的精神和情感压力，希望您保持健康的生活方式，必要时寻求心理健康教育或心理健康疏导。',
              choices: ['是']
            }
          },
          {
            title: '您的母亲/父亲在65岁之前是否有过中风或心脏病发作？',
            index: 'x10',
            type: 'radio',
            name: 'familys',
            choices: ['是', '否'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '家族病史',
              info: '您的直系亲属在65岁前曾有过中风/心脏病发作，您的中风风险会增加3倍。请密切关注血压、血糖、认知能力等指标，必要时向医生寻求专业指导。',
              choices: ['是']
            }
          },
          {
            title: '您的收缩压（血压读书中的高值）是多少？',
            index: 'x11',
            type: 'TextRadio',
            name: 'SBP',
            choices: [
              {
                value: '',
                name: 'TextRadio',
                text: {type: 'number', textPlaceholder: '请输入您的收缩压', after: 'mmHg'},
                radio: {type: 'radio', choices: '我不知道'}
              }
            ],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '血压过高',
              info: '您需要定期就医，按照医师建议强化生活方式干预或药物治疗来控制血压。每日监测血压至少2次，血压平稳后每周监测血压2次，鼓励家庭自测血压。'
            }
          },
          {
            title: '您正在服用降压药吗？',
            index: 'x12',
            type: 'radio',
            name: 'hyprx',
            choices: ['是', '否'],
            value: ''
          },
          {
            title: '您曾被医生诊断为糖尿病吗？',
            index: 'x13',
            type: 'radio',
            name: 'H_DIAB',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '糖尿病',
              info: '糖尿病是中风的独立危险因素，可将中风的风险增加1倍以上。您应改进生活方式，控制饮食，加强体育锻炼。每周自我检测血糖2-4次，并根据医生建议药物治疗。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您曾被医生诊断患有心血管/外周血管疾病吗？',
            index: 'x14',
            type: 'radio',
            name: 'CVD',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            pageInit: ['*心血管疾病如冠心病、心绞痛、心肌梗死、心律失常、心衰等', '*外周血管疾病如颈动脉狭窄、颈部椎动脉狭窄，四肢动脉的狭窄等'],
            inputHint: {
              isShowHint: false,
              title: '心脑血管疾病',
              info: '患有其他类型心脏病（心绞痛，心衰，心脏瓣膜病包括人工瓣膜和先天心脏缺陷）和外周动脉疾病（包括颈动脉狭窄和/或颈部椎动脉狭窄，四肢动脉的狭窄）也有很高的中风风险。不同类型的心衰及心脏缺陷有很多药物和手术治疗的选择。请与您的医生探讨出最好的治疗策略，以降低您的中风风险。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您曾被医生诊断为左心室肥厚吗？',
            index: 'x15',
            type: 'radio',
            name: 'LVH',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '左心室肥厚',
              info: '左室肥厚患者的中风风险将加倍。您应积极找专科医师治疗，医生将会根据您的总体情况及可能存在的其他危险因素制定具体的脑中风预防方案。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您曾被医生诊断为房颤吗？',
            index: 'x16',
            type: 'radio',
            name: 'AF',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '房颤',
              info: '房颤可增加中风风险4-5倍。您应积极找专科医师治疗，医生将会根据您的总体情况及可能存在的其他危险因素制定具体的脑中风预防方案。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您曾被医生告知具有认知问题或患有老年痴呆症吗？',
            index: 'x17',
            type: 'radio',
            name: 'COGNITIVE',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            inputHint: {
              isShowHint: false,
              title: '认知障碍',
              info: '认知障碍或痴呆有可能在以后导致中风。您应积极找专科医师治疗，医生将会根据您的总体情况及可能存在的其他危险因素制定具体的脑中风预防方案。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您或您周围的人认为您记忆力差吗？',
            index: 'x18',
            type: 'radio',
            name: 'POOR_MEMORY',
            choices: ['是', '否'],
            value: ''
          },
          {
            title: '您曾被医生诊断为创伤性脑损伤吗？',
            index: 'x19',
            type: 'radio',
            name: 'INJURY',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            pageInit: ['*创伤性脑损伤多为交通事故、跌倒、坠落等意外而直接或间接作用导致头部致伤'],
            inputHint: {
              isShowHint: false,
              title: '创伤性脑损伤',
              info: '创伤性脑损伤通常涉及不同程度的脑损害，可能导致中风及其他神经系统疾病（例如认知能力下降或痴呆）请密切关注血压、认知能力等指标，必要时向医生寻求专业指导。',
              choices: ['是的，一年前', '是的，一年内']
            }
          },
          {
            title: '您曾被医生诊断为中风或短暂性脑缺血发作（小中风）吗？',
            index: 'x20',
            type: 'radio',
            name: 'MINI_STROKE',
            choices: ['是的，一年前', '是的，一年内', '没有'],
            value: '',
            pageInit: ['*小中风属于短暂性脑缺血，症状主要有短暂性身体某侧肢体麻木或者乏力，短暂性语言不利或找不到正确词语表达，短暂性单眼或双眼视物不清或视物重影，短暂性行走困难或平衡失调，短暂性头晕、头痛。上述症状往往几分钟后就会消失，持续时间最多也不超过24小时'],
            inputHint: {
              isShowHint: false,
              title: '中风病史',
              info: '有中风或缺血性中风病史的患者，一年内再次发生中风几率较高。请做好预防并咨询您的医生以制定降低中风风险的最佳治疗策略。',
              choices: ['是的，一年前', '是的，一年内']
            }
          }
        ]
      }
    },
    watch: {
      'surveyData.pages': {
        handler () {
          this.validation()
        },
        deep: true
      },
      'surveyData.index' () {
        if (this.surveyData.index >= this.surveyData.pages.length - 1) {
          this.isNext = false
          this.isComplete = true
        } else if (this.surveyData.index <= 0) {
          this.isNext = true
          this.isPrev = false
        } else {
          this.isComplete = false
          this.isNext = true
          this.isPrev = true
        }
      }
    }
  }
</script>
