<template>
  <div class="container">
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie.id)">
      </div>
    </div>

    <InfiniteLoading @infinite="loadMore" ref="infiniteLoading"/>

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
    <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
        <div class="modal-video-info">
          <div class="youtube-video-wrapper" v-if="trailerUrl">
            <iframe
                class="youtube-video"
                :src="trailerUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
          </div>
          <div class="poster-wrapper" v-else>
            <img v-if="selectedMovie" :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path" alt="Post Image" class="poster-image">
          </div>
          <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
            <h3>{{ selectedMovie?.title }}</h3>
            <p>{{ selectedMovie?.overview }}</p>
            <p><strong>Popularity:</strong> {{ selectedMovie?.popularity }}</p>
            <p><strong>Release Date:</strong> {{ selectedMovie?.release_date }}</p>
            <p v-if="quotaExceeded" class="error">YouTube API quota exceeded. Showing movie poster instead.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import InfiniteLoading from 'vue-infinite-loading';
import '@/styles/gallery.css'; // CSS 파일 임포트

const YOUTUBE_API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY;

export default {
  name: 'ExplorePage',
  components: {
    InfiniteLoading
  },
  data() {
    return {
      movies: [],
      page: 0,
      showModal: false,
      selectedMovie: null,
      trailerUrl: '',
      quotaExceeded: false
    };
  },
  methods: {
    fetchMovies($state) {
      const url = `http://49.50.174.94:8080/api/movie/posters?page=${this.page}&size=18`;
      axios.get(url)
          .then(response => {
            if (response.data.length) {
              this.movies = [...this.movies, ...response.data];
              this.page++;
              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch(error => {
            console.error(error);
            $state.complete();
          });
    },
    fetchMovieInfo(id) {
      const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(id)}`;
      return axios.get(url);
    },
    fetchYouTubeTrailer(title, releaseDate) {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(title + ' ' + releaseDate.split('-')[0])} trailer&key=${YOUTUBE_API_KEY}`;
      return axios.get(url);
    },
    loadMore($state) {
      this.fetchMovies($state);
    },
    openModal(movieId) {
      this.showModal = true;
      this.trailerUrl = ''; // 모달을 열 때 이전 트레일러 URL 초기화
      this.selectedMovie = null; // 모달을 열 때 이전 선택한 영화 정보 초기화
      this.quotaExceeded = false; // 할당량 초과 메시지 초기화

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
            if (error.response && error.response.data.error.errors[0].reason === 'quotaExceeded') {
              this.quotaExceeded = true;
            } else {
              console.error('Error:', error);
            }
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
  top: 50%;
  left: 50%;
  width: 50%; /* 너비 조정 */
  height: auto;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;

}

.modal-content {
  width: 60%;
  height: 50%;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
}

.modal-video-info {
  display: flex;
  width: 100%;
  justify-content: flex-start; /* 여백 제거 */
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

.poster-wrapper {
  width: 50%; /* 포스터 너비 설정 */
}

.poster-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.modal-info {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  margin-left: 0;
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

.error {
  color: red;
  font-weight: bold;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}

.modal.dark-mode {
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content.dark-mode {
  background-color: #333333;
  color: #ffffff;
}

.modal-info.dark-mode {
  background-color: #444444;
  color: #ffffff;
}

.modal-info.dark-mode .date {
  color: #cccccc;
}

.error {
  color: #ff5555;
}

</style>
