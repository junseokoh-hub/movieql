import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for  a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allPopularMovies: [Popular!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movieDetail(movieId: ID!): MovieDetail
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Popular {
    backdrop_path: String
    id: Int!
    original_title: String
    overview: String
    popularity: Float
    poster_path: String
    release_date: String
    title: String
    vote_average: Float
    vote_count: Int
  }
  type MovieDetail {
    backdrop_path: String
    id: Int!
    original_title: String
    overview: String
    popularity: Float
    poster_path: String
    vote_average: Float
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
    },
    allPopularMovies() {
      return fetch(
        `${process.env.API_URL}popular?api_key=${process.env.API_KEY}&language=en-US`,
      )
        .then((response) => response.json())
        .then((json) => json.results);
    },
    movieDetail(_, { movieId }) {
      return fetch(
        `${process.env.API_URL}${movieId}?api_key=${process.env.API_KEY}&language=en-US`,
      ).then((response) => response.json());
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at ${url}`);
