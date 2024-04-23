<template>
    <div class="container mt-5">
      <h2 class="mb-4">선호하는 영화 장르를 선택해 주세요.</h2>
      <div class="row">
        <div class="col-md-4" v-for="genre in genres" :key="genre">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">{{ genre }}</h5>
              <button class="btn btn-primary" @click="selectGenre(genre)">
                선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        genres: [
          'Action',
          'Adventure',
          'Animation',
          'Children',
          'Comedy',
          'Crime',
          'Documentary',
          'Drama',
          'Fantasy',
          'Film-Noir',
          'Horror',
          'IMAX',
          'Musical',
          'Mystery',
          'Romance',
          'Sci-Fi',
          'Thriller',
          'War',
          'Western',
        ],
      };
    },
    methods: {
      selectGenre(genre) {
        this.$emit('genre-selected', genre);
      },
    },
  };
  </script>