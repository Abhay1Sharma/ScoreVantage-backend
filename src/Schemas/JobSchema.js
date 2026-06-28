import { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        job_title: {
            type: String,
            required: true,
        },

        skills: {
            type: String,
            required: true,
        },

        benefits: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        department: {
            type: String,
            required: true,
        },

        benefits: {
            type: String,
            required: true,
        },

        companyName: {
            type: String,
            required: true,
        },

        companyLogo: {
            type: String,
            required: true,
        },

        applyLink: {
            type: String,
            required: true,
        },

        responsibilities: {
            type: String,
            required: true,
        },

        healthInsurance: {
            type: String,
            required: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

    }, { timestamps: true }
)

export { jobSchema };