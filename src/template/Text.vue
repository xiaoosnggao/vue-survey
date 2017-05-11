<template>
  <div class="gxs-form-controller">
    <!-- 文本输入框 -->
    <div class="gxs-form-controller-text">
      <label v-if="info.before">{{info.before}}:</label>
      <div class="gxs-form-input">
        <input type="text" v-if="info.type=='text'" class="gxs-input" v-model="info.value">
        <input type="number" v-if="info.type=='number'" class="gxs-input" v-model="info.value">
      </div>
      <label v-if="info.before">{{info.after}}</label>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {}
    },
    props: ['info'],
    methods: {
      getType (item) {
        return item.type
      }
    }
  }
</script>
