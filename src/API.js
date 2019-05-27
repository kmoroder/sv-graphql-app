import axios from "axios";

export async function runQuery(query) {
  try {
    const response = await axios({
      url: `${process.env.VUE_APP_API_URL}`,
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
      },
      method: "post",
      data: {
        query: query
      }
    });
    return response;
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}

export async function runMutation(mutation) {
  try {
    const response = await axios({
      url: `${process.env.VUE_APP_API_URL}`,
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
