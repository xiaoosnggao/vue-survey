import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'


Vue.prototype.$ajax = axios

// 引入静态资源
require('./assets/css/animate.css')
require('./assets/css/style.less')

// 引入组件
import App from './App'
import Results from './template/Results'
import ResultsInfo from './template/ResultsInfo'

Vue.use(VueRouter)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    user: '',
    codes: '',
    type: 'code',
    surveyData: {
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
  mutations: {
    getUser (state, callBank) {
      let _this = this
      axios({
        method: 'post',
        url: 'http://czgy.mbjyy.net/gateway/patient/oauth',
        data: {
          code: state.codes
        }
      }).then((res) => {
        if (res.data.code === 0) {
          state.user = res.data.result.openId
          callBank()
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    getQuery (state, query) {
      query = query.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
      let expr = '[\\?&]' + query + '=([^&#]*)'
      let regex = new RegExp(expr)
      let results = regex.exec(window.location.href)
      if (results !== null) {
        return results[1]
      } else {
        return false
      }
    }
  }
})

const routes = [
  {
    path: '/',
    name: 'index',
    component: App
  },
  {
    path: '/results',
    name: 'results',
    component: Results
  }, {
    path: '/resultsInfo:id',
    name: 'resultsInfo',
    component: ResultsInfo
  },
  {
    path: '*',
    redirect: '/'
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const routerApp = new Vue({
  router, store
}).$mount('#app')
export default routerApp
