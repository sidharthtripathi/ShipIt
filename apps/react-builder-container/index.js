const {exec} = require('child_process')
const path = require('path')
const githubURL = process.env.GITHUB_URL
const buildCmd = process.env.BUILD_CMD
const installCmd = process.env.INSTALL_CMD
exec(`git clone ${githubURL} ${path.join(__dirname,'repo')}`,(err,stdout,stderr)=>{
    if(err) console.log(err)
    else{
        console.log(stdout)
        exec(`cd ${path.join(__dirname,'repo')} && ${installCmd} && ${buildCmd}`,(err,stdout,stderr)=>{
            if(err) console.log(err)
            else console.log(stdout)
        })
}
})
