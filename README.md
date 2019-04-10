# SV GraphQL App 

A Github GUI app using Vue.js and GraphQL

## Purpose

The purpose of this assignment is to understand how GraphQL can be used as an alternative to REST for API development. 

As you will see through interaction with the Github API, some of the benefits of choosing GraphQL include type safety, generated documentation, and predictable responses. 

By the end of this activity, you will have experience writing queries and mutations in a simple Vue.js app. 

## Project setup

### Install dependencies
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### API Keys

You will need to create an access token for use in the API. Make sure you are storing this in your environment variables and don't accidentally hardcode it into your app!

[How to create a personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line)

## Basic Requirements

Include the following functionality in your app. 

### Queries
1. [ STARTED ] Display user data
1. List all public repositories (include information like creation date, stars, etcetera)
1. View all project cards in current repository

### Mutations
1. Update user status on Github
1. Add project card
1. Update project card
1. Delete project card


For at least one of the queries/mutations above, add in:
1. An [argument](https://graphql.org/learn/queries/#arguments)
1. A [directive](https://graphql.org/learn/queries/#directives)

## Options

This repository has been built using the basic Vue CLI setup with JavaScript. You are welcome to use a different setup (for example, using SASS, TypeScript, Vuex, etc)– simply create a new app using the [vue-cli](https://cli.vuejs.org/).

If you're feeling super adventurous, you may also want to try using [Apollo](https://github.com/Akryum/vue-apollo) with GraphQL.

## Useful Resources

- Test queries with the Github GraphQL IDE: https://developer.github.com/v4/explorer/
- GraphQL documentation: https://graphql.org/learn/
- Github API documentation: https://developer.github.com/v3/

## Submission instructions

- When finished developing your app, make a pull request against the master fork /  your branch
- Answer the following questions in your pull request:
  - What was confusing or challenging?
  - What questions do you still have?

