<template>
  <div>
    <Post_Page :movies="movies[i]" v-for="(a, i) in movies" :key="i" @toggle-like="toggleLike" />
  </div>
</template>

<script>
import Post_Page from './Post_Page.vue';

export default {
  components: {
    Post_Page,
  },
  props: {
    movies: Array,
  },
  methods: {
    toggleLike(postName) {
      const post = this.data.find(post => post.name === postName);
      if (post) {
        post.liked = !post.liked;
      }
    },
  },
};
</script>

<style>
.dark-mode {
  background-color: #333333;
  color: #ffffff;
}
</style>