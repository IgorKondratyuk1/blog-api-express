import {BlogsRepository} from "./repositories/blogs/blogsRepository";
import {BlogsQueryRepository} from "./repositories/blogs/queryBlogRepository";
import {CommentsRepository} from "./repositories/comments/commentsRepository";
import {PostsRepository} from "./repositories/posts/postsRepository";
import {PostsQueryRepository} from "./repositories/posts/queryPostRepository";
import {SecurityRepository} from "./repositories/security/securityRepository";
import {UsersActionsRepository} from "./repositories/userActions/usersActionsRepository";
import {UsersRepository} from "./repositories/users/usersRepository";
import {UsersQueryRepository} from "./repositories/users/queryUsersRepository";
import {AuthService} from "./domain/authService";
import {UsersService} from "./domain/usersService";
import {SecurityService} from "./domain/securityService";
import {BlogsService} from "./domain/blogsService";
import {PostsService} from "./domain/postsService";
import {CommentsService} from "./domain/commentsService";
import {UserActionsService} from "./domain/userActions";
import {AuthController} from "./routes/controllers/authController";
import {BlogsController} from "./routes/controllers/blogsController";
import {CommentsController} from "./routes/controllers/commentsController";
import {DeleteAllController} from "./routes/controllers/deleteAllController";
import {PostsController} from "./routes/controllers/postsController";
import {SecurityController} from "./routes/controllers/securityController";
import {UsersController} from "./routes/controllers/usersController";
import {LikesRepository} from "./repositories/likes/likesRepository";
import {LikeService} from "./domain/likeService";
import {CommentsWithLikesQueryRepository} from "./repositories/comments/queryCommentsWithLikesRepository";

const blogsRepository = new BlogsRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const commentsRepository = new CommentsRepository();
const postsRepository = new PostsRepository();
const postsQueryRepository = new PostsQueryRepository();
const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository();
const securityRepository = new SecurityRepository();
const usersActionsRepository = new UsersActionsRepository();
const likesRepository = new LikesRepository();
const commentsWithLikesQueryRepository = new CommentsWithLikesQueryRepository(likesRepository);

const blogsService = new BlogsService(blogsRepository);
const postsService = new PostsService(blogsRepository,postsRepository);
const likeService = new LikeService(likesRepository);
const commentsService = new CommentsService(postsRepository,commentsRepository,usersRepository, likesRepository, likeService);
export const usersService = new UsersService(usersRepository);
export const securityService = new SecurityService(securityRepository);
export const userActionsService = new UserActionsService(usersActionsRepository);
const authService = new AuthService(securityRepository,usersRepository,usersService,securityService);


export const authController = new AuthController(authService, usersService);
export const securityController = new SecurityController(securityService);
export const blogsController = new BlogsController(blogsQueryRepository,postsQueryRepository,postsService, blogsService);
export const commentsController = new CommentsController(commentsWithLikesQueryRepository,commentsService, likeService);
export const postsController = new PostsController(postsQueryRepository,postsService, postsRepository,commentsWithLikesQueryRepository, commentsService);
export const usersController = new UsersController(usersQueryRepository,usersService);
export const deleteAllController = new DeleteAllController(blogsService,postsService,usersService,commentsService,usersActionsRepository,securityRepository);


