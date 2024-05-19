<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie)">
      </div>
    </div>
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="selectedMovie.url" alt="Post Image">
        <div class="modal-info">
          <h3>{{ selectedMovie.original_title }}</h3>
          <p class="date">{{ selectedMovie.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@/styles/gallery.css'; // CSS 파일 임포트

export default {
  name: 'ExplorePage', // 이름을 여러 단어로 변경
  data() {
    return {
      movies: [],
      loading: false,
      busy: false,
      page: 0,
      showModal: false,
      selectedMovie: null,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    fetchMovies() {
      this.loading = true;
      const url = `http://49.50.174.94:8080/api/movie/posters?page=${this.page}&size=18`;
      axios.get(url)
          .then(response => {
            this.movies = [...this.movies, ...response.data];
            this.loading = false;
            this.busy = false;
            this.page++;
          })
          .catch(error => {
            console.error(error);
            this.loading = false;
            this.busy = false;
          });
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.fetchMovies();
      }, 1000);
    },
    openModal(movie) {
      this.showModal = true;
      this.selectedMovie = movie;
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showModal = false;
      }
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  justify-content: center;
}

.modal-content img {
  width: 50%;
  height: auto;
  object-fit: contain;
}

.modal-info {
  width: 30%;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.modal-info h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-info p {
  font-size: 14px;
  margin-bottom: 10px;
}

.modal-info .date {
  font-size: 12px;
  color: grey;
}
</style>
