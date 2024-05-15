<template>
    <fluid no-gutters class="init-movie-container">
      <div class="init-movie">
        <h1>영화 초기 선택</h1>
        <p>평소 취향의 영화를 선택하십시오</p>
      </div>

      <div class="fix-poster">
        <v-card 
          v-for="(movie, index) in recentSelectedMovies" 
          :key="movie.title" 
          :style="{ left: `${index * 30}px` }"
          class="stack-poster"
        >
          <v-img
            :src="movie.posterUrl"
            aspect-ratio="0.66"
            contain
            width="80px"
          >
          </v-img>
        </v-card>
      </div>

      <div v-for="genre in genres" :key="genre.name">
        <v-row>
          <v-col class="genre-rowcol">
            <h2>{{ genre.name }}
              <v-btn @click="get_genre_random(genre)"> 초기화 </v-btn>
            </h2>
          </v-col>
        </v-row>

        <v-row class="poster-row" justify="center">
          <v-col v-for="movie in genre.random_movies" :key="movie.title" cols="6" md="2">
            <v-card 
              @click="toggleSelection(movie)" 
              :class="isMovieSelected(movie) ? 'selected' : ''"
              >
              <v-img 
                :src="movie.posterUrl" 
                aspect-ratio="0.66"
                contain
                class="centered-img"
              />
              <v-card-title>{{ movie.title }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col class="button-col">
          <v-btn 
            @click="goToMovieFeed" 
            color="gray"
            block
            large  
            class="complete-btn"
          >
            완 료
          </v-btn>
        </v-col>
      </v-row>
    </fluid>
  </template>
  
  <script>
  import { genres } from '@/data/genres';
  import router from '@/router/index';
  //import { useRouter, useRoute } from 'vue-router';
  export default {
    name: 'Init_movie',
    data() {
        return {
            genres,
            selectedMovies: [],
            selectedPosterUrl: ''
        };
    },
    computed: {
      recentSelectedMovies() {
        return this.selectedMovies.slice(-3);
      },
    },
    /*
    setup(){
      console.log('App setup');
        const router = useRouter(); 
        const route = useRoute(); 
        const goToMovieFeed = () => {
        console.log("button clicked(/)");
        router.push('/');
      };
      const isChoiceRoute = computed(() => route.path === '/');
      return {
       goToMovieFeed, //이벤트 연결
       isChoiceRoute,
      };
    },
    */
    methods: {
      toggleSelection(movie) {
        const index = this.selectedMovies.findIndex(m => m.title === movie.title);
        if (index === -1) {
        // 선택되지 않았다면 추가
          this.selectedMovies.push(movie);
          this.selectedPosterUrl = movie.posterUrl;
        } else {
        // 선택되었다면 제거
          this.selectedMovies.splice(index, 1);
        }
      },
      isMovieSelected(movie) {
        return this.selectedMovies.some(m => m === movie); // 선택 여부 확인
      },
      goToMovieFeed() {
        if (router) {
          router.push({ path: '/' });
          console.log("button clicked(/)");
        } else {
          console.error("Router instance is undefined"); 
        }
      },
      get_random() {
        this.genres.forEach(genre => {
          const genremovies_num = genre.movies.length;
          const movie_num = Math.min(genremovies_num, 4);
          const random_movies = [];
          const randomIdx = this.random([...Array(genremovies_num).keys()]);
          for(let i = 0; i<movie_num; i++){
            random_movies.push(genre.movies[randomIdx[i]]);
          }
          genre.random_movies = random_movies;
        });
      },
      get_genre_random(genre) {
        const genremovies_num = genre.movies.length;
        const movie_num = Math.min(genremovies_num, 4);
        const random_movies = [];
        const randomIdx = this.random([...Array(genremovies_num).keys()]);
        for(let i = 0; i<movie_num; i++){
          random_movies.push(genre.movies[randomIdx[i]]);
        }
        genre.random_movies = random_movies;
      },
      random(array){ //Fisher-Yates shuffle
        for(let i = array.length-1; i>0; i--){
          const j = Math.floor(Math.random()*(i+1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      },
    },
    mounted() {
      this.get_random();
    },
  };
  </script>
  
  <style lang="scss">
  .body {
    margin: 0;
  }
 .init-movie {
    color: gray; 
    background-color: white; 
    text-align: center;
    padding: 10px;
  }
  .v-img {
    width: 100%;
    height: auto; 
  }
  .centered-img {
    display: block;
    margin: auto;
  }
  .v-card {
    position: relative;
    text-align: center;
  }
  .fix-poster {
    position: fixed;
    top: 20px; 
    left: 20px; 
    z-index: 1000;
  }
  .stack-poster {
    position: absolute; 
    z-index: 10;
  }
  @media (max-width: 960px) {
    .genre-rowcol {
      width: 50%; //좁은 화면
      padding-left: 70px;
      padding-right: 70px;
      margin-top: 60px;
    }
  }
  @media (min-width: 961px) {
    .genre-rowcol {
      width: 25%; //넓은 화면
      padding-left: 200px;
      padding-right: 70px;
      margin-top: 60px;
    }
  }
  .poster-row {
    padding-left: 70px;
    padding-right: 70px;
  }
  .selected::after { 
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .complete-btn {
    cursor: pointer;
    display: block;
    text-align: center;
    padding: 10px; 
  }
  .button-col {
    padding-left: 80px;
    padding-right: 80px;
    padding-top: 60px;
  }
  </style>
