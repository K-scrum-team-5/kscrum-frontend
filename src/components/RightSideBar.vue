<template>
  <aside class="right-sidebar" :class="{ 'dark-mode': isDarkMode }">
    <h3>Bookmark List</h3>
    <ul>
      <li v-for="movie in likedMovies" :key="movie.id" @click="openModal(movie)">
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