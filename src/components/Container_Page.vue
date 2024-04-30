<template>
 <div>
    <Post_Page :인스타데이터="인스타데이터[i]" v-for="(a, i) in 인스타데이터" :key="i" @toggle-like="toggleLike" />
  </div>
</template>

<script>
import Post_Page from './Post_Page.vue';

export default {
  components: {
    Post_Page,
  },
  props: {
    인스타데이터: Array,
  },
  methods: {
    toggleLike(postName) {
      const post = this.인스타데이터.find(post => post.name === postName);
      if (post) {
        post.liked = !post.liked;
      }
    },
  },
};
</script>

<style>

</style>