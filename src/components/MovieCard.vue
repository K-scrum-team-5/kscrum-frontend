<template>
    <v-card class="movie-card" :style="{ height: 'auto' }" @click="fetchMovieDetail">
        <v-img :src="movie.url" :alt="movie.original_title" :max-height="cardHeight"></v-img>
        <v-card-title>{{ movie.original_title }}</v-card-title>
    </v-card>
</template>
    
    <script>

    import MovieDetail from '../components/MovieDetail.vue';

    export default {
    name: 'MovieCard',
    props: {
        movie: {
        type: Object,
        required: true
        }
    },
    components: {
    MovieDetail
    },
    computed: {
        cardHeight() {
        return '400px';
        }
    },
    methods: {
        async fetchMovieDetail() {
        try {
            const movieId = this.movie.id;
            const response = await fetch(`http://49.50.174.94:8080/api/movie/details?movieId=${movieId}`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data); //잘 가져옴
            this.$emit('showDetail', data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
        }
    }
    };
    </script>
    
    <style scoped>
    .movie-card {
    cursor: pointer;
    transition: transform 0.2s;
    }
    .movie-card:hover {
    transform: scale(1.05);
    }
    .v-card-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    }
    </style>