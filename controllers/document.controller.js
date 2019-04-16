const R = require("ramda");

const mongoose = require("mongoose");

const User = require('../models/user.model');
const Personalities = require('../models/personalities.model');
const Vehicle = require('../models/vehicle.model');
const Document = require('../models/document.model');

/**
 * To ma sens! Podczas tworzenia dokumentu system sprawdza odnajduje tylko ostatnio dodany dokument,
 * gdyż uważa, że skoro pojazd zmienił właściciela to poprzednie wpisy są nie ważne.
 * Podczas wyszukiwania poprzez qr code i tak odnajdzie np poprzedniego właściciela ale tylko posiadając kod od poprzedniego właściciela :P
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.create = async function (req, res, next) {
    let body = req.body.data; // {data:{vehicle:{}, personalities:{}}, userId}

    let doc = await Document.findOne(
        {
            //"personalities.numerPESELLubREGONWlascicielaPojazdu": body.personalities.numerPESELLubREGONWlascicielaPojazdu,
            "vehicle.numerIdentyfikacyjnyPojazdu": body.vehicle.numerIdentyfikacyjnyPojazdu
        })
        .sort({ "created_at" : -1 });
    const findOne = async () => {
        return await findDocumentsForMechanic_read([doc._id], req.body.userId)
    };
    if (!doc) {
        const doc = new Document({
            otherData: {base64: body.base64},
            personalities: new Personalities({...body.personalities}),
            vehicle: new Vehicle({...body.vehicle}),
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        if (await doc.save()) {
            if (await updateDocList(doc, req.body.userId)) {
                res.status(200).json({message: "updated list", data: doc})
            }
            else {
                res.status(404).json({message: "Save error"})
            }
        }
        else {
            res.status(404).json({message: "Save error"})
        }
    }
    else {
        if (doc.personalities.numerPESELLubREGONWlascicielaPojazdu.localeCompare(body.personalities.numerPESELLubREGONWlascicielaPojazdu)) {
            const newOwner = new Document({
                otherData: new OtherData({base64: body.base64}),
                personalities: new Personalities({...body.personalities}),
                vehicle: new Vehicle(doc.vehicle),
                created_at: Date.now(),
                updated_at: Date.now(),
            });
            if (await newOwner.save()) {
                if (await updateDocList(doc, req.body.userId)) {
                    doc = await findOne();
                    res.status(200).json({message: "updated list", data: doc[0]})
                }
                else {
                    res.status(404).json({message: "Save error"})
                }
            }
            else {
                res.status(404).json({message: "Save error"})
            }
        }
        else if(await User.findOne({documents: doc})){
            if (await User.findOne({_id: req.body.userId, "documents": mongoose.Types.ObjectId(doc._id)})) { //jeśli doc istnieje a ty posiadasz już jego id
                //TODO: To to samo zapytanie jest! Zedytu to niżej by działało!
                doc = await findDocumentForMechanic_create(doc._id, req.body.userId)
                res.status(200).json({message: "Client found", data: doc[0]})
            }
            else if (await updateDocList(doc, req.body.userId)) { // w przeciwnym wypadku updatuj swoja liste dokumentow
                doc = await findDocumentForMechanic_create(doc._id)
                res.status(200).json({message: "updated list", data: doc[0]})
            }
            else {
                res.status(404).json({message: "Save error"})
            }
        }
        else{
            await User.findOneAndUpdate({_id: req.body.userId}, {$push: {documents: doc._id}});
            doc = await findDocumentForMechanic_create(doc._id);
            res.status(200).json({message: "Client found", data: doc[0]})
        }
    }
};

module.exports.read = async (req, res, next) => {
    console.log("body", req.params) //works
    let ids;
    let docs;
    let user
    /**
     * header: application/json
     *    {
           "userId": Sting
        }

     */
    if (user = await User.findOne({_id: req.params.ids})) {
        ids = user.documents
    }

    //const ids = JSON.parse(req.params.ids);
    if (req.params.ids) { //fetch docs mechanic got
        if (user.permission) { //jesli mechanik, przesortuj repairs history wg userId (aggregate) <- zwraca tylko trwajace naprawy
            docs = await findDocumentsForMechanic_read(ids, req.params.ids);
        }
        else { //zwróć wszystkie dokumenty dla wlasciciela dowodu (nie mechanika) <- ten chce widziec wszystkie trwajace i zakonczone naprawy
            docs = await Document
                .find({_id: {$in: R.map(item => mongoose.Types.ObjectId(item), ids)}});
            console.log('tu2', docs)
        }
    }
    else { //reserch in all
        docs = await Document
            .find({})
            .exec();
    }

    if (!docs) {
        res.json({message: "doc not exist"}).status(404)
    }
    else {
        res.status(200).json({data: docs})
    }
    //console.log("DOCS:", docs)
};


/**
 * MIDDLEWARE
 * @param doc
 * @param userId
 * @returns {Promise<number>}
 */


const updateDocList = async (doc, userId) => {
    const status = await User.findOneAndUpdate({_id: userId}, {$push: {documents: doc._id}});
    if (status) {
        return 1
    }
    return 0
};

const findDocumentsForMechanic_read = async (ids, userId) => {
    return await Document.aggregate([
        {$match: {"_id": {"$in": ids}}},
        {$unwind: "$vehicle.repairsHistory"},
        {$match: {$or: [{"vehicle.repairsHistory.userId": mongoose.Types.ObjectId(userId)}, {"vehicle.repairsHistory.finished": true}]}},
        {
            $group: {
                _id: "$_id",
                base64: {$first: "$base64"},
                personalities: {$first: "$personalities"},
                vehicle: {$first: "$vehicle"},
                repairsHistory: {$push: "$vehicle.repairsHistory"},
            }
        },
        {
            $project: {
                base64: 1,
                personalities: 1,
                vehicle: {$mergeObjects: ["$vehicle", {"repairsHistory": "$repairsHistory"}]},
            }
        },
        {
            $match: {
                "vehicle.repairsHistory": {
                    $elemMatch: {
                        $and: [
                            {userId: mongoose.Types.ObjectId(userId)},
                            {finished: false}
                        ]

                    }
                }
            }
        }

    ]).exec();
};

const findDocumentForMechanic_create = async (docId, userId = false) => {
    if (!userId) return await Document.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(docId)}},
        {
            $unwind:
                {
                    path: "$vehicle.repairsHistory",
                    preserveNullAndEmptyArrays: true
                }
        },
        {$match: {$or: [{"vehicle.repairsHistory.finished": true}, {"vehicle.repairsHistory.0": {$exists: false}}]}},
        {
            $group: {
                _id: "$_id",
                base64: {$first: "$base64"},
                personalities: {$first: "$personalities"},
                vehicle: {$first: "$vehicle"},
                repairsHistory: {$push: "$vehicle.repairsHistory"},
            }
        },
        {
            $project: {
                base64: 1,
                personalities: 1,
                vehicle: {$mergeObjects: ["$vehicle", {"repairsHistory": "$repairsHistory"}]}
            }
        }
    ]).exec();
    else return await Document.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(docId)}},
        {
            $unwind:
                {
                    path: "$vehicle.repairsHistory",
                    preserveNullAndEmptyArrays: true
                }
        },
        {$match: {$or: [{"vehicle.repairsHistory.userId": mongoose.Types.ObjectId(userId)}, {"vehicle.repairsHistory.finished": true}, {"vehicle.repairsHistory.0": {$exists: false}}]}},
        {
            $group: {
                _id: "$_id",
                base64: {$first: "$base64"},
                personalities: {$first: "$personalities"},
                vehicle: {$first: "$vehicle"},
                repairsHistory: {$push: "$vehicle.repairsHistory"},
            }
        },
        {
            $project: {
                base64: 1,
                personalities: 1,
                vehicle: {$mergeObjects: ["$vehicle", {"repairsHistory": "$repairsHistory"}]}
            }
        }
    ]).exec();
}