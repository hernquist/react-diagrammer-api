export default `
    scalar Date

    type User {
        _id: String!
        email: String!
    }

    type Project {
        _id: String!
        userId: String!
        name: String!
        description: String!
        dateCreated: Date!
        dateVisited: Date!
    }

    type Query {
        users: [User!]!
        user(email: String!): User!
        getUserById(_id: String!): User!
        projectsByUserId(userId: String!): [Project!]!
    }

    type Mutation {
        createUser(email: String!): User!
        createProject(userId: String!, name: String!, description: String!): Project!
    }

`;


