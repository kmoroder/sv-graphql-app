<template>
  <div>
    <div>user: {{ login }}</div>
    <img :src="this.avatarUrl" width="200" />
    <div>bio: {{ bio }}</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data: () => ({
    avatarUrl: "",
    login: "Loading!",
    bio: ""
  }),
  async mounted() {
    try {
      // eslint-disable-next-line no-console
      console.log(process.env);
      const response = await this.$http({
        url: "https://api.github.com/graphql",
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
        },
        method: "post",
        data: {
          query: `query { viewer { avatarUrl login bio } }`
        }
      });
      this.login = response.data.data.viewer.login;
      this.avatarUrl = response.data.data.viewer.avatarUrl;
      this.bio = response.data.data.viewer.bio;
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
  }
};
</script>

<style scoped></style>
