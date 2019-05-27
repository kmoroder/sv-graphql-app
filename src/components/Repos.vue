<template>
  <div class="row">
    <div class="col">
      <h4>Here my Repositories...</h4>
      <ul class="repos">
        <li
          v-bind:key="repo.id"
          v-for="repo in repos"
          @click="showRepo(repo.node)"
        >
          <img :src="getThumbs()" />
          <h4>
            {{ repo.node.name }} ( {{ repo.node.stargazers.totalCount }} stars)
          </h4>
          <p>{{ repo.node.description }}</p>
        </li>
      </ul>
    </div>

    <Repo :repo="this.selectedRepoDetails"></Repo>
  </div>
</template>

<script>
import moment from "moment";
import Repo from "./Repo.vue";

export default {
  name: "Repos",
  components: {
    Repo
  },
  data: () => ({
    response: "",
    repos: [],
    selectedRepo: null,
    selectedRepoDetails: null
  }),
  methods: {
    getThumbs() {
      return "https://picsum.photos/65?blur=1&random=" + Math.random();
    },
    showRepo(repo) {
      this.selectedRepo = repo;
      this.fetchRepoDetails(this.selectedRepo.name);
    },
    async fetchMyRepos() {
      try {
        const limit = 20;
        const q = `
        {
          viewer {
            name
            repositories(last: ${limit}) {
              edges {
                node {
                  id
                  name
                  description
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
        }`;

        const response = await this.$http({
          url: "https://api.github.com/graphql",
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
          },
          method: "post",
          data: {
            query: q
          }
        });
        this.response = response.data.data;
        this.repos = response.data.data.viewer.repositories.edges;
        // eslint-disable-next-line no-console
        console.log(this.response);
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
    },
    async fetchRepoDetails(repoName) {
      try {
        const limit = 20;
        const q = `
        {
         viewer {
            repository(name:"${repoName}"){
              name
              createdAt
              description
              forkCount
              isPrivate
              primaryLanguage {
                name
              }
              languages(first:${limit}) {
                edges {
                  node {
                    name
                  }
                }
              }
              projects(first:${limit}) {
                edges {
                  node {
                    name
                    body
                    columns(first: ${limit}) {
                      totalCount
                      edges {
                        node {
                          id
                          name
                          purpose
                          cards(last:${limit}) {
                            totalCount
                            edges {
                              node {
                                id
                                note
                              }
                            }
                          }
                        }
                      }
                    }
                    
                  }
                }
              }
              stargazers {
                totalCount
              }
              watchers{
                totalCount
              }
            }
          }
        }`;

        const response = await this.$http({
          url: "https://api.github.com/graphql",
          headers: {
            Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
          },
          method: "post",
          data: {
            query: q
          }
        });
        const res = response.data.data;
        // eslint-disable-next-line no-console
        if (res && res.viewer) {
          this.selectedRepoDetails = null;
          this.selectedRepoDetails = res.viewer.repository;
        } else {
          this.selectedRepoDetails = null;
        }
        // eslint-disable-next-line no-console
        // console.log(this.selectedRepoDetails);
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
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
    this.fetchMyRepos();
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
  width: 500px;
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
