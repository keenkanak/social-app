const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const Post = require('../models/Post')
const User = require('../models/User')
const Profile = require('../models/Profile')
const { check, validationResult } = require('express-validator')

//Get all posts
router.get('/', async (req, res) => {
	try {
		const posts = await Post.find()

		if (posts.length >= 1) {
			return res.json({ message: "Posts Found", posts })
		}
		else if (posts.length == 0) {
			return res.status(200).json({ msg: 'No posts found' })
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({
			msg: error.message,
		})
	}
})

//Get logged in User Posts
router.get('/me', auth, async (req, res) => {
	try {
		const posts = await Post.find({ user: req.user.id })
		if (posts.length >= 1) {
			return res.json({ msg: 'Your Posts', posts })
		}
		return res.status(404).json({ msg: 'No posts found' })
	} catch (error) {
		console.error(error)
		res.status(500).json({
			msg: error.message,
		})
	}
})

//Get post by id
router.get('/:pid', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.pid)

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' })
		}
		return res.json({ msg: 'Post Found', post })
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			msg: error.message,
		})
	}
})

//Create Post
router.post(
	'/create',
	[auth, [check('text', 'post body is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const postUser = await User.findById(req.user.id).select('-password')
			const newPost = new Post({
				text: req.body.text,
				user: postUser.id,
				avatar: postUser.avatar,
				name: postUser.username,
			})
			await newPost.save()
			res.status(201).json({ msg: 'Post created', newPost })
		} catch (error) {
			console.error(error)
			res.status(500).json({ msg: 'Post creation failed' })
		}
	}
)

//Delete Post
router.delete('/:pid', auth, async (req, res) => {
	try {
		const postUser = await User.findById(req.user.id).select('-password')
		const post = await Post.findById(req.params.pid)
		if (!post) return res.status(404).json({ msg: 'Post not found' })
		if (req.user.id !== post.user.toString()) {
			return res.status(403).json({ msg: "You can't delete this post" })
		}

		await post.remove()

		res.status(200).json({ msg: 'Post Deleted' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: 'Post creation failed' })
	}
})
//Add a like on a post
router.put('/like/:pid', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.pid)
		if (!post) {
			res.status(404).json({ msg: 'Post not found' })
		}
		const user = await User.findById(req.user.id).select('-password')

		//Check if already liked
		if (
			post.likes.filter((item) => item.user.toString() === req.user.id)
				.length > 0
		) {
			return res.status(400).json({ msg: 'Post already liked' })
		}
		const newLike = { user: req.user.id }
		post.likes.unshift({
			user: req.user.id,
			name: user.username,
			avatar: user.avatar,
		})
		await post.save()

		return res.status(201).json({ msg: 'Post Liked', post })
	} catch (error) {
		console.error(error)
		res.status(500).json({ msg: "Couldn't like post" })
	}
})

//Delete like
router.delete('/like/:pid/:lid', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.pid)
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' })
		}
		const like = post.likes.find((item) => {
			console.log(item.id)
			return item.id.toString() == req.params.lid
		})

		if (!like) {
			return res.status(404).json({ msg: 'Post not liked' })
		}

		if (req.user.id !== like.user.toString()) {
			return res.status(403).json({ msg: "You can't remove this like" })
		}

		const removeIdx = post.likes
			.map((like) => like.id.toString())
			.indexOf(req.params.lid)

		if (removeIdx >= 0) {
			post.likes.splice(removeIdx, 1)
		}

		await post.save()

		return res.status(200).json({ msg: 'Like removed', likes: post.likes })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ msg: "Couldn't unlike" })
	}
})

//Add a comment on a post
router.post(
	'/comment/:id',
	[auth, [check('text', 'comment body is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const post = await Post.findById(req.params.id).populate('user', [
				'username',
				'email',
				'avatar',
			])
			const user = await User.findById(req.user.id).select('-password')
			const postComment = {
				user: req.user.id,
				text: req.body.text,
				name: user.username,
				avatar: user.avatar,
			}
			post.comments.unshift(postComment)
			post.save()
			res.status(201).json({ msg: 'Comment created', comments: post.comments })
		} catch (error) {
			console.error(error)
			res.status(500).json({ msg: error.message })
		}
	}
)

//Delete Comment
router.delete('/comment/:pid/:cmtid', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.pid)
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' })
		}
		const comment = post.comments.find(
			(item) => item.id === req.params.cmtid
		)
		console.log(comment.user)
		if (!comment) {
			return res.status(404).json({ msg: 'Comment not found' })
		}
		if (req.user.id !== comment.user.toString()) {
			return res.status(403).json({ msg: "You can't delete this comment" })
		}

		const removeIdx = post.comments
			.map((cmt) => cmt.id.toString())
			.indexOf(req.params.cmtid)
		if (removeIdx >= 0) {
			post.comments.splice(removeIdx, 1)
		}
		await post.save()

		res
			.status(200)
			.json({ msg: 'Comment removed', comments: post.comments })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ msg: 'Comment deletion failed' })
	}
})
module.exports = router
