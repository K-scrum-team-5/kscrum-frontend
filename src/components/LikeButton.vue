<template>
  <div style="margin-right: 25px">
    <button @click="toggleLike" class="like-btn">
      <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
      {{ liked ? '좋아요 취소' : '좋아요' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    isLiked: {
      type: Boolean,
      default: false,
    },
    movieId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      liked: this.isLiked,
    };
  },
  methods: {
    toggleLike() {
      if (this.liked) {
        axios.delete(`http://49.50.174.94:8080/api/movie/like/${encodeURIComponent(this.movieId)}`)
            .then(() => {
              this.liked = !this.liked;
            })
            .catch(error => {
              console.error('Error unliking the movie:', error);
            });
      } else {
        axios.post(`http://49.50.174.94:8080/api/movie/like/${encodeURIComponent(this.movieId)}`)
            .then(() => {
              this.liked = !this.liked;
            })
            .catch(error => {
              console.error('Error liking the movie:', error);
            });
      }
    },
  },
  watch: {
    isLiked(newVal) {
      this.liked = newVal;
    },
  },
};

</script>


<style scoped>
.like-btn {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.like-btn i {
  margin-right: 8px;
  font-size: 20px;
}

.like-btn .fas.fa-heart {
  color: red;
}
</style>
