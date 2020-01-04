const fs = require('fs');
const path = require('path');
const mainPath = require('./path');

exports.deleteFile = (filePath) => {

    fs.unlink(path.join(mainPath, filePath), (err) => {
        if (err) {
            throw (err);
        }
        console.log('File deleted at: ' + filePath);
    });
};