<template>
  <div>
    <button @click="toggleLike" class="like-btn">
      <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
      {{ liked ? '좋아요 취소' : '좋아요' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      liked: false,
    };
  },
  methods: {
    toggleLike() {
      this.liked = !this.liked;
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
