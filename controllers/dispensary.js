const { response } = require('express');
const Dispensary = require('../models/dispensary');
const Profile = require('../models/profile');
const ProductDispensary = require('../models/product_dispensary');
const Product = require('../models/product');
const Favorite = require('../models/favorite');



const getDispensaryActive = async (req, res = response) => {


    const uid = req.params.uid;
    try {

        const productsDispensary = [];

        const dispensary = await Dispensary.findOne({ isActive: true, subscriptor: uid, isDelivered: false });

        if (dispensary) {

            const dispensaryId = dispensary._id;

            const products = await ProductDispensary.find({ dispensary: dispensaryId })

            if (products.length > 0) {
                const promises = products.map((obj) =>

                    new Promise((resolve, reject) => {

                        const id = obj.product;
                        Product.findById(id)
                            .then((product) => {


                                Favorite.findOne({
                                    product: product._id, user: product.user
                                })
                                    .then((favorite) => {


                                        const isLike = (favorite) ? favorite.isLike : false;


                                        Favorite.find({
                                            product: product._id, isLike: true
                                        })
                                            .then((favorites) => {


                                                const countLikes = (favorites) ? favorites.length : 0;


                                                const productDispensary = {

                                                    id: product._id,
                                                    user: product.user,
                                                    name: product.name,
                                                    description: product.description,
                                                    dateCreate: product.createdAt,
                                                    dateUpdate: product.updateAt,
                                                    coverImage: product.coverImage,
                                                    catalogo: product.catalogo,
                                                    ratingInit: product.ratingInit,
                                                    cbd: product.cbd,
                                                    thc: product.thc,
                                                    isLike: isLike,
                                                    quantityDispensary: obj.quantity,
                                                    countLikes: countLikes


                                                };

                                                productsDispensary.push(productDispensary);
                                                resolve();




                                            })

                                    })



                            })
                    }));
                Promise.all(promises)
                    .then(() => {


                        return res.json({
                            ok: true,
                            dispensary: dispensary,
                            productsDispensary

                        });

                    })

            }

            else {

                return res.json({
                    ok: true,
                    dispensary: dispensary,
                    productsDispensary

                });


            }
        }

        else {

            return res.json({
                ok: false,
                dispensary: dispensary,
                productsDispensary

            });


        }


    } catch (error) {


        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}


const getDispensariesProductsByUser = async (req, res = response) => {


    const uid = req.params.clubId;
    const subId = req.params.subId;

    try {

        const dispensariesProducts = [];

        const profile = await Profile.findOne({ user: uid });


        if (profile.isClub) {

            const dispensaries = await Dispensary.find({ subscriptor: subId, club: uid });






            if (dispensaries.length > 0) {


                const promises = dispensaries.map((dispensary) =>


                    new Promise((resolve, reject) => {


                        console.log('ello!');


                        const dispensaryItem = {

                            id: dispensary._id,
                            subscriptor: dispensary.subscriptor,
                            gramsRecipe: dispensary.gramsRecipe,
                            club: dispensary.club,
                            dateDelivery: dispensary.dateDelivery,
                            isActive: dispensary.isActive,
                            isDelivered: dispensary.isDelivered,
                            isCancel: dispensary.isCancel,
                            isUpdate: dispensary.isUpdate,
                            isUserNotifi: dispensary.isUserNotifi,

                            isClubNotifi: dispensary.isClubNotifi,
                            isEdit: dispensary.isEdit,
                            createdAt: dispensary.createdAt,
                            updatedAt: dispensary.updatedAt,
                            productsDispensary: []

                        }


                        dispensariesProducts.push(dispensaryItem);
                        resolve();







                    }));
                Promise.all(promises)
                    .then(() => {

                        ProductDispensary
                            .find()
                            .populate('product')

                            .then((products) => {


                                if (products.length > 0) {

                                    const promisesProducts = products.map((productDispensary) =>


                                        new Promise((resolve, reject) => {

                                            //const productId = product._id;




                                            const productQuantity = {

                                                id: productDispensary.product._id,
                                                user: productDispensary.product.user,
                                                name: productDispensary.product.name,
                                                description: productDispensary.product.description,
                                                createdAt: productDispensary.product.createdAt,
                                                updatedAt: productDispensary.product.updatedAt,
                                                totalProducts: productDispensary.product.totalProducts,
                                                coverImage: productDispensary.product.coverImage,
                                                catalogo: productDispensary.product.catalogo,
                                                ratingInit: productDispensary.product.ratingInit,
                                                cbd: productDispensary.product.cbd,
                                                thc: productDispensary.product.thc,
                                                isLike: false,
                                                countLikes: 0,
                                                quantityDispensary: productDispensary.quantity

                                            };



                                            var dispensaryId = String(productDispensary.dispensary);

                                            const find = dispensariesProducts.find(function (item) {
                                                return String(item.id) == dispensaryId
                                            });


                                            if (find) {



                                                console.log('FIN!', find);

                                                find.productsDispensary.push(productQuantity);
                                                resolve();

                                            }

                                            else {

                                                resolve();
                                            }












                                        }))

                                    Promise.all(promisesProducts)
                                        .then((resolve) => {

                                            const dispensaryCreateAt = dispensariesProducts.sort((a, b) => {



                                                return new Date(b.createdAt) - new Date(a.createdAt);
                                            });



                                            return res.json({
                                                ok: true,
                                                dispensariesProducts: dispensaryCreateAt

                                            });



                                        });

                                }
                                else {

                                    const dispensaryCreateAt = dispensariesProducts.sort((a, b) => {



                                        return new Date(b.createdAt) - new Date(a.createdAt);
                                    });

                                    return res.json({
                                        ok: false,
                                        dispensariesProducts: dispensaryCreateAt


                                    });


                                }

                            })




                    })

            }

            else {




                return res.json({
                    ok: false,
                    dispensariesProducts


                });


            }

        }

        else {

            const dispensaries = await Dispensary.find({ subscriptor: subId });


            if (dispensaries.length > 0) {


                const promises = dispensaries.map((dispensary) =>


                    new Promise((resolve, reject) => {


                        console.log('ello!');


                        const dispensaryItem = {

                            id: dispensary._id,
                            subscriptor: dispensary.subscriptor,
                            gramsRecipe: dispensary.gramsRecipe,
                            club: dispensary.club,
                            dateDelivery: dispensary.dateDelivery,
                            isActive: dispensary.isActive,
                            isDelivered: dispensary.isDelivered,
                            isCancel: dispensary.isCancel,
                            isUpdate: dispensary.isUpdate,
                            isUserNotifi: dispensary.isUserNotifi,

                            isClubNotifi: dispensary.isClubNotifi,
                            isEdit: dispensary.isEdit,
                            createdAt: dispensary.createdAt,
                            updatedAt: dispensary.updatedAt,
                            productsDispensary: []

                        }


                        dispensariesProducts.push(dispensaryItem);
                        resolve();







                    }));
                Promise.all(promises)
                    .then(() => {

                        ProductDispensary
                            .find()
                            .populate('product')

                            .then((products) => {


                                if (products.length > 0) {

                                    const promisesProducts = products.map((productDispensary) =>


                                        new Promise((resolve, reject) => {

                                            //const productId = product._id;




                                            const productQuantity = {

                                                id: productDispensary.product._id,
                                                user: productDispensary.product.user,
                                                name: productDispensary.product.name,
                                                description: productDispensary.product.description,
                                                createdAt: productDispensary.product.createdAt,
                                                updatedAt: productDispensary.product.updatedAt,
                                                totalProducts: productDispensary.product.totalProducts,
                                                coverImage: productDispensary.product.coverImage,
                                                catalogo: productDispensary.product.catalogo,
                                                ratingInit: productDispensary.product.ratingInit,
                                                cbd: productDispensary.product.cbd,
                                                thc: productDispensary.product.thc,
                                                isLike: false,
                                                countLikes: 0,
                                                quantityDispensary: productDispensary.quantity

                                            };



                                            var dispensaryId = String(productDispensary.dispensary);

                                            const find = dispensariesProducts.find(function (item) {
                                                return String(item.id) == dispensaryId
                                            });


                                            if (find) {



                                                console.log('FIN!', find);

                                                find.productsDispensary.push(productQuantity);
                                                resolve();

                                            }

                                            else {

                                                resolve();
                                            }












                                        }))

                                    Promise.all(promisesProducts)
                                        .then((resolve) => {


                                            const dispensaryCreateAt = dispensariesProducts.sort((a, b) => {



                                                return new Date(b.createdAt) - new Date(a.createdAt);
                                            });

                                            return res.json({
                                                ok: true,
                                                dispensariesProducts: dispensaryCreateAt

                                            });



                                        });

                                }
                                else {

                                    const dispensaryCreateAt = dispensariesProducts.sort((a, b) => {



                                        return new Date(b.createdAt) - new Date(a.createdAt);
                                    });

                                    return res.json({
                                        ok: false,
                                        dispensariesProducts: dispensaryCreateAt


                                    });


                                }

                            })




                    })

            }

            else {



                return res.json({
                    ok: false,
                    dispensariesProducts


                });


            }
        }


    } catch (error) {


        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}


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
            isUserNotifi: true,
            dateDelivery: dateDelivery
        })

        const dispensaryCreate = await newDispensary.save();


        const promises = products.map((obj) =>

            new Promise((resolve, reject) => {

                const newPlantsProduct = new ProductDispensary({
                    product: obj.id,
                    dispensary: dispensaryCreate._id,
                    quantity: obj.quantityDispensary,
                    isUserNotifi: true,

                });

                if (newPlantsProduct.quantity > 0) {
                    ProductDispensary.create(newPlantsProduct,
                        (err, data) => {
                            if (err) console.log(err);
                            else

                                resolve();
                        });
                }
                else {
                    resolve();
                }



            }));
        Promise.all(promises)
            .then(() => {


                ProductDispensary.find({ dispensary: dispensaryCreate._id })
                    .then((productsDispensary) => {

                        return res.json({
                            ok: true,
                            dispensary: dispensaryCreate,
                            productsDispensary

                        });
                    })

            })



    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
};


const UpdateDispensary = async (req, res = response) => {
    const {
        dispensary,
        products
    } = req.body;




    try {



        const update = {

            gramsRecipe: dispensary.gramsRecipe,

            dateDelivery: dispensary.dateDelivery,

            isEdit: true,
            isUserNotifi: true,


        };


        await Dispensary.updateOne(
            {
                _id: dispensary.id
            },
            {
                $set: update
            }
        );



        const dispensaryUpdate = await Dispensary.findById(dispensary.id);

        const promises = products.map((obj) =>

            new Promise((resolve, reject) => {

                const newProduct = new ProductDispensary({
                    product: obj.id,
                    dispensary: dispensary.id,
                    quantity: obj.quantityDispensary,
                    isUserNotifi: true,

                });


                ProductDispensary.findOne({ dispensary: dispensary.id, product: obj.id })
                    .then((productDispensary) => {

                        if (productDispensary) {

                            const updateProductDispensary = {
                                quantity: obj.quantityDispensary
                            }


                            ProductDispensary.updateOne(

                                {
                                    _id: productDispensary._id
                                },
                                {
                                    $set: updateProductDispensary
                                }, (err, data) => {
                                    if (err) console.log(err);
                                    else

                                        resolve();
                                });



                        }

                        else {
                            if (newProduct.quantity > 0) {

                                ProductDispensary.create(newProduct,
                                    (err, data) => {
                                        if (err) console.log(err);
                                        else

                                            resolve();
                                    });
                            }

                            else {

                                resolve();
                            }





                        }

                    })

            }));
        Promise.all(promises)
            .then(() => {





                return res.json({
                    ok: true,
                    dispensary: dispensaryUpdate,
                    //productsDispensary


                })

            })




    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const UpdateDeliveredDispensary = async (req, res = response) => {


    const id = req.params.id;




    try {



        const update = {

            isDelivered: true,
            isUserNotifi: true,
        };


        await Dispensary.updateOne(
            {
                _id: id
            },
            {
                $set: update
            }
        );



        const dispensaryUpdate = await Dispensary.findById(id);




        return res.json({
            ok: true,
            dispensary: dispensaryUpdate,
            //productsDispensary

        })




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
    createDispensary,
    getDispensaryActive,
    UpdateDispensary,
    UpdateDeliveredDispensary,
    getDispensariesProductsByUser


}

