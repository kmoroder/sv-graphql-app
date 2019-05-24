<template>
  <div>
    Here my Repositories...
    <ul>
      <li v-bind:key="repo.id" v-for="repo in repos" @click="showRepo(repo)">
        <img :src="getThumbs()">
        <h3>{{ repo.node.name }} ( {{ repo.node.stargazers.totalCount }} stars)</h3>
        <p>{{ repo.node.primaryLanguage.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Repositories",
  data: () => ({
    response: "",
    repos: []
  }),
  methods: {
    getThumbs() {
      return "https://picsum.photos/75?random=" + Math.random();
    },
    showRepo(repo) {
      alert(repo.node.id);
    }
  },
  computed: {},
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
    repositories(last: 10) {
      edges {
        node {
          id
          name
          createdAt
          projects(last: 5) {
            totalCount
            edges {
              node {
                body
                name
                columns(last: 100) {
                  edges {
                    node {
                      cards {
                        edges {
                          node {
                            id
                            note                            
                          }
                        }
                      }
                      name
                    }
                  }
                }
                url
                number
                name
                state
              }
            }
          }
          primaryLanguage {
            name
          }
          stargazers(last: 15) {
            totalCount
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

<style scoped>
* {
  margin: 0;
  padding: 0;
}

div {
  margin: 20px;
}

ul {
  list-style-type: none;
  width: 700px;
}

h3 {
  font: bold 20px/1.5 Helvetica, Verdana, sans-serif;
}

li img {
  float: left;
  margin: 0 15px 0 0;
}

li p {
  font: 200 12px/1.5 Georgia, Times New Roman, serif;
}

li {
  padding: 10px;
  overflow: auto;
}

li:hover {
  background: #eee;
  cursor: pointer;
}
</style>
