import path from "path";
import {tmpdir} from "os";
import Crypto from "crypto";
import fetch from "node-fetch";
import fs from "fs";

function tmpFile(ext: string): string
{
    return path.join(tmpdir(),`downloaded_.${Crypto.randomBytes(6).readUIntLE(0,6).toString(36)}.${ext}`);
}

export async function download(url: string, extension: string)
{
    return new Promise<string>((resolve, reject) => {
        fetch(url)
            .then(res => res.buffer())
            .then(buffer => {
                const tempFilePath = tmpFile(extension);
                fs.writeFileSync(tempFilePath, buffer);
                resolve(tempFilePath);
            })
            .catch(error => {
                reject(error)
            });
    })
}
