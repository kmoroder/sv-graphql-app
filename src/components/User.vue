<template>
  <div>
    <div>
      <img :src="avatarUrl" class="avatar">
      <div class="name">{{ name }}</div>
      <div class="login">{{ login }}</div>
      <div>
        <a :href="`mailto:${this.email}`">{{ email }}</a>
      </div>
      <div>{{ location }}</div>
      <div>
        <a :href="`${this.websiteUrl}`" target="_blank">{{ company }}</a>
      </div>
      <div class="bio">{{ bio }}</div>
      <div class="status">
        <div>
          <span class="title">Status</span>
          <span class="busy" v-if="status.indicatesLimitedAvailability">(busy)</span>
          <span class="editStatus" @click="showChangeStatusForm()">(edit)</span>
        </div>
        <div v-if="emojiList[emojiName]">{{ emojiList[emojiName].emoji}} {{status.message}}</div>

        <div v-if="isChangeStatusFormVisible" class="formChangeStatus">
          <div>
            <span>Emoji:</span>
            <select @change="onEmojiChanged($event)">
              <option disabled value selected>Please select one</option>
              <option
                v-for="(emoji, idx) in emojiList"
                v-bind:value="emoji.name"
                :key="idx"
              >{{ emoji.emoji }}</option>
            </select>
          </div>
          <div>
            <span>Message:</span>
            <input type="text" v-model="newStatus.message">
          </div>
          <div>
            <span>Busy:</span>
            <input type="checkbox" v-model="newStatus.indicatesLimitedAvailability">
          </div>
          <div>
            <button @click="resetChangeStatusForm()">cancel</button>
            <button @click="saveStatus()">ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as ApiUtils from "../ApiUtils";
import _ from "lodash";
import gemoji from "gemoji";

export default {
  name: "HelloWorld",
  data: () => ({
    avatarUrl: "",
    login: "Loading!",
    name: "",
    location: "",
    bio: "",
    email: "",
    websiteUrl: "",
    company: "",
    status: "",
    userRepos: {},
    isChangeStatusFormVisible: false,
    emojiList: {},
    emojiName: "",
    newStatus: { emoji: "", indicatesLimitedAvailability: false, message: "" }
    // userStatusText: "",
    // userStatusEmoji: "",
    // userStatusBusy: false
  }),

  async mounted() {
    this.emojiList = gemoji.name;
    const result = await this.loadUserData();
  },

  methods: {
    getUserQuery() {
      return `
        avatarUrl 
        login 
        bio
        name 
        location
        email 
        websiteUrl
        company 
        status {
          id
          emoji
          message
          indicatesLimitedAvailability
        }
      `;
    },
    getUserStatusChangeMutation(status) {
      return `
      mutation ChangeUserStatus {
        changeUserStatus(input: {emoji: "${status.emoji}", message:"${
        status.message
      }", limitedAvailability:${status.indicatesLimitedAvailability}}) {
        status{
          indicatesLimitedAvailability
          emoji
          message
        }
        }
      }
      `;
    },
    async loadUserData() {
      try {
        const response = await ApiUtils.executeQuery(this.getUserQuery());
        this.login = response.data.data.viewer.login;
        this.avatarUrl = response.data.data.viewer.avatarUrl;
        this.bio = response.data.data.viewer.bio;
        this.location = response.data.data.viewer.location;
        this.email = response.data.data.viewer.email;
        this.name = response.data.data.viewer.name;
        this.websiteUrl = response.data.data.viewer.websiteUrl;
        this.company = response.data.data.viewer.company;
        this.emojiName = _.replace(
          response.data.data.viewer.status.emoji,
          new RegExp(":", "g"),
          ""
        );
        this.status = response.data.data.viewer.status;
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      }
    },
    onEmojiChanged(event) {
      console.log(event.target.value);
      this.newStatus.emoji = `:${event.target.value}:`;
    },
    showChangeStatusForm() {
      this.newStatus = {
        // emoji: this.emojiName,
        emoji: this.status.emoji,
        indicatesLimitedAvailability: this.status.indicatesLimitedAvailability,
        message: this.status.message
      };
      this.isChangeStatusFormVisible = true;
    },
    resetChangeStatusForm() {
      this.newStatus = {
        emoji: "",
        indicatesLimitedAvailability: false,
        message: ""
      };
      this.isChangeStatusFormVisible = false;
    },
    async saveStatus() {
      console.log(this.newStatus);
      await ApiUtils.executeMutation(
        this.getUserStatusChangeMutation(this.newStatus)
      );
      this.resetChangeStatusForm();
      await this.loadUserData();
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 100%;
  border-radius: 50%;
}
.name {
  font-size: 1.5em;
  font-weight: 700;
}
.login {
  font-size: 1em;
  font-weight: 700;
}

.company {
  margin-top: 20px;
}

.bio {
  margin-top: 20px;
}

.status {
  margin-top: 20px;
}

.status .editStatus {
  margin-left: 10px;
  cursor: pointer;
  text-decoration: underline;
}

.status .title {
  font-size: 1em;
  font-weight: 700;
}
.status .busy {
  color: red;
}
.formChangeStatus {
  border: 1px solid #2c3e50;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  background-color: rgba(44, 62, 68, 0.1);
}
.formChangeStatus select {
  /* width: 50px; */
  /* font-size: 16px; */
}
</style>
