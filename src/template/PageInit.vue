<template>
  <div class="gxs-survey-init" v-if="pageInitData">
    <p v-for="text in pageInitData">
      {{text}}
    </p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        selectText: ''
      }
    },
    props: ['pageInitData']
  }
</script>

