export default `

type User {
    _id: String!
    email: String!
}

type Query {
    users: [User!]!
}

type Mutation {
    createUser(email: String!): User!
}

    `;


