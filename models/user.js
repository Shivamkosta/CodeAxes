const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        confirm_password :{
            type:String,
            required:true
        }, 
        photo:String,
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual("password","confpassword")
    .set(function(password,confpassword) {
        this._password = password;
        this.confpassword = confpassword;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
        this.confirm_password = this.encryptPassword(password);

    })
    .get(function() {
        return (
            this._password,
            this.confpassword
        );
        
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return (this.encryptPassword(plainText) === this.hashed_password,
            this.encryptPassword(plainText) === this.confirm_password);
        
        
    },

    encryptPassword: function(password,confpassword) {
        if (!password && !confpassword) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);
