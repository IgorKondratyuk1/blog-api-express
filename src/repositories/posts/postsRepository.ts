import {UpdatePostModel} from "../../models/post/updatePostModel";
import {mapPostDbTypeToPostType} from "../../helpers/mappers";
import {CreatePostDbType, PostDbType, PostModel, PostType} from "./postSchema";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    async findPostById(id: string): Promise<PostType | null> {
        try {
            const dbPost: PostDbType | null = await PostModel.findOne({id});
            if (!dbPost) return null;
            return mapPostDbTypeToPostType(dbPost);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async createPost(newPost: CreatePostDbType): Promise<PostType | null> {
        try {
            const post = new PostModel(newPost);
            const createdPost = await post.save();
            return mapPostDbTypeToPostType(createdPost);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async updatePost(id: string, data: UpdatePostModel): Promise<boolean> {
        try {
            const post = await PostModel.findOne({id});
            if (!post) return false;

            post.blogId = data.blogId;
            post.content = data.content;
            post.title = data.title;
            post.shortDescription = data.shortDescription;
            await post.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deletePost(id: string): Promise<boolean> {
        try {
            const result = await PostModel.deleteOne({ id: id });
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllPosts() {
        return PostModel.deleteMany({});
    }
}