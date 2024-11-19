// import multer, { FileFilterCallback, MulterError } from 'multer';
// import multerS3 from 'multer-s3';
// import AWS from 'aws-sdk';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { S3Client } from '@aws-sdk/client-s3';
// // Configure AWS SDK with credentials
// // AWS.config.update({
// //     region: process.env.AWS_REGION,
// //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// // });

// const s3Config = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials:{
//        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//    }
//  })

// const bucketName = process.env.AWS_BUCKET_NAME;

// // Define the allowed file types
// const whitelistFile = ['text/csv', 'application/vnd.ms-excel'];
// const whitelistImages = [
//     'image/png',
//     'image/jpeg',
//     'image/jpg',
//     'image/webp',
//     'image/svg+xml',
//     'image/gif',
// ];

// // Define the file filter function with types
// const fileFilter: multer.Options['fileFilter'] = (req, file, cb: FileFilterCallback) => {
//     if (file.fieldname === 'uploadedFiles' && !whitelistFile.includes(file.mimetype)) {
//         return cb(new Error('File is not a valid csv.'));
//     }
//     if (file.fieldname === 'uploadedImages' && !whitelistImages.includes(file.mimetype)) {
//         return cb(new Error('File is not a valid image.'));
//     }
//     cb(null, true);
// };

// // Define the multer upload middleware
// const upload = multer({
//     storage: multerS3({
//         s3: s3Config,
//         bucket: bucketName,
//         acl: 'public-read',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: (req, file, cb) => {
//             cb(null, Date.now() + '--' + file.originalname);
//         },
//     }),
//     limits: {
//         fileSize: 20 * 1024 * 1024, // no larger than 20MB
//     },
//     fileFilter,
// }).fields([
//     { name: 'uploadedFiles', maxCount: 1 },
//     { name: 'uploadedImages', maxCount: 10 },
// ]);

// // Define the TypeScript signature for the Next.js API middleware
// const multerMiddleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
//     upload(req, res, (err: Error | MulterError) => {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json({
//                 status: '500',
//                 error: err.name,
//                 message: `File upload error: ${err.message}`,
//                 description: err,
//             });
//         }
//         if (err) {
//             console.error(err);
//             return res.status(500).json({
//                 status: '500',
//                 error: 'FILE UPLOAD ERROR',
//                 message: 'Something went wrong during the file upload',
//                 description: err,
//             });
//         }
//         next();
//     });
// };

// export default multerMiddleware;
