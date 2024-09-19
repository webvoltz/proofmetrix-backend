const s3BucketConfig = {
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    baseUrl: process.env.S3_BASE_URL,
    bucket: process.env.S3_BUCKET, 
    region: process.env.S3_REGION
}

module.exports = { s3BucketConfig }