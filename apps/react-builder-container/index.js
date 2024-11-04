const {exec} = require('child_process')
const path = require('path')
const githubURL = process.env.GITHUB_URL
exec(`git clone ${githubURL} ${path.join(__dirname,'repo')}`,(err,stdout,stderr)=>{
    if(err) console.log(err)
    else{
        console.log(stdout)
        exec(`cd ${path.join(__dirname,'repo')} && npm i && npm run build`,(err,stdout,stderr)=>{
            if(err) console.log(err)
            else console.log(stdout)
        })
}
})
