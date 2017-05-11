<template>
  <div class="gxs-form-controller">
    <!-- 单选框 -->
    <div class="new-label" v-if="info.choices.length <= 2">
      <label :for="info.name + '-' + index" v-for="(item, index) in info.choices" class="gxs-label">
        <input type="radio" :id="info.name + '-' + index" class="gxs-check" v-model="info.value" :value="item" :name="info.name">
        <!-- 美化input radio -->
        <i class="gxs-icon">{{item}}</i>
      </label>
    </div>
    <div class="all-label" v-if="info.choices.length > 2">
      <label :for="info.name + '-' + index" v-for="(item, index) in info.choices" class="gxs-label">
        <input type="radio" :id="info.name + '-' + index" class="gxs-check" v-model="info.value" :value="item" :name="info.name">
        <!-- 美化input radio -->
        <i class="gxs-icon"></i>{{item}}
      </label>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        selectText: ''
      }
    },
    props: ['info'],
    components: {},
    methods: {
      newClass () {
        if (this.info.choices.length > 2) {
          return 'new-label'
        }
      }
    }
  }
</script>
