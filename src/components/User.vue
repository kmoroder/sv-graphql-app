<template>
  <div>
    {{ login }}
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
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
  }
};
</script>

<style scoped></style>
