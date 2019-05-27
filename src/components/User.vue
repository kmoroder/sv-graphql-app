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
        {{ viewer.avatarUrl }} is your avatar url
        {{ viewer.login }} is your login
        {{ viewer.bio }} is your bio
      </ul>
    </template>
  </div>
</template>


<script>
import gql from 'graphql-tag';
// GraphQL query
const viewerQuery = gql`
  query {
    viewer {
      avatarUrl
      login
      bio
    }
  }
`;
// Vue component definition
export default {
  // Local state
  data: () => ({
    message: 'Hello Git User',
    // You can initialize the 'posts' data here
    viewer: {},
    loading: 0,
  }),
  // Apollo GraphQL
  apollo: {
    // Local state 'posts' data will be updated
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
};
</script>

<style scoped></style>
