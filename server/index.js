const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')

const database = require('./database')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const typeDefs = `
  type Pin { title: String!, link: String!, image: String!, id: Int! }
  type Query { pins: [Pin] }
`

const resolvers = {
  Query: {
    pins: async () => {
      const pins = await database('pins').select()
      return pins
    },
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
const server = express()

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://${HOST}:${PORT}/subscriptions`,
  })
)

server.listen(PORT, () => {
  console.log(`Go to http://${HOST}:${PORT}/graphiql to run queries!`)
})
