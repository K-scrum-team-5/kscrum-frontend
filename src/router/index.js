import { createRouter, createWebHistory } from 'vue-router';
import Init_movie from '@/views/Init_movie.vue';

// 라우터 경로 정의
const routes = [
    { path: '/', component: Init_movie },
  ];

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;