import mongoose from "mongoose";


const subscriptionModel = new mongoose.Schema({
subscriber:{
    type: Schema.Types.ObjectId, 
     ref: "User"
},
channel:{
    type: Schema.Types.ObjectId, 
     ref: "User"
}
}, {timestamps:true})


const subscription = moongos.model("Subscrption", subscriptionModel)

export default subscription