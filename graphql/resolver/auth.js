const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const { user, events, singleEvent } = require("./merge");

module.exports = {
  createUser: async (args) => {
    try {
      let alreadyExist = await User.findOne({
        email: args.userInput.email,
      });
      if (alreadyExist) {
        throw new Error("User Exists Already");
      } else {
        let hashPass = await bcrypt.hash(args.userInput.password, 12);
        let userValue = await new User({
          email: args.userInput.email,
          password: hashPass,
        });
        let newUser = await userValue.save();
        return newUser;
      }
    } catch (err) {
      return err;
      //   throw err;
    }
  },

  login: async ({ email, password }) => {
    try {
      let existUser = await User.findOne({ email: email });
      console.log(existUser);
      if (!existUser) {
        throw new Error("User doesn't exist!");
      }
      const isEqual = await bcrypt.compare(password, existUser.password);
      console.log(isEqual);
      if (!isEqual) {
        throw new Error("Password is Incorrect!");
      }
      let token = jwt.sign(
        {
          userId: existUser.id,
          email: existUser.email,
        },
        "secretKey",
        { expiresIn: "1h" }
      );

      return {
        userId: existUser.id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      return err;
    }
  },

  users: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      let users = await User.find();
      return users.map((singleUser) => {
        return {
          ...singleUser._doc,
          createdEvents: events.bind(this, singleUser._doc.createdEvents),
        };
      });
    } catch (err) {
      return err;
    }
  },

  updateUser: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      let alreadyExist = await User.findOne({ _id: args.userId });
      if (!alreadyExist) {
        throw new Error("User Doesn't Exists.");
      } else {
        let hashPass;
        if (args.userInput.password) {
          hashPass = await bcrypt.hash(args.userInput.password, 12);
        }
        await User.updateOne(
          { _id: args.userId },
          { email: args.userInput.email }
        );
        let updatedUser = await User.findById(args.userId);
        console.log(updatedUser);
        return {
          ...updatedUser._doc,
          createdEvents: events.bind(this, updatedUser.createdEvents),
        };
      }
    } catch (err) {
      return err;
    }
  },
};
