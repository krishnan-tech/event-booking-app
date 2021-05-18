import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    events: [Event!]!
    bookings: [Booking!]!
  }

  type Mutation {
    createEvent(eventInput: EventInput!): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
  }
`;
