const Article = require('../models/Articles')

exports.addArticle = async (req,res)=>{
    try{
        const {pic,title,text,link,id} = req.body
        console.log(pic)
        const article = new Article({
            pic:pic,
            title:title,
            text:text,
            link:link||"",
            uid:id
        })
        await article.save()
        res.send({message:"Added Successfully!"})
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Something Went Wrong!"})
    }
}

exports.getAll=async (req,res) =>{
    try{
        const articles = await Article.find({})
        res.send({articles}) 
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Something Went Wrong!"})
    }
}
exports.getAllAdmin=async (req,res) =>{
    try{
        const articles = await Article.find({uid:req.body.id})
        res.send({articles}) 
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Something Went Wrong!"})
    }
}
exports.editArticle = async (req,res)=>{
    try{
        const {pic,title,text,id,link} = req.body
        let article = await Article.findOne({
            _id:id
        })
        article.pic=pic
        article.title=title
        article.text=text
        article.link=link
        await article.save()
        res.send({message:"Added Successfully!"})
    }catch(err){
        console.log(err)
        res.status(400).send({message:"Something Went Wrong!"})
    }
}

exports.deleteArticle=async (req,res) =>{
    try{
        const {id} = req.params
        const articles = await Article.deleteOne({_id:id})
        console.log(articles)
        res.send({message:"Deleted Successfully"}) 
    }catch(err){
        res.status(400).send({message:"Something Went Wrong!"})
    }
}