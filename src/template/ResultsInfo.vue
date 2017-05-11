<template>
  <div class="results-info">
    <p class="title">{{title}}</p>
    <p class="info">{{info}}</p>
  </div>
</template>


<script type='text/ecmascript-6'>
  import {mapState} from 'vuex'

  export default{
    data () {
      return {
        title: '',
        info: ''
      }
    },
    methods: {},
    computed: {
      ...mapState([
        'surveyData'
      ])
    },
    mounted () {
      for (let i = 0; i < this.surveyData.pages.length; i++) {
        if (this.surveyData.pages[i].index === this.$route.params.id) {
          this.title = this.surveyData.pages[i].inputHint.title
          this.info = this.surveyData.pages[i].inputHint.info
        }
      }
    }
  }
</script>


