export default `
    scalar Date

    enum ComponentType {
        container
        presentional
    }

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

    type Component {
        _id: String!
        name: String!
        projectId: String!
        style: ComponentType!
        children: [String]
        state: [String]
        props: [String]
        callbacks: [String]
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
        createComponent(
            name: String!, 
            projectId: String!, 
            style: ComponentType!, 
            children: [String],
            state: [String],
            props: [String],
            callbacks: [String]
        ) : Component!
    }

`;


