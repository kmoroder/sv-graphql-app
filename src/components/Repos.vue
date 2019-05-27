<template>
  <div class="repos">
    <h1>Repositories</h1>
    <table>
      <th>Name</th>
      <th>Description</th>
      <th>Created at</th>
      <th>Owner</th>
      <th>Stars</th>
      <tr
        v-for="(rep, idx) in userRepos.nodes"
        :key="idx"
        @click="showProjects(idx)"
        :class="isRepoSelected(idx)"
      >
        <td>{{ rep.name }}</td>
        <td>{{ rep.description }}</td>
        <td>{{ rep.createdAt }}</td>
        <td>{{ rep.owner.login }}</td>
        <td>{{ rep.stargazers.totalCount }}</td>
      </tr>
    </table>
    <div class="totalNo">Total repositories: {{userRepos.totalCount}}</div>

    <div v-if="selectedRepoRowIdx != null" class="projects">
      <h2>Projects</h2>
      <table>
        <th>Name</th>
        <th>Description</th>
        <th>State</th>
        <tr
          v-for="(project, idx) in projects.edges"
          :key="idx"
          @click="showCards(selectedRepoRowIdx, idx)"
          :class="isProjectSelected(idx)"
        >
          <td>{{ project.node.name }}</td>
          <td>{{ project.node.body }}</td>
          <td>{{ project.node.state }}</td>
        </tr>
      </table>
      <div class="totalNo">Total projects: {{projects.totalCount}}</div>
    </div>

    <div v-if="selectedProjectRowIdx != null" class="cards">
      <h3>Cards</h3>
      <button @click="showAddCardForm()">New</button>

      <div v-if="formType != null">
        <div v-if="cards.columns != null">
          <select v-model="formCardProjectColumnId">
            <option disabled value selected>Please select one</option>
            <option
              v-for="(column, idx) in cards.columns"
              v-bind:value="column.id"
              :key="idx"
            >{{ column.name }}</option>
          </select>
          <div>
            <textarea cols="180" rows="10" v-model="formCardNote"></textarea>
          </div>
          <button @click="resetCardForm()">cancel</button>
          <button @click="doFormAction()">ok</button>
        </div>
      </div>

      <table>
        <th>Note</th>
        <th>Column</th>
        <th>Created At</th>
        <th></th>
        <tr v-for="(card, idx) in cards.nodes" :key="idx">
          <td width="70%">{{ card.note }}</td>
          <td width="10%">{{ card.column.name }}</td>
          <td width="10%">{{ card.createdAt }}</td>
          <td width="10%">
            <button @click="showEditCardForm(card)">Edit</button>
            <button @click="deletedCard(card.id)">Delete</button>
          </td>
        </tr>
      </table>
      <div v-if="(cards && cards.nodes)" class="totalNo">Total cards: {{cards.nodes.length}}</div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import * as ApiUtils from "../ApiUtils";

export default {
  name: "MyGithubRepos",
  data: () => ({
    userRepos: [],
    projects: [],
    cards: {},
    selectedRepoRowIdx: null,
    selectedProjectRowIdx: null,
    selectedCard: null,
    formType: null,
    formCardNote: "",
    formCardProjectColumnId: ""
  }),
  async mounted() {
    try {
      const repositories = await ApiUtils.executeQuery(this.getReposQuery());
      this.userRepos = repositories.data.data.viewer.repositories;
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    }
  },
  methods: {
    getReposQuery() {
      return `
        repositories(first:10){
          totalCount
          nodes {
            id
            name
            description
            url
            createdAt
            updatedAt
            stargazers{
              totalCount
            }
          owner {
              login
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
      }`;
    },
    getProjectsQuery(repoName) {
      return `
        repository(name: "${repoName}") {
        projects(first: 30) {
          totalCount
          edges {
            node {
              name
              number
              url
              body
              state
              columns(first: 30) {
                nodes {
                  id
                  name
                }
              }
            }
          }
        }
      }
      `;
    },
    getCardsQuery(repoName, projectNumber) {
      return `
        repository(name: "${repoName}") {
          project(number: ${projectNumber}) {
            columns(first: 30) {
              nodes {
                id
                name
                cards(first: 30) {
                  totalCount
                  nodes {
                    id
                    createdAt
                    note
                    column {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;
    },
    getUpdateCardMutation(
      projectCardId,
      formCardNote,
      formCardProjectColumnId
    ) {
      return `
        mutation UpdateProjectCard{
          updateProjectCard(input:{projectCardId:"${projectCardId}" note:"${formCardNote}"}){
            projectCard{
              id
            }    
          }
          moveProjectCard(input: {cardId: "${projectCardId}=", columnId: "${formCardProjectColumnId}"}) {
            cardEdge {
              node {
                id
              }
            }
          }
      }
      `;
    },
    getAddCardMutation(formCardProjectColumnId, formCardNote) {
      return `
        mutation AddProjectCard{
          addProjectCard(input:{projectColumnId:"${formCardProjectColumnId}" note:"${formCardNote}"}){
            cardEdge{
              node{
                id
              }
            }
          }
        }
      `;
    },
    getDeleteCardMutation(cardID) {
      return `
      mutation DeleteProjectCard{
          deleteProjectCard(input:{cardId:"${cardID}"}){
            deletedCardId    
          }
      }
      `;
    },
    isRepoSelected(idx) {
      return this.selectedRepoRowIdx === idx ? "selected" : "";
    },
    isProjectSelected(idx) {
      return this.selectedProjectRowIdx === idx ? "selected" : "";
    },

    async showProjects(selectedRepoIdx) {
      this.projects = [];
      this.cards = [];
      this.selectedRepoRowIdx = null;
      this.selectedProjectRowIdx = null;
      if (selectedRepoIdx === this.selectedRepoRowIdx) {
        this.selectedRepoRowIdx = null;
        return;
      }
      this.selectedRepoRowIdx = selectedRepoIdx;
      const repoName = this.userRepos.nodes[selectedRepoIdx].name;
      try {
        const repositories = await ApiUtils.executeQuery(
          this.getProjectsQuery(repoName)
        );
        if (!repositories.data.data.viewer.repository) {
          return;
        }
        this.projects = repositories.data.data.viewer.repository.projects;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    async showCards(selectedRepoIdx, selectedProjectIdx) {
      let cards = { nodes: [], columns: [] };
      this.selectedProjectRowIdx = selectedProjectIdx;
      const repoName = this.userRepos.nodes[selectedRepoIdx].name;
      const projectNumber = this.projects.edges[selectedProjectIdx].node.number;
      try {
        const cardsResponse = await ApiUtils.executeQuery(
          this.getCardsQuery(repoName, projectNumber)
        );
        const cardNodes =
          cardsResponse.data.data.viewer.repository.project.columns.nodes;
        _.each(cardNodes, node => {
          cards.nodes = _.concat(cards.nodes, node.cards.nodes);
          cards.columns = _.concat(cards.columns, {
            id: node.id,
            name: node.name
          });
        });
        this.cards = cards;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    resetCardForm() {
      this.formType = null;
      this.formCardNote = "";
      this.formCardProjectColumnId = "";
    },

    async reloadProjects() {
      const selectedRepoRowIdx = this.selectedRepoRowIdx;
      const selectedProjectRowIdx = this.selectedProjectRowIdx;
      await this.showProjects(selectedRepoRowIdx);
      this.showCards(selectedProjectRowIdx);
    },

    async reloadCards() {
      this.showCards(this.selectedRepoRowIdx, this.selectedProjectRowIdx);
    },

    showAddCardForm() {
      this.formType = "add";
    },

    showEditCardForm(card) {
      this.formType = "update";
      this.formCardNote = card.note;
      this.formCardProjectColumnId = card.column.id;
      this.selectedCard = card;
    },

    async doFormAction() {
      switch (this.formType) {
        case "add":
          await this.addCard();
          break;
        case "update":
          await this.updateCard();
          break;

        default:
          break;
      }
    },

    async addCard() {
      if (this.formType && this.formCardNote && this.formCardProjectColumnId) {
        const mutation = this.getAddCardMutation(
          this.formCardProjectColumnId,
          this.formCardNote
        );
        await ApiUtils.executeMutation(mutation);
        this.resetCardForm();
        await this.reloadCards();
      }
    },

    async updateCard() {
      if (this.formType && this.formCardNote && this.formCardProjectColumnId) {
        const mutation = this.getUpdateCardMutation(
          this.selectedCard.id,
          this.formCardNote,
          this.formCardProjectColumnId
        );
        await ApiUtils.executeMutation(mutation);
        this.resetCardForm();
        await this.reloadCards();
      }
    },
    async deletedCard(cardID) {
      const mutation = this.getDeleteCardMutation(cardID);
      await ApiUtils.executeMutation(mutation);
      await this.reloadCards();
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
}
th {
  background-color: #eee;
}
td {
  border-bottom: 1px solid grey;
}

.repos {
  margin-left: 0px;
}
.projects {
  margin-top: 50px;
  margin-left: 50px;
}
.cards {
  margin-top: 50px;
  margin-left: 100px;
}

.totalNo {
  margin-top: 20px;
  font-weight: 700;
  float: right;
}
.selected {
  background-color: #b8d9f0;
}
</style>
