import { Router } from 'express'
import * as CommentController from './comments.controller'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validate'
import { createCommentSchema } from './comments.schema'

// Mounted at /api/posts/:postId/comments
const postCommentsRouter = Router({ mergeParams: true })
postCommentsRouter.get('/', CommentController.listComments)
postCommentsRouter.post('/', authenticate, validate(createCommentSchema), CommentController.createComment)
postCommentsRouter.post('/:commentId/reply', authenticate, validate(createCommentSchema), CommentController.replyToComment)

// Mounted at /api/comments
const commentsRouter = Router()
commentsRouter.delete('/:id', authenticate, CommentController.deleteComment)

export { postCommentsRouter, commentsRouter }