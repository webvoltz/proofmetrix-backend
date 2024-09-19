const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const { s3BucketConfig } = require("../constants/s3BucketConfig.constant");
const { getPath } = require("../utils/uploadPaths");

aws.config.update({
    secretAccessKey: s3BucketConfig.secretAccessKey,
    accessKeyId: s3BucketConfig.accessKeyId,
});

const s3 = new aws.S3({
    endpoint: s3BucketConfig.baseUrl,
});

const storage = multerS3({
    s3,
    bucket: s3BucketConfig.bucket,
    key: function (req, file, cb) {
        cb(
            null,
        );
    },
    acl: "public-read",
    shouldTransform: true,
    transforms: [
        {
            id: "original",
            key: function (req, file, cb) {
                cb(
                    null,
                    `${getPath(req.originalUrl)}${Date.now()}-original-${file.originalname}`
                );
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize(800, 800).png());
            },
        },
    ],
});

const imageUpload = multer({
    storage,
});

const deleteFile = (files) => {
    if (files) {
        (files.constructor === Array ? [...files] : [files]).forEach((file) => {
            s3.deleteObject(
                {
                    Bucket: s3BucketConfig.bucket,
                    Key: file.constructor === String ? file : file.key,
                },
                function (err, data) {
                    if (err) return err
                    else console.log(data)
                }
            );
        });
    }
};


module.exports = { imageUpload, deleteFile };
