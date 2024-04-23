<template>
  <div id="app">
    <genre-selection v-if="!selectedGenre" @genre-selected="onGenreSelected" />
    <movie-feed v-else :genre="selectedGenre" />
  </div>
</template>

<script>
import GenreSelection from './GenreSelection.vue';
import MovieFeed from './MovieFeed.vue';

export default {
  components: {
    GenreSelection,
    MovieFeed,
  },
  data() {
    return {
      selectedGenre: null,
    };
  },
  methods: {
    onGenreSelected(genre) {
      this.selectedGenre = genre;
    },
  },
};
</script>