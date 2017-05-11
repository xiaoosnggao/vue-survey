<template>
  <div class="gxs-survey-warning">
    <h4 class="gxs-survey-warning-title"><img src="../assets/images/icon-warning.png" alt="">{{info.title}}</h4>
    <p>{{info.info}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        selectText: ''
      }
    },
    props: ['info']
  }
</script>
