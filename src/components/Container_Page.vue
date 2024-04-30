<template>
  <div>
  <Post_Page :인스타데이터 = "인스타데이터[i]" v-for="(a,i) in 인스타데이터" :key="i"/>
</div>
</template>

<script>
import Post_Page from './Post_Page.vue';

export default {
    components:{
        Post_Page,
    },
    props:{
        인스타데이터 : Array,
    }
}
</script>

<style>

</style>