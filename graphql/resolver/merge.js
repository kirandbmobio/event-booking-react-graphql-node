const DataLoader = require("dataloader");

const Event = require("../../models/event");
const User = require("../../models/user");

const eventLoader = new DataLoader((eventIds) => {
  return events(eventIds);
});

const events = async (eventIds) => {
  try {
    let eventData = await Event.find({ _id: { $in: eventIds } });
    return eventData.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
  } catch (err) {
    return err;
  }
};

const user = async (userId) => {
  try {
    let userData = await User.findById(userId);
    if (userData) {
      return {
        ...userData._doc,
        createdEvents: events.bind(this, userData._doc.createdEvents),
      };
    }
  } catch (err) {
    return err;
  }
};

const singleEvent = async (eventId) => {
  try {
    let eventData = await Event.findById(eventId);
    if (!eventData) {
      throw new Error("Event not found!");
    }
    return {
      ...eventData._doc,
      creator: user.bind(this, eventData.creator),
    };
  } catch (err) {
    return err;
  }
};

exports.singleEvent = singleEvent;
exports.events = events;
exports.user = user;
