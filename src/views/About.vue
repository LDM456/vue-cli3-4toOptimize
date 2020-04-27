<template>
  <div class="about">
    <div class="box">这是测试字体</div>
    <img src="../../static/logo.png" alt />
    <img :src="images" alt />
    <img :src="img" alt />
  </div>
</template>

<script>
import service from "../api/axios";
export default {
  data() {
    return {
      images: require("../../static/logo.png"),
      img: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
        this.img = require("../../static/logo.png");
        service
          .post("/question/login", {
            name: "医生4",
            hospital: "医院",
            title: "职称"
          })
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      }, 500);
    }
  }
};
</script>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  font-size: 20px;
}
.box {
  width: 180px;
  height: 48px;
  background: rgba(50, 204, 120, 1);
  border-radius: 5px;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(254, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
