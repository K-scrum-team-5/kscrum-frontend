<template>
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card mb-3" v-for="movie in filteredMovies" :key="movie.id">
            <img :src="movie.image" class="card-img-top" :alt="movie.title">
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">{{ movie.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="likeMovie(movie)">
                    <i class="fas fa-thumbs-up"></i> 좋아요
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="dislikeMovie(movie)">
                    <i class="fas fa-thumbs-down"></i> 싫어요
                  </button>
                </div>
                <small class="text-muted">{{ movie.date }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['genre'],
    data() {
      return {
        movies: [
          {
            id: 1,
            title: '영화 제목 1',
            description: '영화 설명 1',
            image: 'movie1.jpg',
            date: 'YYYY-MM-DD',
            liked: false,
            disliked: false,
            genres: ['Action', 'Adventure']
          },
          // 추가 영화 데이터
        ]
      };
    },
    computed: {
      filteredMovies() {
        if (this.genre) {
          return this.movies.filter(movie => movie.genres.includes(this.genre));
        } else {
          return this.movies;
        }
      }
    },
    methods: {
      likeMovie(movie) {
        movie.liked = !movie.liked;
        console.log(`${movie.title} 좋아요 상태: ${movie.liked}`);
      },
      dislikeMovie(movie) {
        movie.disliked = !movie.disliked;
        console.log(`${movie.title} 싫어요 상태: ${movie.disliked}`);
      }
    }
  };
  </script>