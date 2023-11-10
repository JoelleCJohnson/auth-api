import jwt from "jsonwebtoken"
import { secretKey } from "./creds.js"

export async function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    //do they have a token?
    if (!authorization) {
        res.status(401).send({ message: "No authorization token found" });
        //is that token valid
        jwt.verify(authorization, secretKey)
            .then(decoded => { //valid token:
                req.locals = decoded; //attach our decoded token to the request.
                // if so, go on
                next();
            })
            .catch(err => { //invalid token:
                res.status(401).send(err);
            });
    }

}