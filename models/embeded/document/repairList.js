let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const RepairSchema = require('./post.model').Schema;

const RepairListSchema = new Schema(
    {
        repairsList: [RepairSchema],
        finished: Boolean,
        deadLine: {type: Date},
        created_at: {type: Date},
        updated_at: {type: Date},
        vehicleId: {type: Schema.Types.ObjectId, ref: 'Vehicle'},
        userId: {type: Schema.Types.ObjectId, ref: 'User'}
    }
);

const RepairList = mongoose.model('RepairList', RepairListSchema);
module.exports = RepairList;
module.exports.Schema = RepairListSchema;