import { createRouter, createWebHistory } from 'vue-router';
import Init_movie from '@/views/Init_movie.vue';
import GenreProfile from '@/components/GenreProfile.vue';
import Explore from '@/components/Explore.vue'; // Explore 페이지 추가
import Search from '@/views/Search.vue'; // '@/views/Search.vue'로 수정


// 라우터 경로 정의
const routes = [
    { path: '/choice', name: 'movie_init_choice', component: Init_movie, },
    { 
      path: '/genre/:genreName',
      name: 'genre_profile',
      component: GenreProfile,
    },
    {
        path: '/explore',
        name: 'explore',
        component: Explore, // Explore 경로 추가
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/search/:type',
      name: 'SearchWithType',
      component: Search,
      props: true
    },

  ];

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;