import Event from "../../models/event";
import User from "../../models/users";
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

export default {
  Query: {
    async events() {
      try {
        const events = await Event.find();
        return events;
      } catch (e) {
        // const err = typeof e
        return errFunction(e);
      }
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

        const result = await event.save();
        console.log(result);
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
  },
};
