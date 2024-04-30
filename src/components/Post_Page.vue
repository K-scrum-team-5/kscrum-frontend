<template>
  <div class="post" style="border: 5px ridge">
    <div class="post-body">
      <img :src="인스타데이터.postImage" alt="Post Image" @click="openModal">
    </div>
    <div class="post-content">
    <div class="buttons">
      <button class="like-btn" @click="toggleLike">{{ 인스타데이터.liked ? '좋아요  취소' : '좋아요' }}</button>
    </div>
      <p class="textover"><strong style="font-size: 18px;">{{ 인스타데이터.name }}</strong> {{ 인스타데이터.content }}</p>
      <p class="date">{{ 인스타데이터.date }}</p>
    </div>

    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content">
        <img :src="인스타데이터.postImage" alt="Post Image">
        <div class="modal-info">
          <h3>{{ 인스타데이터.name }}</h3>
          <p>{{ 인스타데이터.content }}</p>
          <p class="date">{{ 인스타데이터.date }}</p>          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    인스타데이터: Object,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showModal = false;
      }
    },
    toggleLike() {
      this.$emit('toggle-like', this.인스타데이터.name);
    },
  },
};
</script>

<style scoped>
.post {
  width: 100%;
}

.profile {
  background-image: url("https://picsum.photos/100?random=0");
  width: 30px;
  height: 30px;
  background-size: 100%;
  border-radius: 50%;
  float: left;
}

.profile-name {
  display: block;
  float: left;
  padding-left: 10px;
  padding-top: 7px;
  font-size: 14px;
}

.post-body {
  height: 450px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-body img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.post-content {
  padding-left: 15px;
  padding-right: 15px;
  font-size: 14px;
}

.buttons {
  margin-top: 10px;
  
  
}

.like-btn {
  background-color: transparent;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.date {
  font-size: 11px;
  color: grey;
  margin-top: -8px;
}

.textover{
  display: inline-block;
  width: 400px;
  padding: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  max-width: 90%;
  max-height: 90%;
  display: flex;
}

.modal-content img {
  width: 35%;
  height: auto;
  object-fit: contain;
}

.modal-info {
  width: 30%;
  padding: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.modal-info h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-info p {
  font-size: 14px;
  margin-bottom: 10px;
}

.modal-info .date {
  font-size: 12px;
  color: grey;
}
</style>