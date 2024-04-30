<template>
    <v-container fluid no-gutters>
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

      <div v-for="genre in genres" :key="genre.name" class="genre-col">
        <v-row class="genre-rowcol">
          <v-col>
            <h2>{{ genre.name }}</h2>
          </v-col>
        </v-row>

        <v-row class="poster-row" justify="center">
          <v-col v-for="movie in genre.movies" :key="movie.title" cols="6" md="2">
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
            @click="completeSelection" 
            color="gray"
            block
            large  
            class="complete-btn"
          >
            완 료
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { genres } from '@/data/genres';
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
      completeSelection() {
        console.log("Selection completed:", this.selectedMovies); // 완료 이벤트 처리
      },
    },
  };
  </script>
  
  <style scoped>
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
  .genre-rowcol {
    padding-left: 70px;
    padding-right: 70px;
    margin-bottom: 50px;
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
    display: block;
    text-align: center;
    padding: 10px; 
  }
  .button-col {
    padding-left: 80px;
    padding-right: 80px;
  }
  </style>
