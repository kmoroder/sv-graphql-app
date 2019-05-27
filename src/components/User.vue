<template>
  <div class="post-list">
    {{ message }}
    <!-- If there is one or more queries loading -->
    <template v-if="loading > 0">
      Loading
    </template>
    <!-- Actual view -->
    <template v-else>
      <ul>
        <p>{{ viewer.avatarUrl }} is your avatar url</p>
        <p>{{ viewer.login }} is your login</p>
        <p>{{ viewer.bio }} is your bio</p>
        <li v-for="repo in publicRepos" :key="repo.id">
          {{ repo.name }} created {{ repo.createdAt }}
        </li>
        <p>
          <input v-model="newstatusmessage" placeholder="new status here">
          <status-changer :newStatusMessage="newstatusmessage"></status-changer>
        </p>
      </ul>
    </template>
  </div>
</template>


<script>
import gql from 'graphql-tag';
import StatusChanger from "./StatusChanger.vue"
// GraphQL query
const viewerQuery = gql`
  query {
    viewer {
      avatarUrl
      login
      bio
      repositories(first:5) {
        nodes {
          id
          name
          createdAt
          isPrivate
        }
      }
    }
  }
`;
// Vue component definition
export default {
  components: {
    StatusChanger,
  },
  // Local state
  data: () => ({
    message: 'Hello Git User',
    newstatusmessage: 'Starting status',
    // You can initialize the 'posts' data here
    viewer: {},
    loading: 0,
  }),
  // Apollo GraphQL
  apollo: {
    // Local state 'viewer' data will be updated
    // by the GraphQL query result
    viewer: {
      // GraphQL query
      query: viewerQuery,
      // Will update the 'loading' attribute
      // +1 when a new query is loading
      // -1 when a query is completed
      loadingKey: 'loading',
    },
  },
    // Computed properties
  computed: {
    publicRepos() {
      return this.viewer.repositories.nodes.filter(
        function (item) {return !item.isPrivate});
    }
  },
};
</script>

<style scoped></style>
