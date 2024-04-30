<template>
    <div class="stories" ref="storiesContainer" @wheel="onScroll">
      <div v-for="profile in profiles" :key="profile.username" class="story" @click="openStory(profile)">
        <img :src="profile.username" :alt="profile.username">
        <span>{{ profile.username }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StoryProfiles',
    data() {
      return {
        profiles: [
          { username: 'Action' },
          { username: 'jun._pil', image: 'jun._pil.jpg' },
          { username: 'yul._99', image: 'yul._99.jpg' },
          { username: 'yul._99', image: 'yul._99.jpg' },
          { username: 'yul._99', image: 'yul._99.jpg' },
          { username: 'yul._99', image: 'yul._99.jpg' },          
        ],
        scrollSpeed: 2,
    };
  },
  methods: {
    openStory(profile) {
      console.log(`Opening story for ${profile.username}`);
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
  </style>