<template>
  <div class="stories" ref="storiesContainer" @wheel="onScroll" :class="{ 'dark-mode': $root.isDarkMode }">
    <div v-for="(genre, index) in genres" :key="genre.name" class="story" @click="openGenre(genre)">
      <img :src="`https://picsum.photos/100?random=${index}`" />
      <span>{{ genre.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryProfiles',
  data() {
    return {
      genres: [
        { name: 'Action'},
        { name: 'Romance'},
        { name: 'Sci-Fi'},
        { name: 'Drama'},
        { name: 'Comedy'},
        { name: 'Horror'},
        { name: 'Thriller'},
        { name: 'Fantasy'},
        { name: 'Mystery'},
        { name: 'Crime'},
        { name: 'Adventure'},
        { name: 'Animation'},
        { name: 'Family'},
        { name: 'War'},
        { name: 'History'},
        { name: 'Music'},
        { name: 'Documentary'},
        { name: 'Western'},
        { name: 'TV Movie'},
      ],
      scrollSpeed: 2,
    };
  },
  methods: {
    openGenre(genre) {
      this.$router.push({ name: 'genre_profile', params: { genreName: genre.name } });
    },
    onScroll(event) {
      event.preventDefault();
      this.$refs.storiesContainer.scrollLeft += event.deltaY * this.scrollSpeed;
    },
  },
};
</script>
  
  <style scoped>
  .stories {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    background: white;
  }
@media (max-width: 740px) {
  .stories {
    margin: 0 auto;
    width: 80%;
    display: flex;
    overflow-x: auto;
    padding: 10px;
    background: white;
  }
}

.story {
  flex: 0 0 auto;
  width: 80px;
  max-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.story > img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #e1306c;
}

.story > span {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 80px;
  text-align: center;
  font-size: 12px;
  margin-top: 4px;
  color: black;
}
.stories::-webkit-scrollbar {
  display: none;
}

.stories {
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

.stories.dark-mode {
  background-color: #333333;
}

.stories.dark-mode .story > span {
  color: #ffffff;
}
  </style>