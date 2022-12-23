
const multer = require('multer');
const ipfsClient = require("ipfs-http-client")
const path = require('path');
const fs = require('fs');

var express = require('express');
var router = express.Router();

const MAX_SIZE = 52428800;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ storage });
const projectId = '2IxG61IZGKcMXQxMv3anLwsByja';   // <---------- your Infura Project ID

const projectSecret = '7cb4ffdec80fa3b5fbeef6480485f064';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
})


/*  upload POST endpoint */
router.post('/', upload.single('file'),async  (req, res) => {
  console.log( "filee",req.file)

  if (!req.file) {
    return res.status(422).json({
      error: 'File needs to be provided.',
    });
  }

  const mime = req.file.mimetype;
  // if (mime.split('/')[0] !== 'image') {
  //   fs.unlink(req.file.path,(err)=>{
  //     c
  //   }); 

  //   return res.status(422).json({ 
  //     error: 'File needs to be an image.' ,
  //   }); 
  // }

  // const fileSize = req.file.size ;
  // if (fileSize > MAX_SIZE) { 
  //   fs.unlink(req.file.path,callback) ;

  //   return res.status(422).json({ 
  //     error: `Image needs to be smaller than ${MAX_SIZE} bytes.` ,
  //   }); 
  // }
  const data = fs.readFileSync(req.file.path); 
  const uploadResult = await ipfs.add(data)
  console.log("uploadResult",uploadResult) 
  return res.json({ 
    hash: uploadResult ,
  });
  
});

/*  upload GET endpoint. */
router.get('/', function(req, res, next) {
  res.send('Upload endpoint!');
});

module.exports = router;
