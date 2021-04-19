const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const { user, events, singleEvent } = require("./merge");
const { findById } = require("../../models/event");

module.exports = {
  events: (args, req) => {
    return Event.find()
      .then((eventsData) => {
        return eventsData.map((event) => {
          return {
            ...event._doc,
            date: new Date(event._doc.date).toISOString().slice(0, 10),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      // const event = {
      //   _id: Math.random().toString(),
      //   title: args.eventInput.title,
      //   description: args.eventInput.description,
      //   price: +args.eventInput.price,
      //   date: args.eventInput.date,
      // };
      let event = await new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });
      // events.push(event);

      let newEvent = await event.save();
      let userData = await User.findById(req.userId);
      if (!userData) {
        throw new Error("User not found");
      } else {
        userData.createdEvents.push(event);
        await userData.save();
        console.log(newEvent);
        // user.bind(this, newEvent._doc.creator);
        return {
          ...newEvent._doc,
          date: new Date(newEvent._doc.date).toISOString().slice(0, 10),
          creator: user.bind(this, newEvent._doc.creator),
        };
        // return {
        //   ...newEvent,
        //   creator: user.bind(this, newEvent._doc.creator),
        // };
      }
      // if(user) {
      //     throw new Error('User Exists Already.')
      // }
      // return event
      //   .save()
      //   .then((result) => {
      //     console.log(result);
      //     return { ...result._doc };
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     throw err;
      //   });

      // return event;
    } catch (err) {
      return err;
    }
  },

  updateEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      let alreadyExist = await Event.findById(args.eventId);
      if (!alreadyExist) {
        throw new Error("Event Doesn't Exists.");
      }
      args.eventInput.creator = req.userId.toString();
      console.log(args.eventInput);
      await Event.updateOne({ _id: args.eventId }, args.eventInput);
      let updatedEvent = await Event.findById(args.eventId);
      return {
        ...updatedEvent._doc,
        date: new Date(updatedEvent._doc.date).toISOString().slice(0, 10),
        creator: user.bind(this, updatedEvent.creator),
      };
    } catch (err) {
      return err;
    }
  },
};
