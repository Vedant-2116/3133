const Employee = require("./models/Employee");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "101398199@georgbrown.ca";

exports.resolvers = {
  Query: {
    getEmployees: async (parent, args) => {
      return await Employee.find({});
    },
    getEmployeeById: async (parent, args) => {
      return Employee.findOne({ _id: args.employeeId });
    },
    login: async (_, {userName, password}) => {
      const user = await User.findOne({ userName: userName.toLowerCase() });
      if(!user){
        throw new Error("User does not exist");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        throw new Error("Invalid credentials");
      }

      return user
    },
  },
  Mutation: {
    addEmployee: async (parent, args) => {
      let newEmployee = new Employee({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        gender: args.gender,
        salary: args.salary,
      });
      return newEmployee.save();
    },
    updateEmployee: async (parent, args) => {
      if (!args.employeeId) {
        return null; // You might want to return something indicating an error or missing input
      }
      
      try {
        const updatedEmployee = await Employee.findOneAndUpdate(
          { _id: args.employeeId }, // Corrected to use employeeId
          {
            $set: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              gender: args.gender,
              salary: args.salary,
            },
          },
          { new: true }
        );
    
        return updatedEmployee;
      } catch (error) {
        console.error("Something went wrong when updating the employee:", error);
        throw new Error("Failed to update employee");
      }
    },    
    deleteEmployee: async (parent, args) => {
      if (!args.employeeId) {
        return JSON.stringify({
          status: false,
          message: "Please provide the employeeId",
        });
      }
      return await Employee.findOneAndDelete(args.id);
    },
    signUp: async (parent, args) => {
      let newUser = new User({
        userName: args.userName,
        email: args.email,
        password: args.password,
      });
      return newUser.save();
    },
  },
};
