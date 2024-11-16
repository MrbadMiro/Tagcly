import mongoose, { Document, Schema, Model ,Types } from "mongoose";

//Define the interface for the user Document
export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	isAdmin: boolean;
}

//Define the schema for the user model

const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

//create and export the model with Iuser type
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
