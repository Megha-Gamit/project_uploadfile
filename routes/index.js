const express = require("express");
const { append } = require("express/lib/response");
const multer = require("multer");
const { extname } = require("path");
const path= require("path");
const empModel = require("../modules/employee");
const uploadModel = require("../modules/upload");
const router = express.Router();

router.use(express.static(__dirname+"./public"));
//const employee = empModel.find({});

const storage = multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({
  storage:storage,
}).single('file')

//Get home page
router.get('/',(req,res)=>{
empModel.find({}).exec((err, data) => {
  if (err) throw err;
  res.render("index", { title: "Employee Records", records: data, success:'' });
});
});

router.post("/",(req,res,next)=>{
    const empDetails = new empModel({
      name: req.body.uname,
      email: req.body.email,
      etype: req.body.emptype,
      hourlyrate:req.body.Hrate,
      totalHour:req.body.Thour,
      total: parseInt(req.body.Hrate)*parseInt(req.body.Thour),
    });

    empDetails.save((err,res1)=>{
         if(err) throw err;
        empModel.find({}).exec((err, data) => {
           if (err) throw err;
            res.render("index", { title: "Employee Records", records: data, success:'Data Inserted Succssesfully' });
    });
       
});
console.log(empDetails);
});

router.post("/search/", (req, res, next) => {
  const fltrname = req.body.fltrName;
  const fltremail = req.body.fltrEmail;
  const fltremptype = req.body.fltremptype;

  if (fltrname != "" && fltremail != "" && fltremptype != "") {
    var fltrParameter = {
      $and: [
        { name: fltrname },
        { $and: [{ email: fltremail }, { etype: fltremptype }] },
      ],
    };
  } else if (fltrname != "" && fltremail == "" && fltremptype != "") {
    var fltrParameter = {
      $and: [{ name: fltrname }, { etype: fltremptype }],
    };
  } else if (fltrname == "" && fltremail != "" && fltremptype != "") {
    var fltrParameter = {
      $and: [{ email: fltremail }, { etype: fltremptype }],
    };
  }

  const employeefltr = empModel.find(fltrParameter);
  employeefltr.exec((err, data) => {
    if (err) throw err;
    res.render("index", { title: "Employee Records", records: data });
  });
});

router.get("/delete/:id", (req, res) => {
    
  let id= req.params.id;
  let del= empModel.findByIdAndDelete(id);
  del.exec((err) => {
    if (err) throw err;
    empModel.find({}).exec((err, data) => {
           if (err) throw err;
            res.render("index", { title: "Employee Records", records: data, success:'Recorsd Deleted Succssesfully' });
    });
  });
});

router.get("/edit/:id", (req, res) => {

         const id= req.params.id;
       const edit = empModel.findById(id)

  edit.exec((err, data) => {
    if (err) throw err;
    res.render("edit", { title: "Edit Employee Records", records: data });
  });
});

router.post("/update", (req, res) => {
  //const id = req.params.id;
  const update = empModel.findByIdAndUpdate(req.body.id, {
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.Hrate,
    totalHour: req.body.Thour,
    total: parseInt(req.body.Hrate) * parseInt(req.body.Thour),
  });

  update.exec((err, data) => {
    if (err) throw err;
    empModel.find({}).exec((err, data) => {
           if (err) throw err;
            res.render("index", { title: "Employee Records", records: data, success:'Records Update Succssesfully' });
    });
  });
});

router.get("/upload", (req, res) => {
  const success ='';
  const imageData = uploadModel.find();
 imageData.exec((err, data) => {
   if (err) throw err;

   res.render("upload_file", {
     title: "Upload File",
     records: data,
     success: success,
   });
 });
});

router.post("/upload", upload, (req, res,next) => {
  const imageFile = req.file.filename;
  const success = req.file.filename+" uploaded successfully"

  const imageDetails = new uploadModel({
    imagename:imageFile
  })
  imageDetails.save((err,doc)=>{
    if(err) throw err;

    const imageData= uploadModel.find();
    imageData.exec((err,data)=>{
      if(err) throw err;

      res.render("upload_file", {
        title: "Upload File",
        records: data,
        success: success,
      });

   // const data = "";
  });

  })
  });

module.exports = router;