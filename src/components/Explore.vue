<template>
  <div class="top-space"></div>
  <div class="container">
    <!--천장여백-->
    <!--사이즈 더 크게-->
    <h1 class="section-title">상영중인 영화</h1>
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in nowPlayingMovies" :key="index">
        <img :src="movie.poster_path" class="gallery-image" alt="" @click="openExploreModal(movie)" />
      </div>
    </div>


    <h1 class="section-title">Trending Movies</h1>
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in trendingMovies" :key="index">
        <img :src="movie.poster_path" class="gallery-image" alt="" @click="openExploreModal(movie)" />
      </div>
    </div>



    <h1 class="section-title">추천영화</h1>
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie)" />
      </div>
    </div>
    <InfiniteLoading @infinite="loadMore" ref="infiniteLoading" />

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">

      <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
        <img v-if="selectedMovie" :src="'http://image.tmdb.org/t/p/w500' + selectedMovie.poster_path">
        <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
          <h3 class="modal-title">{{ selectedMovie?.title }}</h3>
          <p>장르: {{ selectedMovie?.genreString }}</p>
          <p class="overview"><strong>개요</strong><br>{{ selectedMovie?.overview }}</p>
          <p><strong>평점:</strong> {{ selectedMovie?.voteAverage }}  </p>
          <p><strong>개봉일:</strong> {{ selectedMovie?.release_date }}</p>
          <p><strong>러닝타임:</strong> {{ selectedMovie?.runtime }}분</p>
         <!-- <p v-if="quotaExceeded" class="error">YouTube API quota exceeded. Showing movie poster instead.</p>-->
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
import InfiniteLoading from 'vue-infinite-loading';
import '@/styles/gallery.css';
import '@/styles/modal.css';

//const YOUTUBE_API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY;

export default {
  name: 'ExplorePage',
  components: {
    InfiniteLoading,
  },
  props: ['likedMovies'],
  data() {
    return {
      trendingMovies: [],
      nowPlayingMovies: [],
      movies: [],
      page: 0,
      showModal: false,
      selectedMovie: null,
      trailerUrl: '',
      quotaExceeded: false,
    };
  },mounted() {
    this.fetchTrendingMovies();
    this.fetchNowPlayingMovies()
  },
  methods: {
    fetchMovies($state) {
      const url = `http://49.50.174.94:8080/api/movie/posters?page=${this.page}&size=18`;
      axios
        .get(url)
        .then((response) => {
          if (response.data.length) {
            this.movies = [...this.movies, ...response.data];
            this.page++;
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.error(error);
          $state.complete();
        });
    },

    fetchTrendingMovies() {
      const trendingUrl = `http://49.50.174.94:8080/api/movie/trending_week?page=0&size=12`;
      axios
          .get(trendingUrl)
          .then((response) => {
            this.trendingMovies = response.data;
            this.loadMore({ loaded: () => {}, complete: () => {} }); // Load the initial set of regular movies
          })
          .catch((error) => {
            console.error(error);
          });
    },

    fetchNowPlayingMovies() {
      const nowPlayingUrl = `http://49.50.174.94:8080/api/movie/now_playing?tmdbPage=1&page=0&size=12`;
      axios
          .get(nowPlayingUrl)
          .then((response) => {
            this.nowPlayingMovies = response.data;
            this.loadMore({ loaded: () => {}, complete: () => {} }); // Load the initial set of regular movies
          })
          .catch((error) => {
            console.error(error);
          });
    },
    fetchMovieInfo(id) {
      const url = `http://49.50.174.94:8080/api/movie/details?movieId=${encodeURIComponent(
        id
      )}`;
      return axios.get(url);
    },
    fetchYouTubeTrailer(title, releaseDate) {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(title + ' ' + releaseDate.split('-')[0])} trailer&key='testkey'`//${YOUTUBE_API_KEY}`;
      return axios.get(url);
    },
    loadMore($state) {
      this.fetchMovies($state);
    },
    openModal(movie) {
  this.showModal = true;
  this.selectedMovie = null;

  this.fetchMovieInfo(movie.id)
    .then(response => {
      this.selectedMovie = response.data;
      this.selectedMovie.showFullOverview = false; // 추가
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
},
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showModal = false;
      }
    },

    openExploreModal(movie) {
      this.showModal = true;
      this.trailerUrl = '';
      this.selectedMovie = movie;
      this.quotaExceeded = false;
      this.selectedMovie = movie;
      this.fetchYouTubeTrailer(movie.title, movie.release_date)
          .then((response) => {
            const videoId = response.data.items[0].id.videoId;
            this.trailerUrl = `https://www.youtube.com/embed/${videoId}`;
          })
          .catch((error) => {
            if (
                error.response &&
                error.response.data.error.errors[0].reason === 'quotaExceeded'
            ) {
              this.quotaExceeded = true;
            } else {
              console.error('Error:', error);
            }
          });

    },






    async toggleLike(movie) {
      if (!movie || !movie.id) {
        console.error('유효하지 않은 영화 객체:', movie);
        return;
      }

      const movieId = movie.id;
      const isLiked = this.likedMovies.some(m => m.id === movieId);
      const url = `http://49.50.174.94:8080/api/movie/mark/${movieId}?movieId=${movieId}`;

      try {
        if (isLiked) {
          await axios.delete(url);
          console.log('좋아요 삭제 완료');
        } else {
          const response = await axios.post(url);
          console.log('좋아요 등록 응답:', response.data);
        }

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
    toggleOverview() {
  if (this.selectedMovie) {
    this.selectedMovie.showFullOverview = !this.selectedMovie.showFullOverview;
  }
},
    truncateOverview(overview) {
      if (!overview) {
        return '';
      }
      if (overview.length <= 100) {
        return overview;
      }
      return overview.slice(0, 100) + '...';
    },
  },
};
</script>

<style>
.top-space {
  height: 20px;
}

.modal-video-info {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
}

.youtube-video-wrapper {
  width: 50%;
  padding-bottom: 28%;
  position: relative;
}

.youtube-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


.poster-wrapper {
  width: 50%;
  display: flex;
  justify-content: center;
  transform: translateX(20px); /* 추가 */
}


.poster-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}


.error {
  color: red;
  font-weight: bold;
}


.error {
  color: #ff5555;
}

</style>