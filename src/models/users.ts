import { Document, model, Schema } from "mongoose";

// interface EventSchema extends Document {
//   title: string;
//   description: string;
//   price: number;
//   date: string;
//   creator: [
//     {
//       type: typeof Schema.Types.ObjectId;
//       ref: string;
//     }
//   ];
// }

interface UserSchema extends Document {
  _doc: any;
  email: string;
  password: string;
  createEvents: [
    {
      type: typeof Schema.Types.ObjectId;
      ref: string;
    }
  ];
}

const userSchama = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

export default model<UserSchema>("User", userSchama);
