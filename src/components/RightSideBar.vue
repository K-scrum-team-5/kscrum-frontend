<template>
  <aside class="right-sidebar" :class="{ 'dark-mode': isDarkMode, 'genre-right-sidebar' : $route.name === 'genre_profile' || $route.name === 'explore' || $route.name === 'Search' }">
    <p style="font-size: 27px; margin-bottom: 20px">Bookmark List</p>
    <ul>
      <li style="font-size: 15px" v-for="movie in likedMovies" :key="movie.id" @click="openModal(movie.id)">
        {{ movie.original_title }}
      </li>
    </ul>
    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': isDarkMode }">

          <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
            <img v-if="selectedMovie" :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path">
          <div class="modal-info" :class="{ 'dark-mode': isDarkMode }">
            <h3 class="modal-title">{{ selectedMovie?.title }}</h3>
            <p><strong>장르:  </strong>{{ selectedMovie?.genreString }}</p>
            <p class="overview"><strong>개요</strong><br>{{ selectedMovie?.overview }}</p>
            <p><strong>평점: </strong> {{ selectedMovie?.voteAverage }}  </p>
            <p><strong>개봉일: </strong> {{ selectedMovie?.release_date }}</p>
            <p><strong>러닝타임: </strong> {{ selectedMovie?.runtime }}분</p>
            <button @click="deleteLikedMovie(selectedMovie)">나중에 볼 영화 해제</button>
          </div>
        </div>

    </div>
  </aside>
</template>

<script>
import axios from 'axios';
import '@/styles/rightsidebar.css';
import '@/styles/sidebarstyle.css';
import '@/styles/modal.css';
export default {
  props: ['initialLikedMovies'],

  data() {
    return {
      likedMovies: this.initialLikedMovies,
      showModal: false,
      selectedMovie: null,
      pollingInterval: null,
    };
  },

  computed: {
    isDarkMode() {
      return this.$root.isDarkMode;
    },
  },

  mounted() {
    this.startPolling();
  },

  beforeUnmount() {
    this.stopPolling();
  },
  
  methods: {
    fetchLikedMovies() {
      axios.get('http://49.50.174.94:8080/api/movie/mark')
        .then(response => {
          this.likedMovies = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchLikedMovies();
      }, 1000);
    },
    stopPolling() {
      clearInterval(this.pollingInterval);
    },

    fetchMovieInfo(id) {
      const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(
          id
      )}`;
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
    async deleteLikedMovie(movie) {
      console.log('deleteLikedMovie:', movie.id)
      try {
        await axios.delete(`http://49.50.174.94:8080/api/movie/mark/${movie.id}?movieId=${movie.id}`);
        this.likedMovies = this.likedMovies.filter(m => m.id !== movie.id);
        this.closeModal();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>

</style>