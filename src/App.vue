<template>
  <v-app>
    <v-main>
      <router-view/>  <!--/choice-->
      <template v-if="!isChoiceRoute"> 
        <v-container>
          <v-btn 
            block
            large
            class = "goto_choice_btn"
            @click="goto_choice">
            영화초기선택
          </v-btn>
        </v-container>

        <div>
          <!-- <StoryBar_Page/> -->
          <StoryProfiles/>
          <SideBar_Page/>
          <Container_Page :movies="movies"/> <!-- ':movies' 대신 원래 'develop'에 있던 ':인스타데이터' 사용을 고려 -->
          <div class="footer"></div>
          <RightSideBar />
        </div>
      </template>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
//import instaData from './assets/instaData';
import Container_Page from './components/Container_Page.vue';
import SideBar_Page from './components/SideBar_Page.vue';
import StoryProfiles from './components/StoryProfiles.vue';
import RightSideBar from './components/RightSideBar.vue';


export default {
  name: 'App',
  data(){
    return{
      movies: [],
    }
  },
  components: {
    Container_Page,
    SideBar_Page,
    StoryProfiles,
    RightSideBar,
  },
  setup() {
    console.log('App setup');
    const router = useRouter(); 
    const route = useRoute(); 
    const goto_choice = () => { // 경로 이동
      console.log("버튼 클릭됨");
      router.push('/choice');
    };
    const isChoiceRoute = computed(() => route.path === '/choice');
    return {
      goto_choice, //이벤트 연결
      isChoiceRoute,
    };
  },
  mounted() {
    console.log('App mounted');
    axios.get('http://49.50.174.94:8080/api/movie/posters?page=2&size=8')
        .then(response => {
          this.movies = response.data;
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
  }
}
</script>

<style>
body {
  margin: 0;
}
ul {
  padding: 5px;
  list-style-type: none;
}
.header {
  width: 100%;
  height: 40px;
  background-color: white;
  padding-bottom: 8px;
  position: sticky;
  top: 0;
}
.header-button-left {
  color: skyblue;
  float: left;
  width: 50px;
  padding-left: 20px;
  cursor: pointer;
  margin-top: 10px;
}
.header-button-right {
  color: skyblue;
  float: right;
  width: 50px;
  cursor: pointer;
  margin-top: 10px;
}
.footer {
  width: 100%;
  position: sticky;
  bottom: 0;
  padding-bottom: 10px;
  background-color: white;
}
.footer-button-plus {
  width: 80px;
  margin: auto;
  text-align: center;
  cursor: pointer;
  font-size: 24px;
  padding-top: 12px;
}
.sample-box {
  width: 100%;
  height: 600px;
  background-color: bisque;
}
.inputfile {
  display: none;
}
.input-plus {
  cursor: pointer;
}
.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  margin-right: 250px;
}
.goto_choice_btn {
    text-align: center;
    color: black;
    display: block;
    text-align: center;
    cursor: pointer;
    padding: 10px; 
    border-radius: 5px;
    background-color: white;
    border: 2px solid gray;
    color: gray;
}
.v-btn {
  text-transform: none;
}
.v-container {
  padding-top: 20px;
}
#app {
  box-sizing: border-box;
  font-family: 'consolas';
  margin-top: 60px;
  width: 100%;
  max-width: 460px;
  margin: auto;
  position: relative;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
}
</style>
