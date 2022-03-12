import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tweet_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    value: {
        type: String,
    },
    read: {
        type: Boolean,
        required: true,
    }

});

// module.exports = mongoose.model("Content",ContentSchema);
export default mongoose.model("Content",ContentSchema);