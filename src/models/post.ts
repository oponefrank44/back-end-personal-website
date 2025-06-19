import { Schema ,model} from "mongoose";


const postsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
   
},{timestamps:true});

const PostModel = model("Posts", postsSchema);
export default PostModel;