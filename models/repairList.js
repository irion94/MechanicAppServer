let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const RepairSchema = require('../models/repair').Schema;

const RepairListSchema = new Schema(
    {
        repairsList: [{RepairSchema}],
        finished: Boolean,
        ctreated_at: Date,
        updated_at: Date
    }
);

const RepairList = mongoose.model('RepairList', RepairListSchema);
module.exports = RepairList;
module.exports.Schema = RepairListSchema;