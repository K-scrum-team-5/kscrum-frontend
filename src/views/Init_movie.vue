<template>
  <v-container fluid no-gutters :class="{ 'dark-mode': $root.isDarkMode }">
    <div class="init-movie" :class="{ 'dark-mode': $root.isDarkMode }">
      <h1>영화 취향 선택</h1>
      <p>평소 취향의 영화를 선택하십시오</p>
    </div>

    <div class="fix-poster">
      <v-card 
        v-for="(movieList, index) in recentSelectedMovies" 
        :key="movieList.original_title" 
        :style="{ left: `${index * 30}px` }"
        class="stack-poster"
      >
        <v-img
          :src="movieList.url"
          aspect-ratio="0.66"
          contain
          width="80px"
        >
        </v-img>
      </v-card>
    </div>

    <div v-for="genre in genres" :key="genre.genre">
      <v-row>
        <v-col class="genre-rowcol">
          <h2>{{ genre.genre }}
            <v-btn @click="refresh(genre.genre)" class="font_size" :class="{ 'dark-mode': $root.isDarkMode }"> 초기화 </v-btn>
          </h2>
        </v-col>
      </v-row>

        <v-row class="poster-row" justify="center">
          <v-col v-for="movie in genre.movieList" :key="movie.original_title" cols="6" md="2">
            <v-card 
              @click="toggleSelection(movie)" 
              :class="isMovieSelected(movie) ? 'selected' : ''"
              >
              <v-img 
                :src="movie.url" 
                aspect-ratio="0.66"
                contain
                class="centered-img"
              />
              <v-card-title class="font_size">{{ movie.original_title }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col class="button-col">
          <v-btn 
            @click="postDatas" 
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
  import axios from 'axios';
  import router from '@/router/index';

  export default {
    name: 'Init_movie',
    data() {
        return {
            genres: [],
            selectedMovies: [],
            selectedPosterUrl: '',
        };
    },

    computed: {
      recentSelectedMovies() {
        return this.selectedMovies.slice(-3);
      },
    },

    methods: {
      toggleSelection(movie) {
        const index = this.selectedMovies.findIndex(m => m.original_title === movie.original_title);
        if (index === -1) {
        // 선택되지 않았다면 추가
          this.selectedMovies.push(movie);
          this.selectedPosterUrl = movie.url;
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
      async refresh(genre_name) {
        try {
          const index = this.genres.findIndex(genre => genre.genre === genre_name);
          if(index !== -1) {
            const config = { base_Url: 'http://49.50.174.94:8080/api/movie/choice/genre?genre='};
            const response = await axios.get(config.base_Url + encodeURIComponent(genre_name));
            this.genres[index] = response.data;
            console.log('refresh: ', genre_name, response.data);
          }
        } catch (error) {
          console.error('Error_refresh:', error);
        }
      },
      async fetchDatas() {
        try {
          const config = { base_Url: 'http://49.50.174.94:8080/api/movie/choice/genre?genre='}
          const genre_name = ['Drama', 'Thriller', 'Action', 'Animation', 'Romance', 'Comedy'];
          const genrePromises = genre_name.map(genre_name =>
            axios.get(config.base_Url + genre_name)
          );
          const response = await Promise.all(genrePromises);
          response.forEach(response => {
            this.genres.push(response.data);
          });
          console.log('fetch Datas');
          console.log('fetch: ', this.genres);
        } catch (error) {
          console.error('Error fetching Datas:', error);
        }
      },
      async postDatas() {
        try {
          const selectedMoviesData = this.selectedMovies.map(movie => movie.id);
          const postData = { movieIds: selectedMoviesData };
          const response = await axios.post('http://49.50.174.94:8080/api/movie/choice', postData);
          
          console.log('POST success', response.data);
          
          this.selectedMovies = [];
          this.selectedPosterUrl = '';

          this.goToMovieFeed();
        } catch (error) {
          console.error('POST error', error);
        }
      },
    },
    
    mounted() { 
      this.fetchDatas();
    },
  };
  </script>
  
  <style lang="scss">
  .body {
    margin: 0;
  }
  .init-movie {
  font-size: medium;
  color: gray;
  background-color: white;
  text-align: center;
  padding: 10px;

  &.dark-mode {
    background-color: #333333;
    color: #cccccc;
  }
}

  .v-btn.dark-mode {
  background-color: #555555;
  color: #ffffff;
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
      font-size: medium;
    }
  }
  @media (min-width: 961px) {
    .genre-rowcol {
      width: 25%; //넓은 화면
      padding-left: 200px;
      padding-right: 70px;
      margin-top: 60px;
      font-size: medium;
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
    font-size: medium;
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
  .font_size {
    font-size: medium; 
  }

  .dark-mode {
  background-color: #333333;
  color: #ffffff;
}

.dark-mode .v-card {
  background-color: #444444;
  color: #ffffff;
}

.dark-mode .v-card-title {
  color: #ffffff;
}

.dark-mode .complete-btn {
  background-color: #555555;
  color: #ffffff;
}
  </style>
