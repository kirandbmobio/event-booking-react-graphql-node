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
};
