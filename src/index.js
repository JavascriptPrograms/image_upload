import express from "express";
import bodyParser from "body-parser";
import conn from "./db.js";
import multer from "multer";
import path from "path";

if(conn){
    console.log("Database Connected");
}else{
    console.log("Database Not Connected");
}

const app = express();

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join('uploads')))

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"uploads");
    },
    filename : (req,file,cb)=>{
        console.log(file)
        cb(null,Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({storage:storage});


app.get('/',(req,res)=>{
    res.render('index');
})

app.get("/add_employee",(req,res)=>{
    res.render('pages/add_employee');
})
app.post("/submit_images",upload.single("image"),(req,res)=>{
   const emp_name = req.body.emp_name;
   const emp_pro = req.body.emp_pro;
   const emp_join_date = req.body.emp_join_date;
   const file_name = req.file.filename;

   const sql = "insert into employee(employee_name,employee_profession,employee_join_date,employee_pic) values(?,?,?,?)";
   conn.query(sql,[emp_name,emp_pro,emp_join_date,file_name],(err,result)=>{
        if(err){
            console.log(err.message);
        }else{
            console.log(result);
            console.log("insert the data in database");
            res.redirect("/");
        }
   })

})
app.get("/employee",(req,res)=>{
    try{
        const sql = "select * from employee";
        conn.query(sql,[],(err,result)=>{
            if(err){
                console.log(err.message);
            }else{
                res.render('pages/employee',{employee:result});
            }
        })
    }catch(err){
        console.log(err.message);
    }
})

app.get("/delete_employee/:id",(req,res)=>{
    try{
        const id = req.params.id;
        const sql = "delete from employee where id=?"
        conn.query(sql,[id],(err,result)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log(result);
                console.log("delete the data in database");
                res.redirect("/employee")
            }
        });
    }catch(err){
        console.log(err.message);
    }
});

app.get("/edit_employee/:id",(req,res)=>{
    try{
        const id = req.params.id;
        const sql = "select * from employee where id=?";
        conn.query(sql,[id],(err,result)=>{
            if(err){
                console.log(err.message);
            }else{
                // console.log(result);
                res.render('pages/edit_employee',{employee:result});
            }
        })
    }catch(err){
        console.log(err.message);
    }
});

app.post("/update_employee/:id",upload.single("image"),(req,res)=>{
    try{
        const id = req.params.id;
        const emp_name = req.body.emp_name;
        const emp_pro = req.body.emp_pro;
        const emp_join_date = req.body.emp_join_date;
        const file_name = req.file.filename;
        const sql = "update employee set employee_name=?,employee_profession=?,employee_join_date=?,employee_pic=?  where id=?";
        conn.query(sql,[emp_name,emp_pro,emp_join_date,file_name,id],(err,result)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log(result);
                console.log("update the data in database");
                res.redirect("/employee");
            }
        })
    }catch(err){
        console.log(err.message);
    }
});

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})