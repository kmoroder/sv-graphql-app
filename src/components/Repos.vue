<template>
  <div>
    <h2>Here my Repositories...</h2>
    <ul class="repos">
      <li v-bind:key="repo.id" v-for="repo in repos" @click="showRepo(repo)">
        <img :src="getThumbs()">
        <h4>{{ repo.node.name }} ( {{ repo.node.stargazers.totalCount }} stars)</h4>
        <p>{{ repo.node.primaryLanguage.name }}</p>
        <p>creation date: {{ repo.node.createdAt | moment }}</p>
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
      return "https://picsum.photos/75?blur=1&random=" + Math.random();
    },
    showRepo(repo) {
      alert(repo.node.id);
    }
  },
  computed: {},
  filters: {
    moment: function(date) {
      // return moment(date).format("MMMM Do YYYY, h:mm:ss a");
      return moment(date).format("L");
    }
  },
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

ul.repos {
  list-style-type: none;
  width: 400px;
  margin: auto;
  margin-top: 50px;
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
