import {injectable} from "inversify";
import {HydratedPost, PostDbType, PostType} from "../../domain/Post/postTypes";
import {Post} from "../../domain/Post/postSchema";

@injectable()
export class PostsRepository {
    async save(post: HydratedPost) {
        await post.save();
    }
    async findPostById(id: string): Promise<HydratedPost | null> {
        try {
            const post: HydratedPost | null = await Post.findOne({id});
            return post;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deletePost(id: string): Promise<boolean> {
        try {
            const result = await Post.deleteOne({ id: id });
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllPosts() {
        return Post.deleteMany({});
    }
}