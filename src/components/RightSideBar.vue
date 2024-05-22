<template>
    <aside class="right-sidebar" :class="{ 'dark-mode': isDarkMode }">
      <h3>LIKE List</h3>
        <ul>
            <!-- <li v-for="post in likedPosts" :key="post" style="border: 5px ridge; position: relative;">{{ post }}
                <button style="position: absolute; top: 0; right: 0; background-color: transparent;border: none;">취소</button>
            </li> -->
        </ul>
    </aside>
  </template>
  
  <script>
  import '@/styles/rightsidebar.css';
  import '@/styles/sidebarstyle.css';
  export default {
    computed: {
      likedPosts() {
        return this.$root.$data.인스타데이터.filter(post => post.liked).map(post => post.name);
      },
      isDarkMode() {
        return this.$root.isDarkMode;
      },
    },
  };
  </script>
  <style scoped>

  </style>