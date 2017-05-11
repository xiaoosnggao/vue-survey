<template>
  <div class="gxs-form-controller">
    <div class="gxs-form-controller-box" v-for="(item, index) in info.choices">
      <!-- 问答区输入框 -->
      <div class="gxs-form-controller-tr">
        <label v-if="item.text.before" class="label-info">{{item.text.before}}:</label>
        <input type="text" v-if="item.text.type=='text'" :id="item.name + '-' + index" class="gxs-input" :name="item.name" v-model="item.value">
        <input type="number" v-if="item.text.type=='number'" :id="item.name + '-' + index" class="gxs-input" :name="item.name" v-model="item.value">
        <label v-if="item.text.after" class="label-info">{{item.text.after}}</label>
      </div>

      <!-- 问答区选择框 -->
      <div class="gxs-form-controller-tr">
        <label :for="item.name + '-radio-' + index" v-if="item.radio.type=='radio'" class="gxs-label">
          <input type="radio" :id="item.name + '-radio-' + index" class="gxs-check" v-model="item.value" :value="item.radio.choices" :name="item.name">
          <!-- 美化input radio -->
          <SelectIcon :index="index"></SelectIcon>
          <span>{{item.radio.choices}}</span>
        </label>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import SelectIcon from './SelectIcon'
  export default{
    data () {
      return {}
    },
    props: ['info'],
    components: {
      SelectIcon
    }
  }
</script>
