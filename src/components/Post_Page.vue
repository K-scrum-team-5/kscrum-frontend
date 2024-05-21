<template>
  <div class="post" :class="{ 'dark-mode': $root.isDarkMode }">
    <div class="post-body">
      <img :src="movies.url" alt="Post Image" @click="openModal(movies.id)">
    </div>
    <div class="post-content">
      <LikeButton />
      <p class="textover"><strong style="font-size: 18px;">{{ movies.original_title }}</strong></p>
      <p class="date">{{ movies.id }}</p>
    </div>

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
      <div class="modal-content" :class="{ 'dark-mode': $root.isDarkMode }">
        <img :src="movies.url" alt="Post Image">
        <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
        <h3>{{ selectedMovie?.title }}</h3>
        <p>장르{{ selectedMovie?.genreString }}</p>
        <p class="overview">{{ selectedMovie?.overview }}</p>
        <p><strong>평점:</strong> {{ selectedMovie?.voteAverage }}  </p>
        <p><strong>개봉일:</strong> {{ selectedMovie?.release_date }}</p>
        <p><strong>러닝타임:</strong> {{ selectedMovie?.runtime }}분</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/modal.css';
import axios from "axios"; // CSS 파일 임포트
import LikeButton from './LikeButton.vue';
export default {
  components: {
    LikeButton,
  },
  props: {
    movies: Object,
  },
  data() {
    return {
      selectedMovie: null,
      showModal: false,
    };
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
            return response.data;
          });
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showModal = false;
      }
    },
    // toggleLike() {
    //   this.$emit('toggle-like', this.인스타데이터.name);
    // },
  },
};
</script>

<style scoped>
.post {
  width: 100%;
}

.profile {
  background-image: url("https://picsum.photos/100?random=0");
  width: 30px;
  height: 30px;
  background-size: 100%;
  border-radius: 50%;
  float: left;
}

.profile-name {
  display: block;
  float: left;
  padding-left: 10px;
  padding-top: 7px;
  font-size: 14px;
}

.post-body {
  height: auto;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-body img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.post-content {
  padding: 15px;
  font-size: 14px;
}

.buttons {
  margin-top: 10px;
}

.like-btn {
  background-color: transparent;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.date {
  font-size: 11px;
  color: grey;
  margin-top: -8px;
}

.textover {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post.dark-mode {
  border-color: #555555;
}

.modal.dark-mode {
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content.dark-mode {
  background-color: #333333;
}

.modal-info.dark-mode {
  background-color: #444444;
  color: #ffffff;
}

.modal-info.dark-mode .date {
  color: #cccccc;
}
</style>