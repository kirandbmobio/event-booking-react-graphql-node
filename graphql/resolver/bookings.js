const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const { user, events, singleEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      let bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {}
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      let fetchedEvents = await Event.findById(args.eventId);

      let booking = new Booking({
        user: req.userId,
        event: fetchedEvents,
      });
      let result = await booking.save();
      return {
        ...result._doc,
        user: user.bind(this, result._doc.user),
        event: singleEvent.bind(this, result._doc.event),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      return err;
    }
  },
  cancelBooking: async (args) => {
    try {
      let booking = await Booking.findById(args.bookingId).populate("event");
      let event = {
        ...booking.event._doc,
        _id: booking.event._doc.id,
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({ _id: args.bookingId });
      console.log(event);
      return event;
    } catch (err) {}
  },
};
