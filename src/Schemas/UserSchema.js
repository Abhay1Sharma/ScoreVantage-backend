import { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
        },

        googleId: {
            type: String
        },

        isVerified: {
            type: Boolean,
            default: false
        },

    }, { timestamps: true },
);

UserSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 86400, // 24 hours in seconds
        partialFilterExpression: { isVerified: false }
    }
)

export { UserSchema };