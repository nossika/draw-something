const fs = require('fs');
const path = require('path');
const fileList = fs.readdirSync(__dirname);

module.exports = router => {
    fileList.forEach(filename => {
        if (filename.includes('index')) return;
        require(path.resolve(__dirname, filename))(router);
    });
};