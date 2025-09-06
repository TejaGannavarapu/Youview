import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const vedioSchema = new Schema(
    
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        vedioFile: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            required: true,
            default: 0
        },
        isPublished: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true
    }

);

vedioSchema.plugin(mongooseAggregatePaginate);

export const Vedio = new mongoose.model("Vedio", vedioSchema);