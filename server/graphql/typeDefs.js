export default `

    type User {
        _id: String!
        email: String!
    }

    type Query {
        users: [User!]!
        user(email: String!): User!
        getUserById(_id: String!): User!
    }

    type Mutation {
        createUser(email: String!): User!
    }
    
`;


