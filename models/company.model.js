let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const CompanySchema = new Schema(
    {
        krs: {
            nip: String,
            regon: String,
        },
        owner: {
            name: String,
            surname: String,
        },
        address: {
            city: String,
            street: String,
            zip: String,
        },
        contact:{
            phone: String,
            contactEmail: String,
        }

    }
);

module.exports.Company = CompanySchema;
module.exports.Company = mongoose.model('Company', CompanySchema);