import argon2 from 'argon2'
import mongoose, { Schema, Document } from 'mongoose'

export enum Gender {
	male = 'male',
	female = 'female',
	others = 'others',
}

export interface UserDocument extends Document {
	phone: string
	fullname: string
	age: number
	password: string
	gender: Gender
}

interface Methods {
	comparePassword: (password: string) => Promise<boolean>
}

const schema = new Schema<UserDocument, unknown, Methods>({
	phone: { type: String, required: true, unique: true },
	fullname: { type: String, required: true },
	age: { type: Number },
	password: { type: String, required: true },
	gender: { type: String, enum: Object.values(Gender) },
})

schema.pre('save', async function (next) {
	if (!this.isModified('password')) next()

	this.password = await argon2.hash(this.password)
	next()
})

schema.methods.comparePassword = async function (password) {
	return await argon2.verify(this.password, password)
}

const UserModel = mongoose.model('users', schema)

export default UserModel
