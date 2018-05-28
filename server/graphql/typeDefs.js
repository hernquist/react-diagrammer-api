export default `
    scalar Date

    enum ComponentType {
        container
        presentational
    }

    enum Placement {
        root
        unassigned
        child
        end
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
        placement: Placement!
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
        componentsByProjectId(projectId: String!): [Component!]!
    }

    type Mutation {
        createUser(email: String!): User!
        createProject(userId: String!, name: String!, description: String!): Project!
        createComponent(
            name: String!, 
            projectId: String!, 
            style: ComponentType!,
            placement: Placement!, 
            children: [String],
            state: [String],
            props: [String],
            callbacks: [String]
        ) : Component!
    }
`;