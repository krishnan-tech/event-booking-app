import { Document, model, Schema } from "mongoose";

interface bookingSchema extends Document {
  event: {
    type: typeof Schema.Types.ObjectId;
    ref: string;
  };
  user: {
    types: typeof Schema.Types.ObjectId;
    res: string;
  };
}

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      types: Schema.Types.ObjectId,
      res: "User",
    },
  },
  { timestamps: true }
);

export default model<bookingSchema>("Booking", bookingSchema);
