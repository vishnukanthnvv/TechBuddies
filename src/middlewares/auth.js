const authAdmin = (req, res, next) => {
    let token = "xyz";
    let isAdmin = token === "xyz";

    if(!isAdmin){
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
}

const authUser = (req, res, next) => {
    let token = "abc";
    let isValidUser = token === "abc";

    if(!isValidUser){
        res.status(401).send("Not valid user");
    } else {
        next();
    }
}

module.exports = {
    authAdmin,
    authUser
}