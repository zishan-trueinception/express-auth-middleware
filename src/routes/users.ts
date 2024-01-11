import { Router } from 'express'

import { authMiddleware } from '../../middlewares/auth'

const router = Router()

// add auth middleware here
router.use(authMiddleware)

router.get('/getUser', (req, res) => {
	res.status(200).json({
		id: req.body.user.id,
		fullname: req.body.user.fullname,
		phone: req.body.user.phone,
		age: req.body.user.age,
		gender: req.body.user.gender,
	})
})

export default router
