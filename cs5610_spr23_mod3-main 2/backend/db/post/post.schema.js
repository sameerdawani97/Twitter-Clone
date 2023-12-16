const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        require: true,
    }
    
}, { collection : 'post' });

