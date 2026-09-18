import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserInterface {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<UserInterface>({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, { timestamps: true, })

//Pre Hook to hash the password before saving the user
userSchema.pre("save", async function () {

    if (this.isModified("password")) {

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

    }

})

const User = models?.User || model<UserInterface>("User", userSchema);
export default User;