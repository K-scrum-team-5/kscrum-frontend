<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 style="margin-top: 20px;">영화 검색</h1>
        <v-text-field v-model="query" @keyup.enter="searchMovies" label="영화 제목을 입력하세요" outlined dense class="search-bar" />
        <div class="search-button-container">
          <v-btn @click="searchMovies" color="primary" class="search-button">검색</v-btn>
        </div>
        <!-- 수정: 검색 결과를 MovieList 컴포넌트에 전달 -->
        <MovieList :movies="searchResults" @showDetail="showDetailModal" />
        <!-- 수정: 모달 창을 띄우는 MovieDetail 컴포넌트 -->
        <MovieDetail :movieId="selectedMovieId" v-if="selectedMovieId" @closeDetail="selectedMovieId = null" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import MovieList from '../components/MovieList.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Search',
  components: {
    MovieList,
  },
  data() {
    return {
      query: '',
      searchResults: [], // 검색 결과를 저장할 배열
      selectedMovieId: null // 선택된 영화의 ID
    };
  },
  methods: {
    async searchMovies() {
      try {
        const baseUrl = 'http://49.50.174.94:8080/api/movie/search/string';
        const params = {
          page: 0,
          size: 8,
          filterType: 'year',
          ordering: 'desc',
          keyword: this.query
        };
        const url = `${baseUrl}?page=${params.page}&size=${params.size}&filterType=${params.filterType}&ordering=${params.ordering}&keyword=${encodeURIComponent(params.keyword)}`;
        console.log('Request URL:', url);
        const response = await axios.get(url);
        console.log(response.data);
        this.searchResults = response.data; // 검색 결과를 저장
        console.log('Movies:', this.searchResults);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    showDetailModal(movieId) {
      this.selectedMovieId = movieId; // 모달 창을 띄우기 위해 선택된 영화의 ID를 저장
    }
  }
};
</script>


<style scoped>
.search-bar {
  margin-bottom: 20px;
}

.search-button-container {
  text-align: right;
}

.search-button {
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.v-container {
  padding-top: 20px;
  padding:0px 100px;
}
</style>
