import { createRouter, createWebHistory } from 'vue-router';
import Init_movie from '@/views/Init_movie.vue';
import App from '@/App.vue';

// 라우터 경로 정의
const routes = [
    { path: '/', name: 'main_screen', component: App, }, 
    { path: '/choice', name: 'movie_init_choice', component: Init_movie, },
  ];

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;