/**
 * @fileoverview This file declares a backend connection to database and main API endpoints
 */

import express, { Request, Response, Express } from "express";
import { Pool, QueryResult } from 'pg'
import cors from "cors";


const app: Express = express();
const PORT: any = process.env.PORT || 4000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())


app.get('/', (req: Request, res: Response) => {
    const pool = openDb()
    pool.query('select * from task', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message })
            console.error(error)
        } else {
            res.status(200).json(result.rows)
        }

    })
})

app.post('/new', (req: Request, res: Response) => {
    const pool = openDb()
    pool.query('insert into task (description) values ($1) returning *',
        [req.body.description], (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({ error: error.message })
                console.error(error)
            } else {
                res.status(200).json(result.rows)
            }

        })
})

app.delete('/delete/:id', async (req: Request, res: Response) => {
    const pool = openDb()
    const id = parseInt(req.params.id)

    pool.query('delete from task where id = $1',
        [id],
        (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({ error: error.message })
                console.error(error)
            } else {
                res.status(200).json({ id: id })
            }
        })
})

const openDb = (): Pool => {
    const pool: Pool = new Pool({
        connectionString: process.env.PG_CONNECTION_URI
    })
    return pool
}
app.listen(PORT)