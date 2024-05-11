import { createRouter, createWebHistory } from 'vue-router';
import Init_movie from '@/views/Init_movie.vue';
import App from '@/App.vue';
import HomeView from '@/views/HomeView.vue'; //뷰티파이 테스트용 임시 라우터 목적, 지워도 됌

// 라우터 경로 정의
const routes = [
    { path: '/', name: 'main_screen', component: App, }, 
    { path: '/choice', name: 'movie_init_choice', component: Init_movie, },
    { path: '/home', name : '임시', component: HomeView }, //뷰티파이 테스트용 임시 라우터, 지워도 됌
  ];

// 라우터 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;