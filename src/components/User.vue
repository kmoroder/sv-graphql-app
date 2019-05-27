<template>
  <div>
    <img :src="this.avatarUrl" width="125" />
    <div>
      <div>username: {{ login }}</div>
      <div>status: {{ status }}</div>
      <div>bio: {{ bio }}</div>
      <div>
        <label>new status</label>
        <input type="text" v-model="newStatus" />
        <button @click="updateUserStatus">ChangeStatus</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from "../API";
import _ from "lodash";

export default {
  name: "HelloWorld",
  data: () => ({
    isLoading: false,
    avatarUrl: "",
    login: "Loading!",
    bio: "",
    status: "",
    newStatus: ""
  }),
  methods: {
    gqlBuilderLoadUser() {
      return `query { viewer { avatarUrl login bio status{message}} }`;
    },
    gqlBuilderUpdateStatus(newStatus) {
      return `mutation ChangeUserStatus {
                changeUserStatus(input: {message: "${newStatus}"}){
                clientMutationId
              } 
            }
      `;
    },
    async loadUserData() {
      this.isLoading = true;
      try {
        const response = await Api.runQuery(this.gqlBuilderLoadUser());
        this.login = response.data.data.viewer.login;
        this.avatarUrl = response.data.data.viewer.avatarUrl;
        this.bio = response.data.data.viewer.bio;
        this.status = response.data.data.viewer.status.message;
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
      this.isLoading = false;
    },
    async updateUserStatus() {
      this.isLoading = true;
      try {
        await Api.runMutation(this.gqlBuilderUpdateStatus(this.newStatus));
        await this.loadUserData();
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
      this.isLoading = false;
    }
  },
  async mounted() {
    await this.loadUserData();
  }
};
</script>

<style scoped></style>
