<template>
  <div>
    <div class="container">
      <div class="profile">
        <div class="profile-image">
          <img src="https://picsum.photos/100?random=0" alt="">
        </div>
        <div class="profile-user-settings">
          <h1 class="profile-user-name">{{ genreName }}</h1>
          <button class="btn profile-settings-btn" aria-label="profile settings"><i class="fas fa-cog"
              aria-hidden="true"></i></button>
        </div>
        <div class="profile-stats"></div>
        <div class="profile-bio"></div>
      </div>
    </div>
    <div class="container">
      <div class="gallery">
        <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
          <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie)">
        </div>
      </div>
      <InfiniteLoading @infinite="loadMore" ref="infiniteLoading" />
    </div>
    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
      <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
        <img :src="selectedMovie.url" alt="Post Image">
        <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
          <h3 class="modal-title">{{ selectedMovie?.title }}</h3>
          <p>장르: {{ selectedMovie?.genreString }}</p>
          <p class="overview"><strong>개요</strong><br>{{ selectedMovie?.overview }}</p>
          <p><strong>평점:</strong> {{ selectedMovie?.voteAverage }}  </p>
          <p><strong>개봉일:</strong> {{ selectedMovie?.release_date }}</p>
          <p><strong>러닝타임:</strong> {{ selectedMovie?.runtime }}분</p>
          <p v-if="quotaExceeded" class="error">YouTube API quota exceeded. Showing movie poster instead.</p>
          <button @click="toggleLike(selectedMovie)">
            {{ likedMovies.some(m => m.id === selectedMovie?.id) ? 'Delete from Bookmark' : 'Add to Bookmark' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
import InfiniteLoading from 'vue-infinite-loading';
import '@/styles/modal.css';


export default {
  components: {
    InfiniteLoading,
  },
  setup() {
    const route = useRoute();
    const genreName = route.params.genreName;

    return {
      genreName,
    };
  },
  data() {
    return {
      movies: [],
      likedMovies: [],
      loading: false,
      busy: false,
      page: 0,
      showModal: false,
      selectedMovie: null,
    };
  },
  mounted() {
    this.fetchMovies();
    this.fetchLikedMovies();
  },
  watch: {
    likedMovies: {
      handler() {
        if (this.selectedMovie) {
          this.selectedMovie.isLiked = this.isLiked(this.selectedMovie);
        }
      },
      deep: true,
    },
  },
  methods: {
    fetchMovies($state) {
      this.loading = true;
      const url = `http://49.50.174.94:8080/api/movie/genre?page=${this.page}&size=8&genre=${this.genreName}`;
      axios.get(url)

        .then(response => {
          if (response.data.length) {
            this.movies = [...this.movies, ...response.data];
            this.page++;
            if ($state) {
              $state.loaded();
            }
          } else {
            if ($state) {
              $state.complete();
            }
          }
          this.loading = false;
          this.busy = false;
        })
        .catch(error => {
          console.error(error);
          if ($state) {
            $state.complete();
          }
          this.loading = false;
          this.busy = false;
        });
    },
    loadMore($state) {
      this.fetchMovies($state);
    },
    openModal(movie) {
      this.showModal = true;
      this.selectedMovie = movie;

      this.fetchMovieInfo(movie.id)
          .then((response) => {
                this.selectedMovie = response.data;
                this.selectedMovie.id = movie.id;
                this.selectedMovie.isLiked = this.isLiked(this.selectedMovie);
                this.selectedMovie.url = movie.url;
          });
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showModal = false;
      }
    },

    fetchMovieInfo(id) {
      const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(
          id
      )}`;
      return axios.get(url);
    },

    fetchLikedMovies() {
      axios.get('http://49.50.174.94:8080/api/movie/mark')
        .then(response => {
          this.likedMovies = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    isLiked(movie) {
      return this.likedMovies.some(m => m.id === movie?.id);
    },
    async toggleLike(movie) {
      if (!movie || !movie.id) {
        console.error('유효하지 않은 영화 객체:', movie);
        return;
      }

      const movieId = movie.id;
      const isLiked = this.isLiked(movie);
      const url = `http://49.50.174.94:8080/api/movie/mark/${movieId}?movieId=${movieId}`;

      try {
        if (isLiked) {
          await axios.delete(url);
          console.log('좋아요 삭제 완료');
        } else {
          const response = await axios.post(url);
          console.log('좋아요 등록 응답:', response.data);
        }

        this.fetchLikedMovies();
      } catch (error) {
        console.error('좋아요 처리 오류:', error);
      }
    },
  },
};
</script>

<style>
:root {
  font-size: 10px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: "Open Sans", Arial, sans-serif;
  min-height: 100vh;
  background-color: #fafafa;
  color: #262626;
  padding-bottom: 3rem;
}

img {
  display: block;
}

.container {
  max-width: 60%;
  margin: 0 auto;
  padding: 0 2rem;
}
@media (max-width: 740px) {
  .container {
   max-width: 80%;
   margin: 0 auto;
   padding: 0 2rem;
  }
}

.btn {
  display: inline-block;
  font: inherit;
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
}

.btn:focus {
  outline: 0.5rem auto #4d90fe;
}

.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}

/* Profile Section */

.profile {
  padding: 5rem 0;
}

.profile::after {
  content: "";
  display: block;
  clear: both;
}

.profile-image {
  float: left;
  width: calc(33.333% - 1rem);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3rem;
}

.profile-image img {
  border-radius: 50%;
}

.profile-user-settings,
.profile-stats,
.profile-bio {
  float: left;
  width: calc(66.666% - 2rem);
}

.profile-user-settings {
  margin-top: 1.1rem;
}

.profile-user-name {
  display: inline-block;
  font-size: 3.2rem;
  font-weight: 300;
}

.profile-edit-btn {
  font-size: 1.4rem;
  line-height: 1.8;
  border: 0.1rem solid #dbdbdb;
  border-radius: 0.3rem;
  padding: 0 2.4rem;
  margin-left: 2rem;
}

.profile-settings-btn {
  font-size: 2rem;
  margin-left: 1rem;
}

.profile-stats {
  margin-top: 2.3rem;
}

.profile-stats li {
  display: inline-block;
  font-size: 1.6rem;
  line-height: 1.5;
  margin-right: 4rem;
  cursor: pointer;
}

.profile-stats li:last-of-type {
  margin-right: 0;
}

.profile-bio {
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 2.3rem;
}

.profile-real-name,
.profile-stat-count,
.profile-edit-btn {
  font-weight: 600;
}

/* Gallery Section */

.gallery {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem -1rem;
  padding-bottom: 3rem;
}

.gallery-item {
  position: relative;
  flex: 1 0 22rem;
  margin: 1rem;
  color: #fff;
  cursor: pointer;
}

.gallery-item:hover .gallery-item-info,
.gallery-item:focus .gallery-item-info {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.gallery-item-info {
  display: none;
}

.gallery-item-info li {
  display: inline-block;
  font-size: 1.7rem;
  font-weight: 600;
}

.gallery-item-likes {
  margin-right: 2.2rem;
}

.gallery-item-type {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2.5rem;
  text-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.1);
}

.fa-clone,
.fa-comment {
  transform: rotateY(180deg);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Loader */

.loader {
  width: 5rem;
  height: 5rem;
  border: 0.6rem solid #999;
  border-bottom-color: transparent;
  border-radius: 50%;
  margin: 0 auto;
  animation: loader 500ms linear infinite;
}

/* Media Query */

@media screen and (max-width: 40rem) {
  .profile {
    display: flex;
    flex-wrap: wrap;
    padding: 4rem 0;
  }

  .profile::after {
    display: none;
  }

  .profile-image,
  .profile-user-settings,
  .profile-bio,
  .profile-stats {
    float: none;
    width: auto;
  }

  .profile-image img {
    width: 7.7rem;
  }

  .profile-user-settings {
    flex-basis: calc(100% - 10.7rem);
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .profile-user-name {
    font-size: 2.2rem;
  }

  .profile-edit-btn {
    order: 1;
    padding: 0;
    text-align: center;
    margin-top: 1rem;
  }

  .profile-edit-btn {
    margin-left: 0;
  }

  .profile-bio {
    font-size: 1.4rem;
    margin-top: 1.5rem;
  }

  .profile-edit-btn,
  .profile-bio,
  .profile-stats {
    flex-basis: 100%;
  }

  .profile-stats {
    order: 1;
    margin-top: 1.5rem;
  }

  .profile-stats ul {
    display: flex;
    text-align: center;
    padding: 1.2rem 0;
    border-top: 0.1rem solid #dadada;
    border-bottom: 0.1rem solid #dadada;
  }

  .profile-stats li {
    font-size: 1.4rem;
    flex: 1;
    margin: 0;
  }

  .profile-stat-count {
    display: block;
  }
}

/* Spinner Animation */

@keyframes loader {
  to {
    transform: rotate(360deg);
  }
}

/*

The following code will only run if your browser supports CSS grid.

Remove or comment-out the code block below to see how the browser will fall-back to flexbox & floated styling.

*/

@supports (display: grid) {
  .profile {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: repeat(3, auto);
    grid-column-gap: 3rem;
    align-items: center;
  }

  .profile-image {
    grid-row: 1 / -1;
  }

  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
    grid-gap: 2rem;
  }
  .gallery-image {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1270px) {
    .gallery {
      grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
    }
  }
  @media (max-width: 1000px) {
    .gallery {
      grid-template-columns: 1fr;
    }
  }

  .profile-image,
  .profile-user-settings,
  .profile-stats,
  .profile-bio,
  .gallery-item,
  .gallery {
    width: auto;
    margin: 0;
  }

  @media (max-width: 40rem) {
    .profile {
      grid-template-columns: auto 1fr;
      grid-row-gap: 1.5rem;
    }

    .profile-image {
      grid-row: 1 / 2;
    }

    .profile-user-settings {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 1rem;
    }

    .profile-edit-btn,
    .profile-stats,
    .profile-bio {
      grid-column: 1 / -1;
    }

    .profile-user-settings,
    .profile-edit-btn,
    .profile-settings-btn,
    .profile-bio,
    .profile-stats {
      margin: 0;
    }
  }
}
.gallery-item {
  cursor: pointer;
  transition: transform 0.2s;
}
.gallery-item:hover {
  transform: scale(1.05);
}
</style>