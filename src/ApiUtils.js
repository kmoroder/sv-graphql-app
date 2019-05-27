import axios from "axios";

export async function executeQuery(query) {
  try {
    const response = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
      },
      method: "post",
      data: {
        query: `query {
            viewer {
              ${query}
            }
          }`
      }
    });
    return response;
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}

export async function executeMutation(mutation) {
  try {
    const response = await axios({
      url: "https://api.github.com/graphql",
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
      },
      method: "post",
      data: {
        query: mutation
      }
    });
    return response;
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}