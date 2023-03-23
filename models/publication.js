const mongoose = require('mongoose')
const Schema = mongoose.Schema

const publicationSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    slno: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    journal: {
        name: {
            type: String,
            required: true
        },
        publisher: {
            type: String
        },
        issn: {
            type: String
        },
        vol: {
            type: Number
        },
        issue: {
            type: Number
        },
        pageno: {
            type: String
        },
    },
    // conference: {
    //     name: {
    //         type: String
    //     },
    //     isbn: {
    //         type: Number
    //     },

    // },
    doi: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }

})

module.exports = mongoose.model('Publication', publicationSchema)
    /*
user.userid,

serial no
title
date
year

journal => name,issn,volume,issue,page no
conference => name,
 
DOI
*/