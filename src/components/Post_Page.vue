<template>
  <div class="post" :class="{ 'dark-mode': $root.isDarkMode }" style="border: 5px ridge">
    <div class="post-body">
      <img :src="movies.url" alt="Post Image" @click="openModal">
    </div>
    <div class="post-content">

      <p class="textover"><strong style="font-size: 18px;">{{ movies.original_title }}</strong></p>
      <p class="date">{{ movies.id }}</p>
    </div>

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
      <div class="modal-content" :class="{ 'dark-mode': $root.isDarkMode }">
        <img :src="movies.url" alt="Post Image">
        <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
          <h3>{{ movies.original_title }}</h3>
          <p class="date">{{ movies.id }}</p>
          <button @click="toggleLike(movies)">
            {{ isLiked ? 'Delete from Bookmark' : 'Add to Bookmark' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    movies: Object,
  },
  data() {
    return {
      showModal: false,
      isLiked: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
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
  height: 450px;
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
  padding-left: 15px;
  padding-right: 15px;
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
  width: 400px;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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