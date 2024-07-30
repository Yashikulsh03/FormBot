// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema({
// //     name:{
// //         type:String,
// //         required:true
// //     },
// //     email:{
// //         type:String,
// //         unique:true,
// //         required:true
// //     },
// //     password:{
// //         type:String,
// //         required:true
// //     }
// // });

// // module.exports = mongoose.model('User', userSchema);

// const mongoose = require("mongoose");


// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     tokens: [{
//         token: {
//             type: String,
//             required: true
//         }
//     }]
// });


// const User = mongoose.model('User', userSchema);
// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form'
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;



