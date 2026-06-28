import { model } from "mongoose";
import { jobSchema } from "../Schemas/JobSchema.js";

const JobData = model("jobdata", jobSchema);

export { JobData };