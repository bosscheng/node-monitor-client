const path = require('path');
module.exports = {
    server: {
        development: "http://localhost:3000",
        production: "http://xxx.com"
    },
    logDir: {
        development: path.join(__dirname, '../test/logs/test.log'),
        production: ''
    },
    programName:{
        development:'',
        production:''
    }

};
