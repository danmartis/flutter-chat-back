const { response } = require('express');
const Dispensary = require('../models/dispensary');
const Profile = require('../models/profile');
const ProductDispensary = require('../models/product_dispensary');
const createDispensary = async (req, res = response) => {

    const {
        dispensary,
        products
    } = req.body;




    const subscriptor = dispensary.subscriptor;
    const gramsRecipe = dispensary.gramsRecipe;
    const dateDelivery = dispensary.dateDelivery;
    const club = dispensary.club;
    try {



        const newDispensary = new Dispensary({
            subscriptor: subscriptor,
            gramsRecipe: gramsRecipe,
            club: club,
            dateDelivery: dateDelivery
        })

        const dispensary = await newDispensary.save();


        const promises = products.map((obj) =>

            new Promise((resolve, reject) => {

                const newPlantsProduct = new ProductDispensary({
                    product: obj.id,
                    dispensary: dispensary._id,
                    quantity: obj.quantityDispensary,

                });

                ProductDispensary.create(newPlantsProduct,
                    (err, data) => {
                        if (err) console.log(err);
                        else

                            resolve();
                    });
            }));
        Promise.all(promises)
            .then(() => {


                const productsDispensary = await ProductDispensary.find()
                return res.json({
                    ok: true,
                    dispensary,
                    productsDispensary

                });
            })



    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
};


const UpdateDispensary = async (req, res = response) => {
    const { subscriptor,
        id,



    } = req.body;



    try {



        const update = {
            isUpload: true,
            subscribeActive: true,
            isClubNotifi: true
        };


        await Dispensary.updateOne(
            {
                _id: id
            },
            {
                $set: update
            }
        );



        const dispensary = await Dispensary
            .findOne({ _id: id })



        res.json({
            ok: true,
            dispensary,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const UnSubscription = async (req, res = response) => {
    const {
        id,

    } = req.body;




    try {


        const update = {
            subscribeActive: false,
            subscribeApproved: false

        };


        await Subscription.updateOne(
            {
                _id: id
            },
            {
                $set: update
            }
        );


        const subscription = await Subscription
            .findOne({ _id: id })
        res.json({
            ok: true,
            subscription,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const getSubscribeByClubIdAndSubId = async (req, res = response) => {


    try {
        const userAuth = req.params.userauth;

        const userId = req.params.userid;


        const profileAuth = await Profile.findOne({ user: userAuth });

        isClub = profileAuth.isClub;


        if (isClub) {


            const subscription = await Subscription
                .findOne({ subscriptor: userId, club: userAuth })



            const profile = await Profile
                .findOne({ user: userId })

            const imageRecipe = (profile.imageRecipe == "") ? "" : profile.imageRecipe;

            const isUploadImageRecipe = (profile.imageRecipe == "") ? false : true;




            if (!subscription) {

                const newSubscription = new Subscription({
                    subscriptor: userId,
                    imageRecipe: imageRecipe,
                    club: userAuth,
                    subscribeActive: false,
                    isUpload: isUploadImageRecipe,
                });

                const subscription = await newSubscription.save();


                res.json({
                    ok: true,
                    subscription,
                })
            }

            else {



                res.json({
                    ok: true,
                    subscription,
                })
            }


        }

        else if (!isClub) {


            const subscription = await Subscription
                .findOne({ subscriptor: userAuth, club: userId })



            const profile = await Profile
                .findOne({ user: userAuth })

            const imageRecipe = (profile.imageRecipe == "") ? "" : profile.imageRecipe;

            const isUploadImageRecipe = (profile.imageRecipe == "") ? false : true;




            if (!subscription) {

                const newSubscription = new Subscription({
                    subscriptor: userAuth,
                    imageRecipe: imageRecipe,
                    club: userId,
                    subscribeActive: false,
                    isUpload: isUploadImageRecipe,
                });

                const subscription = await newSubscription.save();


                res.json({
                    ok: true,
                    subscription,
                })
            }

            else {

                res.json({
                    ok: true,
                    subscription,
                })
            }
        }





    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const disapproveSubscription = async (req, res = response) => {
    const {
        id,

    } = req.body;



    try {


        const update = {
            subscribeActive: false,
            subscribeApproved: false

        };


        await Subscription.updateOne(
            {
                _id: id
            },
            {
                $set: update
            }
        );


        const subscription = await Subscription
            .findOne({ _id: id })
        res.json({
            ok: true,
            subscription,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const approveSubscription = async (req, res = response) => {
    const {
        id,

    } = req.body;





    try {


        const update = {
            subscribeApproved: true,
            isUserNotifi: true

        };


        await Subscription.updateOne(
            {
                _id: id
            },
            {
                $set: update
            }
        );


        const subscription = await Subscription
            .findOne({ _id: id })
        res.json({
            ok: true,
            subscription,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}



module.exports = {
    createDispensary


}
