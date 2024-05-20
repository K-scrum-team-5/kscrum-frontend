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
  .right-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100%;
    padding: 40px 10px 30px 10px;
    background: #ffffff;
    border-left: 1px solid #dbdbdb;
    transition: 0.3s;
  }
  
  .right-sidebar h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .right-sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .right-sidebar li {
    margin-bottom: 5px;
  }
  
  /* 다크모드 스타일 */
  .right-sidebar.dark-mode {
    background-color: #333333;
    color: #ffffff;
  }
  
  .right-sidebar.dark-mode h3 {
    color: #ffffff;
  }
  </style>