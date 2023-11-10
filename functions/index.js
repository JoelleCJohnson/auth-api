import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

//non protected routes
app.post('/user', createUser)
app.post('/user/login', login)
app.get('/recipes', getAllRecipes)

//protected routes
app.post('/recipes', createRecipe)
app.patch('/recipes/:recipeId', updateRecipe)

export const api = onRequest(app)
