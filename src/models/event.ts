import { Document, model, Schema } from "mongoose";

interface EventSchema extends Document {
  _doc: any;
  title: string;
  description: string;
  price: number;
  date: string;
  creator: [
    {
      type: typeof Schema.Types.ObjectId;
      ref: string;
    }
  ];
}

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<EventSchema>("Event", eventSchema);
