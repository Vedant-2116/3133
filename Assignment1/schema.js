const { gql } = require("apollo-server-express");

exports.typeDefs = gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    salary: Float!
  }

  type User {
    id: ID
    userName: String!
    email: String!
    password: String!
  }

  type Query {
    getEmployees: [Employee]
    getEmployeeById(employeeId: ID!): Employee
    login(userName: String!, password: String!): User
  }

  type Mutation {
    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      gender: String!
      salary: Float!
    ): Employee

    updateEmployee(
      employeeId: ID!
      firstName: String!
      lastName: String!
      email: String!
      salary: Float!
    ): Employee

    deleteEmployee(employeeId: ID!): Employee

    signUp(userName: String!, email: String!, password: String!): User
  }
`;
