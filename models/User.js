import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    clerkId: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    email: {type: String, required: true, unique: true},
    imageUrl: {type: String, default: ''},
    role: {type: String, required: true, default: 'donor', enum: ['donor', 'organization', 'admin']},
    cartItems: {type: Object, default: {}}, // Keep for compatibility
    date: {type: Number, default: Date.now}
}, {minimize: false});

const User = mongoose.models.user || mongoose.model('user', userSchema);
export default User;
