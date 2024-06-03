<template>
    <v-card class="movie-card" :style="{ height: 'auto' }" @click="openModal(movie.id)">
        <v-img :src="movie.url" :alt="movie.original_title" :max-height="cardHeight"></v-img>
        <v-card-title>{{ movie.original_title }}</v-card-title>
    </v-card>
  <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
    <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
      <img :src="movie.url" alt="Post Image">
      <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
        <h3 class="modal-title">{{ selectedMovie?.title }}</h3>
        <p><strong>장르:  </strong>{{ selectedMovie?.genreString }}</p>
        <p class="overview"><strong>개요</strong><br>{{ selectedMovie?.overview }}</p>
        <p><strong>평점: </strong> {{ selectedMovie?.voteAverage }}  </p>
        <p><strong>개봉일: </strong> {{ selectedMovie?.release_date }}</p>
        <p><strong>러닝타임: </strong> {{ selectedMovie?.runtime }}분</p>
        <button @click="toggleLike(selectedMovie)">
          {{ isLiked ? '나중에 볼 영화 삭제' : '나중에 볼 영화 추가' }}
        </button>
      </div>
    </div>
  </div>

</template>
    
    <script>

    //import MovieDetail from '../components/MovieDetail.vue';

    import axios from "axios";

    export default {
    name: 'MovieCard',
    props: {
        movie: {
        type: Object,
        required: true
        }
    },
      data() {
        return {
          isLiked: false,
          selectedMovie: null,
          showModal: false,
        };
      },
    components: {

    },
    computed: {
        cardHeight() {
        return '400px';
        }
    },
    methods: {
      fetchMovieInfo(movieId) {
        const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(movieId)}`;
        return axios.get(url);
      },

      openModal(movieId) {
        this.showModal = true;
        this.selectedMovie = null; // 모달을 열 때 이전 선택한 영화 정보 초기화

        this.fetchMovieInfo(movieId)
            .then(response => {
              this.selectedMovie = response.data;
              this.selectedMovie.id=movieId;
              return response.data;
            });
      },
      closeModal(event) {
        if (event.target === event.currentTarget) {
          this.showModal = false;
        }
      },
      async toggleLike(movie) {
        if (!movie || !movie.id) {
          console.error('유효하지 않은 영화 객체:', movie);
          return;
        }

        const movieId = movie.id;
        const url = `http://49.50.174.94:8080/api/movie/mark/${movieId}?movieId=${movieId}`;

        try {
          if (this.isLiked) {
            await axios.delete(url);
            console.log('좋아요 삭제 완료');
          } else {
            const response = await axios.post(url);
            console.log('좋아요 등록 응답:', response.data);
          }

          this.isLiked = !this.isLiked;

          const likedMovie = {
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            overview: movie.overview,
            releaseDate: movie.release_date,
          };
          this.$emit('toggle-like', likedMovie);
        } catch (error) {
          console.error('좋아요 처리 오류:', error);
        }
      },
    }
    };
    </script>
    
    <style scoped>
    .movie-card {
    cursor: pointer;
    transition: transform 0.2s;
    }
    .movie-card:hover {
    transform: scale(1.05);
    }
    .v-card-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    }
    </style>