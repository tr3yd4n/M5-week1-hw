import express from "express"
import fs from "fs"
import { join, dirname, parse } from "path"
import { fileURLToPath } from "url"
import uniqid from 'uniqid'
import { CheckBlogPostSchema, CheckValidationResult } from './validation.js'
import { validationResult } from "express-validator"

//create an express function declared as a router
const router = express.Router()
// folder path containing src converts path to url including json
const blogsPath = join(dirname(fileURLToPath(import.meta.url)), "blogs.json")

// // Question 1 - DONE
router.get('/', (req, res) => { // /blogs

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)
    // console.log(blogs.JSON)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. send back to the front as response
    res.send(parsedblogs)
    console.log(parsedblogs)

})

router.get('/search', (req, res) => { // /search blogs by title

    const { title } = req.query
    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)
    // console.log(blogs.JSON)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)
    const filteredBlogs = parsedblogs.filter(blog => blog.title.toLowerCase().includes(title.toLowerCase()))
    //3. send back to the front as response
    res.send(filteredBlogs)
    console.log(filteredBlogs)

})

// // Question 3 - DONE 
router.post('/', CheckBlogPostSchema, CheckValidationResult, async (req, res, next) => {
    try {

        //1. read the body of the request
        const newblog = { id: uniqid(), ...req.body, createdAt: new Date(), updatedAt: new Date() }
        console.log(newblog)

        //2. read content of chosen json file (blogs.json)
        const blogsJSON = fs.readFileSync(blogsPath)
        const blogsList = JSON.parse(blogsJSON)

        //3. push the new blog into the blogs.json array
        blogsList.push(newblog)

        //4. write the array back into the JSON file as a string
        fs.writeFileSync(blogsPath, JSON.stringify(blogsList))
    }

    catch {
        res.send(error)
    }
    //5. provide a response 201 = created
    res.status(201).send(newblog.id)
    console.log(blogsList)

})

// Question 2
router.get('/:id', (req, res) => {

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. select blog based on uniqid value
    const blog = parsedblogs.find(a => a.id === req.params.id)

    //4. send back to the front as response
    res.status(200).send(blog)
    console.log(blog)

})

// Question 4
router.put('/:id', (req, res) => { //queries

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. modify specified blog and add to new array
    const remainingblogs = parsedblogs.filter(blog => blog.id !== req.params.id)
    const updatedblog = { ...req.body, id: req.params.id }
    remainingblogs.push(updatedblog)

    //4. write (save) file with modified blog
    fs.writeFileSync(blogsPath, JSON.stringify(remainingblogs))

    //5. send response
    res.send(updatedblog)

})

// Question 5
router.delete('/:id', (req, res) => { //TREAT THIS AS AN INPUT CHECK!!!!!

    //1. target blogs.json grab entire list of blogs from blogs.json
    const blogs = fs.readFileSync(blogsPath)

    //2. convert into readable array
    const parsedblogs = JSON.parse(blogs)

    //3. filter out specified id
    const remainingblogs = parsedblogs.filter(blog => blog.id !== req.params.id)

    //4. write the array back into the JSON file as a string
    fs.writeFileSync(blogsPath, JSON.stringify(remainingblogs))
    res.status(204).send(remainingblogs) // cant get this to log text or remaining on deletion but delete works

})

export default router