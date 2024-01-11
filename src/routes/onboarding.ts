import { Router } from 'express'

import UserModel from '../models/UserModel'
import { createAccessToken } from '../../middlewares/auth'

const router = Router()

router.post('/createUser', async (req, res) => {
	try {
		const userData = req.body
		console.log(userData)

		const existingUser = await UserModel.exists({ phone: userData.phone })

		if (existingUser) {
			return res.status(400).json({ message: 'user already exists' })
		}

		const user = await UserModel.create(userData)

		res.status(201).json({
			fullname: user.fullname,
			phone: user.phone,
			id: user._id,
			gender: user.gender,
		})
	} catch (error) {
		return res.status(500).json({ message: 'internal server error' })
	}
})

router.post('/login', async (req, res) => {
	const credentials = req.body

	const user = await UserModel.findOne({ phone: credentials.phone })

	if (!user) {
		return res.status(401).json({ message: 'invalid credentials' })
	}

	const passwordMatch = await user.comparePassword(credentials.password)

	if (!passwordMatch) {
		return res.status(401).json({ message: 'invalid credentials' })
	}

	const accessToken = createAccessToken(user._id, user.phone)

	res.status(200).json({
		fullname: user.fullname,
		phone: user.phone,
		id: user._id,
		gender: user.gender,
		accessToken,
	})
})

export default router
