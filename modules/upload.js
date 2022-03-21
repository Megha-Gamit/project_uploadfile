const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Megha:megha*12345@cluster0.vi6gd.mongodb.net/todoDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const conn = mongoose.Collection;

const uploadSchema = new mongoose.Schema({
    imagename : String,
});

const uploadModel = mongoose.model('uploadimage',uploadSchema);
module.exports=uploadModel;