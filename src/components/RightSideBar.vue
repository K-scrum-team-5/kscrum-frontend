<template>
  <aside class="right-sidebar" :class="{ 'dark-mode': isDarkMode }">
    <h3>LIKE List</h3>
    <ul>
      <li v-for="movie in likedMovies" :key="movie.id" @click="openModal(movie)">
        {{ movie.title }}
      </li>
    </ul>

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': isDarkMode }">
      <div class="modal-content" @click.stop :class="{ 'dark-mode': isDarkMode }">
        <div class="modal-video-info">
          <div class="poster-wrapper">
            <img :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.posterPath" alt="Movie Poster" class="poster-image">
          </div>
          <div class="modal-info" :class="{ 'dark-mode': isDarkMode }">
            <h3>{{ selectedMovie.title }}</h3>
            <p>{{ selectedMovie.overview }}</p>
            <p><strong>Release Date:</strong> {{ selectedMovie.releaseDate }}</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  props: ['likedMovies'],
  data() {
    return {
      showModal: false,
      selectedMovie: null,
    };
  },
  computed: {
    isDarkMode() {
      return this.$root.isDarkMode;
    },
  },
  methods: {
    openModal(movie) {
      this.selectedMovie = movie;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
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