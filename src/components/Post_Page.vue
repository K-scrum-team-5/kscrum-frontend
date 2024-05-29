<template>
  <div class="post" :class="{ 'dark-mode': $root.isDarkMode }">
    <div class="post-body">
      <img :src="movies.url" alt="Post Image" @click="openModal(movies.id)">
    </div>
    <div class="post-content">
  <div class="buttons">
    <LikeButton :isLiked="movies.liked" :movieId="movies.id"/>
    <button @click="toggleLike(movies)" class="bookmark-btn">
      <i :class="isLiked ? 'fas fa-star' : 'far fa-star'"></i>
      {{ isLiked ? '북마크 취소' : '북마크' }}
    </button>
  </div>
  <p class="textover"><strong style="font-size: 18px;">{{ movies.original_title }}</strong></p>
  <p class="date">{{ movies.id }}</p>
</div>

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
      <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
        <img :src="movies.url" alt="Post Image">
        <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
          <h3 class="modal-title">{{ selectedMovie?.title }}</h3>
          <p><strong>장르:  </strong>{{ selectedMovie?.genreString }}</p>
          <p class="overview"><strong>개요</strong><br>{{ selectedMovie?.overview }}</p>
          <p><strong>평점: </strong> {{ selectedMovie?.voteAverage }}  </p>
          <p><strong>개봉일: </strong> {{ selectedMovie?.release_date }}</p>
          <p><strong>러닝타임: </strong> {{ selectedMovie?.runtime }}분</p>
          <button @click="toggleLike(movies)">
            {{ isLiked ? 'Delete from Bookmark' : 'Add to Bookmark' }}
          </button>
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
  components : {
    LikeButton,
  },
  props: {
    movies: Object,
  },
  data() {
    return {
      selectedMovie: null,
      showModal: false,
      isLiked: false,
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
  },
};
</script>

<style scoped>


.post {
  width: 100%;
}


@media (max-width: 740px) {
  .post {
    width: 80%;
    margin: 0 auto;
  }
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
  display: flex;
  align-items: center;
  margin-top: 1px;
  margin-bottom: 1px;
}

.bookmark-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.bookmark-btn i {
  margin-right: 8px;
  font-size: 20px;
}

.bookmark-btn .fas.fa-star {
  color: gold;
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
.modal-info .modal-title {
  font-size: 28px; /* 제목 글자 크기 조정 */
  font-weight: bold;
  margin-bottom: 10px;
}

</style>