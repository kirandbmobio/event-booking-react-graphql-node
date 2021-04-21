const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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

        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        type resObject {
            message: String!
            status: Boolean
        }

        input EventInput {
            title: String
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
            users: [User!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            updateEvent(eventId: ID!, eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            updateUser(userId: ID!, userInput: UserInput): User
            changePassword(userId: ID!, email: String!, password: String!): User
            deleteUser(userId: ID!): resObject!
            bookEvent(eventId: ID!): Booking!
            updateBookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
            cancelEvent(eventId: ID!): resObject!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
