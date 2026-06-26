import { model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { UserSchema } from "../Schemas/UserSchema.js";

UserSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

const User = model("user", UserSchema);

export { User };