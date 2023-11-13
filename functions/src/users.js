import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "./dbConnect.js";
import { secretKey } from "./creds.js";

const coll = db.collection('users')

export async function createUser(req, res){
    const { email, password } = req.body
    if(!email || !password || email.length < 6 || password.length < 6){
        res.status(400).send({ message: 'Invalid email or password'})
        return;
    }
    const hashedPw = await bcrypt.hash(password, 10) // generates salt(10) and hashes
    await coll.add({ email: email.toLowerCase(), password: hashedPw })
    login(req, res);
}

export async function login(req, res){
    const { email, password } = req.body
    const userColl = await coll.where('email', '==', email.toLowerCase()) //authenticates
                                .get()
    const users = userColl.docs.map(doc => ({ id: doc.id, ...doc.data() }))// [0] says just give me the first element of this array. 
    const user = users.filter(user => bcrypt.compareSync(password, user.password))[0];
    if(!user){
        res.status(400).send({ message: 'Not authorized; missing or bad email or password'})
        return;
    }
    delete user.password; //this removes password from user object because we don't want the password being sent to the frontend.
    const token = jwt.sign(user, secretKey)
    res.send({ token })
}