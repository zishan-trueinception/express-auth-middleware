import jwt from 'jsonwebtoken'
import { vars } from '../src/env'
import { RequestHandler } from 'express'
import UserModel from '../src/models/UserModel'

export function createAccessToken(id: string, phone: string) {
	const iat = Math.floor(Date.now() / 1000)

	const token = jwt.sign({ id, phone, iat }, vars.ACCESSTOKEN_SECRET, {
		expiresIn: vars.ACCESSTOKEN_EXPIRY,
	})

	return { token, iat }
}

type TokenData = {
	id: string
	phone: string
	iat: number
	exp: number
}

type TokenError = {
	name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError'
}

type TokenResults = TokenData | TokenError

export function tokenIsError(token: TokenResults): token is TokenError {
	return (token as TokenError).name !== undefined
}

export function verifyAccessToken(token: string): TokenResults {
	try {
		const data = jwt.verify(token, vars.ACCESSTOKEN_SECRET) as TokenData

		return data
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return { name: 'TokenExpiredError' } as TokenError
		}

		if (error instanceof jwt.JsonWebTokenError) {
			return { name: 'JsonWebTokenError' } as TokenError
		}

		if (error instanceof jwt.NotBeforeError) {
			return { name: 'NotBeforeError' } as TokenError
		}

		return { name: 'JsonWebTokenError' } as TokenError
	}
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
	const authorization = req.headers.authorization

	if (!authorization) {
		return res.status(401).json({ message: 'access token not found' })
	}

	const token = verifyAccessToken(authorization)

	if (tokenIsError(token)) {
		return res.status(401).json({ message: token.name })
	}

	const { id, phone } = token

	const user = await UserModel.findOne({ _id: id, phone })

	req.body.user = user

	next()
}
