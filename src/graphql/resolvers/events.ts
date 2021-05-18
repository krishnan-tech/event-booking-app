import Event from "../../models/event";
import User from "../../models/users";
import Booking from "../../models/booking";
import bcrypt from "bcryptjs";

interface EventInput {
  title: string;
  description: string;
  price: number;
}

interface UserInput {
  email: string;
  password: string;
}

const errFunction = (e: any) => {
  throw new Error("unable to save event because of this error: " + e.message);
};

const eventsBinds = async (eventIds: string) => {
  const events = await Event.find({ _id: { $in: eventIds } });
  return events.map((event) => {
    return {
      ...event._doc,
      _id: event.id,
      creator: userBinds.bind(this, event.creator),
    };
  });
};

const userBinds = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user does not exist");
    }
    const result = {
      ...user._doc,
      createdEvents: eventsBinds.bind(this, user._doc.createEvents),
    };
    return result;
  } catch (e) {
    return errFunction(e);
  }
};

const singleEvent = async (eventId: string) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("No event exists for: " + eventId);
    }
    return { ...event._doc, creator: userBinds.bind(this, event?.creator) };
  } catch (e) {}
};

export default {
  Query: {
    async events() {
      try {
        return Event.find().then((events) => {
          return events.map((event) => {
            return {
              ...event._doc,
              _id: event.id,
              creator: userBinds.bind(this, event._doc.creator),
            };
          });
        });
      } catch (e) {
        return errFunction(e);
      }
    },

    async bookings() {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          user: userBinds.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
        };
      });
    },
  },

  Mutation: {
    async createEvent(
      _: any,
      { eventInput: { title, description, price } }: { eventInput: EventInput }
    ) {
      const event = new Event({
        title: title,
        description: description,
        price: +price,
        date: new Date().toISOString(),
        creator: "60a26da5078d3252208571a1",
      });
      try {
        const user = await User.findById("60a26da5078d3252208571a1");
        if (!user) {
          throw new Error("User not found");
        }
        user.createEvents.push(event._id);
        user.save();

        const event_save = await event.save();
        const result = {
          ...event_save._doc,
          creator: userBinds.bind(this, event_save.creator),
        };
        return result;
      } catch (e) {
        return errFunction(e);
      }
    },

    async createUser(
      _: any,
      { userInput: { email, password } }: { userInput: UserInput }
    ) {
      const findUser = User.findOne({ email: email });
      if (findUser) {
        throw new Error("User exists already.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPassword,
      });

      const result = await user.save();
      result.password = "";

      return result;
    },

    async bookEvent(_: any, { eventId }: { eventId: string }) {
      const fetchEvent = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: "60a26da5078d3252208571a1",
        event: fetchEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        user: userBinds.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
      };
    },
  },
};
