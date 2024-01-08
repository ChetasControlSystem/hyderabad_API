const mongoose = require('mongoose');

// Schema for a single menu item
const menuItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    icon: {
        type: String,
        required: false,
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: false,
    },
    sidemenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sidemenu',
        required: false,
    },
    children: [
        {
            title: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
            link: {
                type: String,
                required: false,
            },
            permission: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission',
                required: false,
            },
        },
    ],
},
{
    timestamps: true,
    versionKey: false
});

// Model for the entire sidemenu
const MenuItem = mongoose.model('sidemenu', menuItemSchema);

module.exports = MenuItem;
