import { Document, model, Schema } from "mongoose";

interface BookingSchema extends Document {
  _doc: any;
  event: [
    {
      type: typeof Schema.Types.ObjectId;
      ref: string;
    }
  ];
  user: [
    {
      type: typeof Schema.Types.ObjectId;
      ref: string;
    }
  ];
}

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model<BookingSchema>("Booking", bookingSchema);
