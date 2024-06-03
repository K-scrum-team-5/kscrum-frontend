<template>
  <div>
    <button @click="toggleBookmark" class="bookmark-btn">
      <i :class="marked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
      {{ marked ? 'MovieMark cancel' : 'MovieMark' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    isMarked: {
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
      marked: this.isMarked,
    };
  },
  methods: {
    toggleBookmark() {
      if (this.marked) {
        axios.delete(`http://49.50.174.94:8080/api/movie/mark/${encodeURIComponent(this.movieId)}`)
            .then(() => {
              this.marked = !this.marked;
            })
            .catch(error => {
              console.error('Error unmarking the movie:', error);
            });
      } else {
        axios.post(`http://49.50.174.94:8080/api/movie/mark/${encodeURIComponent(this.movieId)}`)
            .then(() => {
              this.marked = !this.marked;
            })
            .catch(error => {
              console.error('Error marking the movie:', error);
            });
      }
    },
  },
  watch: {
    isMarked(newVal) {
      this.marked = newVal;
    },
  },
};
</script>

<style scoped>
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

.bookmark-btn .fas.fa-bookmark {
  color: blue;
}
</style>
