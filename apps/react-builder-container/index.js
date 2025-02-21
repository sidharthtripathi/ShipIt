const {spawn} = require('child_process')
const path = require('path')
const githubURL = process.env.GITHUB_URL
const buildCmd = process.env.BUILD_CMD
const installCmd = process.env.INSTALL_CMD
const gitCloneChild = spawn("git",["clone",githubURL,"repo"],{shell : true})
gitCloneChild.stdout.on("data",(data)=>{
    console.log(data.toString())
})

gitCloneChild.stderr.on("data",(data)=>{
    console.log(data.toString())
})

gitCloneChild.on("close",()=>{
    const buildChild = spawn("cd",[path.join(__dirname,'repo'),"&&","echo",installCmd,"&&",installCmd,"&&","echo",buildCmd,"&&",buildCmd],{shell : true})
    buildChild.stdout.on("data",(data)=>{
        console.log(data.toString())
    })
    buildChild.stderr.on("data",(data)=>{
        console.error(data.toString())
    })
})
