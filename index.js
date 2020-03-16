// implement your API here
const db=require('./data/db')
const express = require('express');
const shortid=require('shortid')
const server =express();

server.listen(4000, ()=>{
    console.log("listening on port 4000")
});

server.use(express.json())

server.get('/', (req,res)=>{
  res.send('TEST')
})

//C -- Create with POST 

server.post('/api/users', (req,res)=>{
    const newUser=req.body
    db.insert(newUser)
      .then(addUser=>{
        if(addUser){
          const freshUser={
            id: shortid.generate(),
            name :addUser.name,
            bio :addUser.bio
          }
          // console.log("adduser",addUser)
          // console.log("newUser",newUser)
          res.status(201).json( newUser)
        }})

      })

       

  // R -- Read 
  server.get ("/api/users", (req,res)=>{
    db.find()
    .then(getUser=>{
      res.status(200).json(getUser)
    })
    .catch(error=>res.status(500).json({success: false, message: "No user info"}, error))
  })

  server.get ("/api/users/:id", (req,res)=>{
    const {id}=req.params
    db.findById(id)
    .then(getUserbyId=>{
      if (getUserbyId){
        res.status(200).json(getUserbyId)
      } else{
        res.status(404).json({success:false, message :"Id not found"})
      }
      
    })
    .catch(error=>res.status(500).json({success: false, message: "No user info"}, error))
  })
  


  // D -- Delete 

  server.delete('/api/users/:id', (req,res)=>{
    const {id} =req.params
    // const body=req.body

    db.remove(id)
    .then(deleted=>{
      if(deleted){
        res.status(200).json(`The user was deleted `)
      } else{
        res.status(404).json({success :false, message: "id not found"})
      }
    })
    .catch(error => res.status(500).json({success : false, message : " User cannot be removed"}))
  })

server.put('/api/users/:id', (req,res)=>{
  const {id}= req.params
  const changes=req.body

  db.update(id, changes)
  .then(updated=>{
    if (updated){
      res.status(200).json(changes)
    }else {
      res.status(404).json({
        success : false ,message: "id not found"
      })
    }
  })
  .catch (error=> res.status(500).json({success : false , error}))
})