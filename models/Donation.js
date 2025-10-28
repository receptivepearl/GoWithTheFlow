import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorId: {type: String, required: true, ref: 'user'},
    organizationId: {type: String, required: true, ref: 'organization'},
    items: [{
        productType: {type: String, required: true},
        name: {type: String, required: true},
        quantity: {type: Number, required: true},
        description: {type: String, default: ''}
    }],
    totalItems: {type: Number, required: true},
    status: {type: String, required: true, default: 'pending'}, // pending, confirmed, delivered, cancelled
    donorName: {type: String, required: true},
    donorEmail: {type: String, required: true},
    organizationName: {type: String, required: true},
    date: {type: Number, required: true},
    notes: {type: String, default: ''}
});

const Donation = mongoose.models.donation || mongoose.model('donation', donationSchema);
export default Donation;







