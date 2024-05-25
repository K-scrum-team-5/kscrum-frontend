<template>
  <div class="top-space"></div>
  <div class="container">
    <!--천장여백-->
    <div class="gallery">
      <div class="gallery-item" tabindex="0" v-for="(movie, index) in movies" :key="index">
        <img :src="movie.url" class="gallery-image" alt="" @click="openModal(movie)" />
      </div>
    </div>

    <InfiniteLoading @infinite="loadMore" ref="infiniteLoading" />

    <div v-if="showModal" class="modal" @click="closeModal" :class="{ 'dark-mode': $root.isDarkMode }">
  <div class="modal-content" @click.stop :class="{ 'dark-mode': $root.isDarkMode }">
    <img :src="selectedMovie?.url" alt="Post Image">
    <div class="modal-info" :class="{ 'dark-mode': $root.isDarkMode }">
      <h3>{{ selectedMovie?.title }}</h3>
      <p><strong>장르: </strong>{{ selectedMovie?.genreString }}</p>
      <p class="overview" :class="{ 'expanded': selectedMovie && selectedMovie.showFullOverview }">
        {{ selectedMovie && selectedMovie.overview }}
      </p>
      <p>
        <button v-if="selectedMovie && selectedMovie.overview && selectedMovie.overview.length > 100"
                @click="toggleOverview">
          {{ selectedMovie && selectedMovie.showFullOverview ? '접기' : '펼치기' }}
        </button>
      </p>
      <p><strong>평점: </strong> {{ selectedMovie?.voteAverage }} </p>
      <p><strong>개봉일: </strong> {{ selectedMovie?.release_date }}</p>
      <p><strong>러닝타임: </strong> {{ selectedMovie?.runtime }}분</p>
      <button @click="toggleLike(selectedMovie)">
        {{ isLiked ? 'Delete from Bookmark' : 'Add to Bookmark' }}
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

//const YOUTUBE_API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY;

export default {
  name: 'ExplorePage',
  components: {
    InfiniteLoading,
  },
  props: ['likedMovies'],
  data() {
    return {
      movies: [],
      page: 0,
      showModal: false,
      selectedMovie: null,
      trailerUrl: '',
      quotaExceeded: false,
    };
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  /* 너비 조정 */
  height: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;

}

.modal-content {
  width: 80%;
  height: 100%;
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
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

.modal-info {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-left: 0;
}
.modal-info img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 20px;
}

.modal-info .overview {
  display: -webkit-box;
  -webkit-line-clamp: 8;
  /* 원하는 줄 수로 설정 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-info h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-info p {
  font-size: 16px;
  margin-bottom: 10px;
}

.modal-info .date {
  font-size: 14px;
  color: grey;
}

.error {
  color: red;
  font-weight: bold;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #ffffff;
}

.modal.dark-mode {
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content.dark-mode {
  background-color: #444444;
  color: #ffffff;
}

.modal-info.dark-mode {
  background-color: #333333;
  color: #ffffff;
}

.modal-info.dark-mode .date {
  color: #cccccc;
}

.error {
  color: #ff5555;
}

.overview {
  position: relative;
  line-height: 1.4;
  max-height: 4.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.overview.expanded {
  max-height: none;
  overflow: visible;
  text-overflow: initial;
  display: block;
}

.overview button {
  position: absolute;
  right: 0;
  bottom: 0;
  background: none;
  border: none;
  color: eeeeeee;
  cursor: pointer;
}
</style>