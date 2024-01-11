export const vars = {
	MONGODB_URI: process.env.MONGODB_URI!!,
	ACCESSTOKEN_SECRET: process.env.ACCESSTOKEN_SECRET || 'thisisasecret',
	ACCESSTOKEN_EXPIRY: process.env.ACCESSTOKEN_EXPIRY || '1h',
}
