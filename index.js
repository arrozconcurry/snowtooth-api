const { ApolloServer } = require("apollo-server");

const lifts = require('./data/lifts.json')
const trails = require('./data/trails.json')

console.log(`Build your GraphQL Server Here!`)

const typeDefs = `
  type Lift {
    id: ID
    name: String
    satus: LiftStatus
    capacity: Int
    night: Boolean
    elevationGain: Int
    trailAccess: [Trail!]!
  }
  type Trail {
    id: ID
    name: String
    status: TrailStatus
    difficulty: String
    groomed: Boolean
    trees: Boolean
    night: Boolean
    accessByLifts: [Lift!]!
  }
  enum LiftStatus {
    OPEN
    CLOSED
    HOLD
  }
  enum TrailStatus {
    OPEN
    CLOSED
  }
  type Query {
    "YOU CAN PUTS DOCS FOR SCHEMA!!"
    liftCount: Int!
    trailCount: Int!
    allLifts(status: LiftStatus): [Lift!]!
    allTrails(status: TrailStatus): [Trail!]!
  }
  type Mutation {
    setLiftStatus(id: ID! status: LiftStatus!): Lift!
    setTrailStatus(id: ID! status: TrailStatus!): Trail!
  }
`

// CREATE A setLiftStatus Mutation
// Create a setTrailStatus Mutation

const resolvers = {
  Query: {
    allLifts: (parent, {status}) => {
      if (!status) {
        return lifts 
      } else {
        return lifts.filter(lift => lift.status === status)
      }
    },
    allTrails: (parent, {status}) => {
      if (!status) {
        return trails
      } else {
        return trails.filter(trail => trail.status === status)
      }
    },
    liftCount: () => lifts.length,
    trailCount: () => trails.length
  },
  Mutation: {
    setLiftStatus: (parent, {id, status}) => {
      let updatedLift = lifts.find(lift => id === lift.id)
      updatedLift.status = status
      return updatedLift
    },
    setTrailStatus: (parent, {id, status}) => {
      let updatedTrail = trails.find(trail => id === trail.id)
      updatedTrail.status = status
      return updatedTrail
    }
  },
  Lift: {
    trailAccess: parent =>
      parent.trails.map(id => trails.find(t=> id === t.id)).filter(x => x)
  },
  Trail: {
    accessByLifts: parent =>
      parent.lift.map(id => lifts.find(l=>id === l.id)).filter(x => x)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolves
})
server.listen().then(console.log())