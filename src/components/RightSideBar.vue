<template>
  <aside class="right-sidebar" :class="{ 'dark-mode': isDarkMode, 'genre-right-sidebar' : $route.name === 'genre_profile' }">
    <p style="font-size: 27px; margin-bottom: 20px">Bookmark List</p>
    <ul>
      <li style="font-size: 15px" v-for="movie in likedMovies" :key="movie.id" @click="openModal(movie)">
        {{ movie.original_title }}
      </li>
    </ul>
    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': isDarkMode }">
      <div class="modal-content" @click.stop :class="{ 'dark-mode': isDarkMode }">
        <div class="modal-video-info">
          <div class="poster-wrapper">
            <img :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path" alt="Movie Poster"
              class="poster-image">
          </div>
          <div class="modal-info" :class="{ 'dark-mode': isDarkMode }">
            <h3>{{ selectedMovie.original_title }}</h3>
            <p><strong>ID:</strong> {{ selectedMovie.id }}</p>
            <button @click="deleteLikedMovie(selectedMovie)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import axios from 'axios';
import '@/styles/rightsidebar.css';
import '@/styles/sidebarstyle.css';

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
    openModal(movie) {
      this.selectedMovie = movie;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async deleteLikedMovie(movie) {
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