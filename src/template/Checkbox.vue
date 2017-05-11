<template>
  <div class="gxs-form-controller">

    <!-- 多选框 -->
    <label :for="info.name + '-' + index" v-for="(item, index) in info.choices" class="gxs-label">
      <input type="checkbox" :id="info.name + '-' + index" class="gxs-check" v-model="info.value" :value="item" :name="info.name">

      <!-- 美化input radio -->
      <SelectIcon :index="index"></SelectIcon>

      <span>{{item}}</span>
    </label>

  </div>
</template>
<script type="text/ecmascript-6">
  import SelectIcon from './SelectIcon'

  export default{
    data () {
      return {
        selectText: ''
      }
    },
    props: ['info'],
    components: {
      SelectIcon
    }
  }
</script>
