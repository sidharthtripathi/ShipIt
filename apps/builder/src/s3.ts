import {S3Client} from '@aws-sdk/client-s3'
import {Upload} from '@aws-sdk/lib-storage'
import { createReadStream,lstatSync,readdirSync } from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import mime from 'mime-types'
dotenv.config()
const s3 = new S3Client({
    region :process.env.AWSREGION,
    credentials : {
        accessKeyId : process.env.AWSACCESSKEYID as string,
        secretAccessKey :process.env.AWSSECRETACCESSKEY as string
    }
})

async function uploadFile(key:string,path:string) {
    const upload = new Upload({
        client : s3,
        params : {
            Bucket : process.env.BUCKETNAME as string,
            Key : key,
            Body : createReadStream(path),
            ContentType : mime.lookup(path) as string
        }
    })
    
    await upload.done()    
}

export async function uploadFolder(inputPath : string,domain:string) {
    const contents = readdirSync(inputPath,{recursive : true})
    for(let i = 0 ; i<contents.length ; i++){
        const content = contents[i]
        const isFolder = lstatSync(path.join(inputPath,content as string)).isDirectory()
        if(!isFolder){
            await uploadFile(`${domain}/${content}`,path.join(inputPath,content as string))
            console.log("uploaded:", content)
        }
    }
}


