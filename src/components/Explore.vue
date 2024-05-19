<template>
  <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie.id)">
      </div>
    </div>
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-video-info">
          <div class="youtube-video-wrapper">
            <iframe
                class="youtube-video"
                :src="trailerUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
          </div>
          <div class="modal-info">
            <img v-if="selectedMovie && !trailerUrl" :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path" alt="Post Image">
            <h3>{{ selectedMovie?.title }}</h3>
            <p>{{ selectedMovie?.overview }}</p>
            <p><strong>Popularity:</strong> {{ selectedMovie?.popularity }}</p>
            <p><strong>Release Date:</strong> {{ selectedMovie?.release_date }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@/styles/gallery.css'; // CSS 파일 임포트

const YOUTUBE_API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY;

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
      trailerUrl: ''
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
    fetchMovieInfo(id) {
      const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(id)}`;
      console.log(url);
      return axios.get(url);
    },
    fetchYouTubeTrailer(title, releaseDate) {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(title + ' ' + releaseDate.split('-')[0])} trailer&key=${YOUTUBE_API_KEY}`;
      return axios.get(url);
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.fetchMovies();
      }, 1000);
    },
    openModal(movieId) {
      this.showModal = true;
      this.trailerUrl = ''; // 모달을 열 때 이전 트레일러 URL 초기화
      this.selectedMovie = null; // 모달을 열 때 이전 선택한 영화 정보 초기화

      this.fetchMovieInfo(movieId)
          .then(response => {
            this.selectedMovie = response.data;
            return this.fetchYouTubeTrailer(this.selectedMovie.title, this.selectedMovie.release_date);
          })
          .then(response => {
            const videoId = response.data.items[0].id.videoId;
            this.trailerUrl = `https://www.youtube.com/embed/${videoId}`;
          })
          .catch(error => {
            console.error('Error:', error);
          });
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
  width: 80%;
  height: auto;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.modal-video-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.youtube-video-wrapper {
  width: 50%;
  padding-bottom: 28%; /* Aspect ratio 16:9 */
  position: relative;
}

.youtube-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-info {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.modal-info img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 20px;
}

.modal-info h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-info p {
  font-size: 16px;
  margin-bottom: 10px;
}

.modal-info .date {
  font-size: 14px;
  color: grey;
}
</style>
