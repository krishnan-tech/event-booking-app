import Event from "../../models/event";
import User from "../../models/users";
import bcrypt from "bcryptjs";
import Booking from "../../models/booking";

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

export default {
  Query: {
    async events() {
      try {
        // const events = await Event.find();
        // return events;
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
        // const err = typeof e
        return errFunction(e);
      }
    },

    // async bookings() {
    //   const bookings = await Booking.find();
    //   console.log(bookings);
    //   return bookings;
    // },
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

    // async bookEvent(_, { eventId }) {
    //   const bookings = await Booking.find();
    //   console.log(bookings);
    //   return bookings;
    // },
  },
};
