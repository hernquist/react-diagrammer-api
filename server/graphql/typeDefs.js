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
        name: String!
        password: String!
    }

    type Project {
        _id: String!
        userId: String!
        name: String!
        description: String!
        dateCreated: Date!
        dateVisited: Date!
        components: [Component]
    }

    type Component {
        _id: String!
        name: String!
        iteration: Int!
        projectId: String!
        style: ComponentType!
        placement: Placement!
        children: [String]
        state: [String]
        props: [String]
        callbacks: [String]
    }

    type Query {
        getAuthUser: User
        users: [User!]!
        user(email: String!): User!
        components: [Component]
        component(_id: String): Component
        getUserById(_id: String!): User!
        projectsByUserId(userId: String!): [Project!]!
        componentsByProjectId(projectId: String!): [Component!]!
    }

    type Mutation {
        login(email: String, password: String): String
        signup(name: String, email: String, password: String): String
        createProject(userId: String!, name: String!, description: String!): Project!
        createComponent(
            name: String!, 
            projectId: String!,
            iteration: Int!, 
            style: ComponentType!,
            placement: Placement!, 
            children: [String],
            state: [String],
            props: [String],
            callbacks: [String]
        ) : Component!
    }
`;