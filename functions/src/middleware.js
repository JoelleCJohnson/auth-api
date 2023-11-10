import jwt from "jsonwebtoken"
import { secretKey } from "./creds.js"

export async function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    //do they have a token?
    if (!authorization) {
        res.status(401).send({ message: "No authorization token found" });
        //is that token valid
    }
        jwt.verify(authorization, secretKey, (err, decoded) => {
            if (err) { //if invalid token:
                res.status(401).send(err);
                return;
            }//else, if valid token:
            req.locals = decoded; //attach our toekn to request
            //if token is valid, go on to the next function in API.
            next();
        })
    }
