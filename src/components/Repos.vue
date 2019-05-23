<template>
  <div>
    You have Repositories...
    <div v-for="repo in repos">{{ repo }}</div>
  </div>
</template>

<script>
export default {
  name: "Repositories",
  data: () => ({
    response: "",
    repos: []
  }),
  async mounted() {
    try {
      // eslint-disable-next-line no-console
      const response = await this.$http({
        url: "https://api.github.com/graphql",
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
        },
        method: "post",
        data: {
          query: `{
              viewer {
                repositories(last: 5) {
                  edges {
                    node {
                      id
                      name
                      createdAt
                      updatedAt
                      projectsUrl
                      primaryLanguage {
                        name
                      }
                      stargazers(last: 5) {
                        edges {
                          node {
                            id
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            `
        }
      });
      this.response = response.data.data;
      this.repos = response.data.data.viewer.repositories.edges;
      // eslint-disable-next-line no-console
      console.log(this.repos);
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }
  }
};
</script>

<style scoped></style>
