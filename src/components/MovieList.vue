<template>
  <div>
    <h2>검색 결과</h2>
    <div v-if="movies && movies.length">
      <v-row>
        <v-col v-for="(movie, index) in movies" :key="index" cols="12" md="4">
          <!-- 수정: 받아온 데이터에 맞게 movie를 직접 전달 -->
          <MovieCard :movie="movie" />
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <p>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import MovieCard from './MovieCard.vue'; 


export default {
  name: 'MovieList',
  props: {
    movies: Array 
  },
  components: {
    MovieCard
  }
};
</script>


<style scoped>
.movie-card {
  /* 영화 카드 스타일 */
  border: 1px solid #eee;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
}

.movie-poster {
  /* 포스터 이미지 스타일 */
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 10px;
}
</style>
