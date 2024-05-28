<template>
  <v-app :class="{ 'dark-mode': isDarkMode }">
    <v-main>
      <v-btn icon @click="BottomSheet" v-if="isMobile" class="btn-mobile" :class="{ 'dark-mode' : $root.isDarkMode }">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-bottom-sheet v-model="bottomSheet" inset hide-overlay>
        <v-container>
          <v-list :class="{ 'dark-mode' : isDarkMode }">
            <v-list-item v-for="(item, index) in menuItems" :key="index" @click="goToPage(item.path)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-container>
      </v-bottom-sheet>

      <template v-if="isExploreRoute">
        <SideBar_Page />
        <ExplorePage ref="explorePage" :likedMovies="likedMovies" @toggle-like="toggleLike" />
        <div class="footer"></div>
        <RightSideBar ref="rightSideBar" :likedMovies="likedMovies" @open-modal="openModal" />
      </template>
      <template v-else-if="isOpenGenre">
        <SideBar_Page />
        <GenreProfile />
        <div class="footer"></div>
        <RightSideBar ref="rightSideBar" :initialLikedMovies="likedMovies" @open-modal="openModal" />
      </template>

      <!-- 검색 페이지 -->
      <template v-else-if="isSearchRoute">
        <SideBar_Page />
        <router-view />
        <RightSideBar ref="rightSideBar" :likedMovies="likedMovies" @open-modal="openModal" />
      </template>

      <template v-else>
        <router-view />
        <template v-if="!isChoiceRoute">
          <div style="display: flex; justify-content: center;">
            <div style="width: 470px;">
              <StoryProfiles @open-genre="openGenre" />
              <SideBar_Page />
              <Container_Page :movies="movies" />
              <InfiniteLoading @infinite="loadMore" ref="infiniteLoading" />
              <div class="footer"></div>
              <RightSideBar ref="rightSideBar" :likedMovies="likedMovies" @open-modal="openModal" />
            </div>
          </div>
        </template>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Container_Page from './components/Container_Page.vue';
import SideBar_Page from './components/SideBar_Page.vue';
import StoryProfiles from './components/StoryProfiles.vue';
import RightSideBar from './components/RightSideBar.vue';
import ExplorePage from './components/Explore.vue';
import InfiniteLoading from 'vue-infinite-loading';
import GenreProfile from './components/GenreProfile';

export default {
  name: 'App',
  data() {
    return {
      movies: [],
      page: 0,
      isDarkMode: false,
      likedMovies: [],
      bottomSheet: false,
      isMobile: window.innerWidth < 971,
      menuItems: [
        { title: 'Home', path: '/' },
        { title: 'Search', path: '/search' },
        { title: 'Explore', path: '/explore' },
        { title: '영화취향설정', path: '/choice' }
      ],
    };
  },

  components: {
    Container_Page,
    SideBar_Page,
    StoryProfiles,
    RightSideBar,
    ExplorePage,
    InfiniteLoading,
    GenreProfile,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const isChoiceRoute = computed(() => route.path === '/choice');
    const isExploreRoute = computed(() => route.path === '/explore');
    const isOpenGenre = computed(() => route.path.startsWith('/genre'));
    const isSearchRoute = computed(() => route.path.startsWith('/search')); //검색 추가
    const openGenre = (genreName) => {
      router.push({ name: 'genre_profile', params: { genreName } });
    };

    return {
      isChoiceRoute,
      openGenre,
      isExploreRoute,
      isOpenGenre,
      isSearchRoute
    };
  },

  mounted() {
    this.fetchMovies();
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    this.isDarkMode = isDarkMode;
    window.addEventListener('resize', this.handle_size);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handle_size);
  },

  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('isDarkMode', this.isDarkMode);
    },
    fetchMovies($state) {
      const url = `http://49.50.174.94:8080/api/movie/posters?page=${this.page}&size=8`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.length) {
            this.movies = [...this.movies, ...response.data];
            this.page++;
            if ($state) {
              $state.loaded();
            }
          } else {
            if ($state) {
              $state.complete();
            }
          }
        })
        .catch((error) => {
          console.error(error);
          if ($state) {
            $state.complete();
          }
        });
    },
    loadMore($state) {
      this.fetchMovies($state);
    },
    openModal(movie) {
      this.$refs.explorePage.openModal(movie.id);
    },
    toggleLike(likedMovie) {
      const index = this.likedMovies.findIndex(movie => movie.id === likedMovie.id);
      if (index !== -1) {
        this.likedMovies.splice(index, 1);
      } else {
        this.likedMovies.push(likedMovie);
      }
      this.$refs.rightSideBar.fetchLikedMovies();
    },
    handle_size() {
      this.isMobile = window.innerWidth < 971;
    },
    BottomSheet() {
      this.bottomSheet = !this.bottomSheet;
    },
    goToPage(path) {
      this.$router.push(path);
    },
  },
};
</script>


<style>
body {
  margin: 0;
}

ul {
  padding: 5px;
  list-style-type: none;

}

.header {
  width: 100%;
  height: 40px;
  background-color: white;
  padding-bottom: 8px;
  position: sticky;
  top: 0;
}

.header-button-left {
  color: skyblue;
  float: left;
  width: 50px;
  padding-left: 20px;
  cursor: pointer;
  margin-top: 10px;
}

.header-button-right {
  color: skyblue;
  float: right;
  width: 50px;
  cursor: pointer;
  margin-top: 10px;
}

.footer {
  width: 100%;
  position: sticky;
  bottom: 0;
  padding-bottom: 10px;
  background-color: white;
}

.footer-button-plus {
  width: 80px;
  margin: auto;
  text-align: center;
  cursor: pointer;
  font-size: 24px;
  padding-top: 12px;
}

.sample-box {
  width: 100%;
  height: 600px;
  background-color: bisque;
}

.inputfile {
  display: none;
}

.input-plus {
  cursor: pointer;
}

.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  margin-right: 250px;
}

.btn-mobile {
  font-size: medium;
  cursor: pointer;
  text-align: center;
  align-self: left;
  padding: 10px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.v-bottom-sheet {
  position: fixed;
  z-index: 9999;
  color: black;
}

.v-container {
  padding-top: 20px;
}

#app {
  box-sizing: border-box;
  font-family: 'consolas';
  margin-top: 60px;
  width: 100%;
  margin: auto;
  position: relative;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
  align-content: center;
}
</style>