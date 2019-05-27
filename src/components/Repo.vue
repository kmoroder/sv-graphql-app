<template>
  <div class="repo">
    <h4>Repository</h4>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <p class="font-weight-bold">name:</p>
          <span v-if="this.repo">{{ this.repo.name }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">description:</p>
          <span v-if="this.repo">{{ this.repo.description }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">primaryLanguage:</p>
          <span v-if="this.repo">{{ this.repo.primaryLanguage.name }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">creation date:</p>
          <span v-if="this.repo">{{ this.repo.createdAt | moment }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">Stars:</p>
          <span v-if="this.repo">{{ this.repo.stargazers.totalCount }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">watchers:</p>
          <span v-if="this.repo">{{ this.repo.watchers.totalCount }}</span>
        </div>
        <div class="row">
          <p class="font-weight-bold">LastProject:</p>
          <span v-if="lastProject">{{ this.lastProject.name }}</span>
        </div>
      </div>
    </div>
    <br />
    <h4>Cards</h4>

    <div class="cards">
      <ul class="columns">
        <li v-bind:key="c.node.id" v-for="c in lastProjectColumns">
          <h6>{{ c.node.name }}</h6>
          <p>{{ getLastCardDescription(c.node) || "none" }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";

export default {
  name: "Repo",
  props: {
    repo: {
      required: true
    }
  },
  data: () => ({}),
  methods: {
    getLastCardDescription(column) {
      if (column && column.cards) {
        return _.truncate(_.last(column.cards.edges).node.note, {
          length: 50
        });
      } else return null;
    }
  },
  computed: {
    lastProject() {
      if (this.$props.repo && this.$props.repo.projects) {
        const p = _.last(this.$props.repo.projects.edges);
        return p ? p.node : null;
      } else return null;
    },
    lastProjectColumns() {
      if (this.lastProject) {
        return this.lastProject.columns.edges;
      } else return null;
    }
  },
  filters: {
    moment: function(date) {
      // return moment(date).format("MMMM Do YYYY, h:mm:ss a");
      return moment(date).format("L");
    }
  },
  async created() {
    // console.log("created...");
  },
  async mounted() {
    // eslint-disable-next-line
    // console.log("mounted...");
  },
  async updated() {
    // console.log("updated...: lastProject: ", this.lastProject);
    // console.log("updated... columns: ", this.lastProjectColumns);
  }
};
</script>

<style scoped>
.card {
  margin-top: 50px;
}
.repo {
  min-width: 400px;
}
ul.columns {
  list-style-type: none;
  text-align: left;
  margin-top: 30px;
  padding-left: 0px;
}
ul.columns li p {
  margin-left: 20px;
}
</style>
