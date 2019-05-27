<template>
    <button @click="updatestatus">Updatestatus</button>
</template>

<script>
import gql from 'graphql-tag';
const changestatusMutation = gql`
mutation changeUserStatus($newstatusmessage: String) { 
    changeUserStatus(input: {message: $newstatusmessage}) {
      status {
        id
        message
      }
    }
  }
`;
export default {
  // Attribute
  props: {
    newStatusMessage: {
      type: String,
    },
  },
  methods: {
    updatestatus() {
      // Mutation
      this.$apollo.mutate({
        mutation: changestatusMutation,
        variables: {
          newstatusmessage: this.newStatusMessage,
        },
      });
    },
  },
};
</script>