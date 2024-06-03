<template>
  <div>
    <img :src="movieDetail.poster_path" :alt="movieDetail.title" style="max-width: 200px;">
    <h2>{{ movieDetail.title }}</h2>
    <p>{{ movieDetail.tagline }}</p>
    <p><strong>평점:</strong> {{ movieDetail.voteAverage }}</p>
    <p><strong>상영 시간:</strong> {{ movieDetail.runtime }} 분</p>
    <p><strong>장르:</strong> {{ movieDetail.genreString }}</p>
    <p>{{ movieDetail.overview }}</p>
    <p><strong>개봉일:</strong> {{ movieDetail.release_date }}</p>
    <button @click="goBack">뒤로 가기</button>
  </div>
</template>

<script>
export default {
  props: {
    movieDetail: {
      type: Object,
      required: true
    }
  },
  methods: {
    goBack() {
      // Vue Router를 이용하여 이전 페이지로 이동
      this.$router.go(-1);
    }
  }
};
</script>
  
  
  <style scoped>
  .movie-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 모달 외부를 클릭했을 때 투명한 배경을 추가합니다. */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .v-card {
    max-width: 600px;
  }
  
  .v-img {
    max-height: 400px;
    object-fit: cover;
  }
  
  .v-card-title, .v-card-subtitle {
    font-size: 24px;
    font-weight: bold;
  }
  
  .v-card-text {
    font-size: 16px;
  }
  </style>
  