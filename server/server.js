import express from "express";
import schema from "./graphql/schema";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express(); 
const dev = process.env.NODE_ENV === "development";

const homePath = '/graphiql';

app.use(
  homePath,
  graphiqlExpress({
    endpointURL: '/graphql'
  })
);

app.use('/graphql', 
  bodyParser.json(), 
  graphqlExpress( (req, res) => {
    return ({
      schema,
      context: { 
        test: "test123"
      },
    })
  })
);

app.use(morgan("dev"));

app.use("/", (req, res) => {
  res.json("Go to /graphiql to test your queries and mutations!");
});

const server = app.listen(3000, () => {
  const { port } = server.address();
  console.info(`\n\nExpress listen at http://localhost:${port} \n`);
});
