const aws = require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAU2D2DE6WXSPNIG5S",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async function (file) {
    return new Promise(async function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: "2006-03-01" })
        var uploadParams = {
            ACL: "public-read",
            Bucket: "functionup-93",
            Key: "Mousmi/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log(data)
            console.log(" file uploaded succesfully ")
            return resolve(data.Location)
        });
    });
}

module.exports = {
    uploadFile
}