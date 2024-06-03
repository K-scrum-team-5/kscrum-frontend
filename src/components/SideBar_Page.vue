<template>
    <aside class="sidebar" :class="{ 'dark-mode': $root.isDarkMode, 'genre-sidebar' : $route.name === 'genre_profile' || $route.name === 'explore' || $route.name === 'Search' }">
    <div class="logo-container">
      <header class="sidebar-header">
      <v-img class="logo-img"  src="@/assets/moviestagram.png" alt="<Logo>"></v-img>
      <i class="logo-icon uil uil-instagram"></i>
    </header>
  </div>
    <nav>
      <button @click="goToHome">
        <span>
          <i class="uil uil-estate"></i>
          <span>Home</span>
        </span>
      </button>
      <button @click="goToSearch"> <!--검색 추가-->
        <span>
          <i class="uil uil-search"></i>
          <span>Search</span>
        </span>
      </button>
      <button @click="goToExplore"> <!-- Explore 버튼에 클릭 이벤트 추가 -->
        <span>
          <i class="uil uil-compass"></i>
          <span>Explore</span>
        </span>
      </button>
      <button @click="goto_choice">
        <span>
          <i class="uil uil"></i> <!--이 부분 일단 남겨둔거에요-->
          <span>영화취향설정</span>
        </span>
      </button>
      <button @click="toggleDarkMode">
        <span>
          <i class="uil uil-moon"></i>
          <span>다크모드</span>
        </span>
      </button>
      <span>
        <i class="uil uil-bars"></i>
        <span></span>
      </span>
    </nav>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import '@/styles/sidebar.css';
import '@/styles/sidebarstyle.css';
import axios from 'axios';

export default {
  methods: {
    toggleDarkMode() {
      this.$root.toggleDarkMode();
    },

    async resetMovie() {
      const url = `http://49.50.174.94:8080/api/db/reset/prority`;
      try {
        await axios.post(url);
      } catch (error) {
        console.error("Error resetting movie priority:", error);
      }
    },
  },

  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push('/');
    };

    const resetMovie = async () => {
      const url = `http://49.50.174.94:8080/api/db/reset/prority`;
      try {
        await axios.post(url);
      } catch (error) {
        console.error("Error resetting movie priority:", error);
      }
    };

    const goto_choice = async () => {
      console.log("button clicked(/choice)");
      await resetMovie();  // 이 부분에서 resetMovie를 호출합니다.
      router.push('/choice');
    };


    const goToExplore = () => {
      router.push('/explore'); // Explore 페이지로 라우팅
    };

    const goToSearch = () => { //검색 추가
      router.push('/search');
    }
    
    return {
      goToHome,
      goto_choice,
      goToExplore,
      goToSearch
    };
  },
  
};
</script>

<style>


</style>
