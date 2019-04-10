const R = require("ramda");

const mongoose = require("mongoose");

const User = require('../models/user.model');
const Personalities = require('../models/personalities.model')
const Vehicle = require('../models/vehicle.model')

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
    //console.log(body);
    //console.log(req.body);

    let doc = await Document.findOne(
        {
            //"personalities.numerPESELLubREGONWlascicielaPojazdu": body.personalities.numerPESELLubREGONWlascicielaPojazdu,
            "vehicle.numerIdentyfikacyjnyPojazdu": body.vehicle.numerIdentyfikacyjnyPojazdu
        })
        .sort({ "created_at" : -1 });
    if (!doc) {
        console.log("tu1")
        const doc = new Document({
            personalities: new Personalities({...body.personalities}),
            vehicle: new Vehicle({...body.vehicle}),
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        //console.log(document)

        if (await doc.save()) {
            await User.findOneAndUpdate({_id: req.body.userId}, {$push: {documents: doc._id}});
            res.status(201).json({message: "Create new client"})
        }
        else {
            res.status(404).json({message: "Save error"})
        }
    }
    else {
        console.log("tu2")
        if(!doc.personalities.numerPESELLubREGONWlascicielaPojazdu.localeCompare(body.personalities.numerPESELLubREGONWlascicielaPojazdu)){
            const newOwner = new Document({
                personalities: new Personalities({...body.personalities}),
                vehicle: new Vehicle(doc.vehicle),
                created_at: Date.now(),
                updated_at: Date.now(),
            });
            if (await newOwner.save()) {
                await User.findOneAndUpdate({_id: req.body.userId}, {$push: {documents: doc._id}});
                res.status(201).json({message: "Create new client"})
            }
            else {
                res.status(404).json({message: "Save error"})
            }
        }
        else if(await User.findOne({documents: doc})){
            res.status(200).json({message: "Client found", data: doc})
        }
        else{
            await User.findOneAndUpdate({_id: req.body.userId}, {$push: {documents: doc._id}});
            res.status(200).json({message: "Client found", data: doc})
        }
    }
};


module.exports.read = async (req, res, next) => {
    //console.log(req.params)
    console.log("body", req.params) //works
    let docs;
    /**
     * header: application/json
     *    {
           "ids": [
              "5caca47d9c9305b72fae503a"
              "other ids"
           ]
        }

     */
    const ids = JSON.parse(req.params.ids);
    console.log(ids)
    if (req.params.ids) { //fetch docs mechanic got
        if(req.params.permission){ //jesli mechanik, przesortuj repairs history wg userId (aggregate)
            docs = await Document
                .find({_id: {$in: R.map(item => mongoose.Types.ObjectId(item), ids)}})
                .exec();
            console.log(docs)
        }
        else{ //zwróć wszystkie dokumenty z wg listy id
            docs = await Document
                .find({_id: {$in: R.map(item => mongoose.Types.ObjectId(item), ids)}})
                .exec();
            console.log(docs)
        }
    }
    // else if (req.body.id) { //find one
    //     docs = await Document
    //         .find(res.body.id)
    //         .exec();
    // }
    else { //reserch in all
        docs = await Document
            .find({})
            .exec();
    }

    if (!docs) {
        res.status(404).json({message: "doc not exist"})
    }
    //console.log("DOCS:", docs)
    res.status(200).json({data: docs})
};
