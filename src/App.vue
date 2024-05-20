<template>
  <v-app>
    <v-main>
      <template v-if="isExploreRoute">
          <SideBar_Page />
        <ExplorePage />
        <div class="footer"></div>
        <RightSideBar />
      </template>
      <template v-else>
        <router-view/>
        <template v-if="!isChoiceRoute">
          <div style="display: flex; justify-content: center;">
            <div style="width: 470px;">
              <StoryProfiles @open-genre="openGenre" />
              <SideBar_Page/>
              <Container_Page :movies="movies"/>
              <InfiniteLoading @infinite="loadMore" ref="infiniteLoading"/>
              <div class="footer"></div>
              <RightSideBar />
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
//import instaData from './assets/instaData';
import Container_Page from './components/Container_Page.vue';
import SideBar_Page from './components/SideBar_Page.vue';
import StoryProfiles from './components/StoryProfiles.vue';
import RightSideBar from './components/RightSideBar.vue';
import ExplorePage from './components/Explore.vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'App',
  data() {
    return {
      movies: [],
      page: 0, // 페이지 초기화
    };
  },
  components: {
    Container_Page,
    SideBar_Page,
    StoryProfiles,
    RightSideBar,
    ExplorePage,
    InfiniteLoading,
  },
  setup() {
    console.log('App setup');
    const router = useRouter();
    const route = useRoute();

    const isChoiceRoute = computed(() => route.path === '/choice');
    const isExploreRoute = computed(() => route.path === '/explore');
    const openGenre = (genreName) => {
      router.push({ name: 'genre_profile', params: { genreName } });
    };

    return {
      isChoiceRoute,
      openGenre,
      isExploreRoute,

    };
  },
  mounted() {
    console.log('App mounted')
    this.fetchMovies();
  },
  methods: {
    fetchMovies($state) {
      const url = `http://49.50.174.94:8080/api/movie/posters?page=${this.page}&size=8`;
      axios.get(url)
          .then(response => {
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
          .catch(error => {
            console.error(error);
            if ($state) {
              $state.complete();
            }
          });
    },
    loadMore($state) {
      this.fetchMovies($state);
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
.v-btn {
  text-transform: none;
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
