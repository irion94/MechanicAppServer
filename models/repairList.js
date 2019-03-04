let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const RepairSchema = require('../models/repair').Schema;

const RepairListSchema = new Schema(
    {
        repairsList: [RepairSchema],
        finished: Boolean,
        created_at: {type: Date},
        updated_at: {type: Date}
    }
);

const RepairList = mongoose.model('RepairList', RepairListSchema);
module.exports = RepairList;
module.exports.Schema = RepairListSchema;