const db = require('../../configs/db')
const format = require('pg-format')

module.exports = {
    getMovies: async ({ search, order_by, order, page, limit }) => {
        try {
            let query = format('SELECT * FROM public.movies')
            if (search) {
                query = format(query + ' WHERE title LIKE \'%%%s%%\' AND deleted_at ISNULL', search)
            }

            if (order_by) {
                query = format(query + ' ORDER BY %s', order_by)
            }

            if (order) {
                query = format(query + ' %s', order)
            }

            if (page && limit) {
                const offset = (page - 1) * limit
                query = format(query + ' LIMIT %s OFFSET %s;', limit, offset)
            }

            const { rows } = await db.query('SELECT COUNT(id) as "count" FROM public.movies')
            const counts = rows[0].count

            const meta = {
                next:
                    page == Math.ceil(counts / limit)
                        ? null
                        : `/api/v1/movies?search=${search}&order_by=${order_by}&order=${order}&page=${Number(page) + 1}&limit=${limit}`,
                prev:
                    page == 1
                        ? null
                        : `/api/v1/movies?all?search=${search}&order_by=${order_by}&order=${order}&page=${Number(page) - 1}&limit=${limit}`,
                counts
            }

            const prods = await db.query(query)
            return { data: prods.rows, meta }
        } catch (error) {
            return new Error(`SQL : ${error.sqlMessage}`)
        }
    },
    getMovieById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM public.movies WHERE id=$1;', [id])
                .then((data) => {
                    resolve(data.rows)
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    addMovie: ({ title, thumbnail, director, duration_hour, duration_minute, release_date, synopsis }) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO public.movies (title, thumbnail, director, duration_hour, duration_minute, release_date, synopsis, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7, now(), null, null);', [
                title,
                thumbnail,
                director,
                duration_hour,
                duration_minute,
                release_date,
                synopsis
            ]).then(() => {
                resolve('Successfully add movie')
            }).catch((error) => {
                reject(new Error(`SQL : ${error.sqlMessage}`))
            })
        })
    },
    updateMovie: ({ id, title, thumbnail, director, duration_hour, duration_minute, release_date, synopsis }) => {
        return new Promise((resolve, reject) => {
            // let query = 'UPDATE public.movies SET title %s=\'%s\' WHERE %s=\'%s\';'
            let query = 'UPDATE public.movies SET'

            if (title) {
                query = format(query + ' title=\'%s\',', title)
            }

            if (thumbnail) {
                query = format(query + ' thumbnail=\'%s\',', thumbnail)
            }

            if (director) {
                query = format(query + ' director=\'%s\',', director)
            }

            if (duration_hour) {
                query = format(query + ' duration_hour=\'%s\',', duration_hour)
            }

            if (duration_minute) {
                query = format(query + ' duration_minute=\'%s\',', duration_minute)
            }

            if (release_date) {
                query = format(query + ' release_date=\'%s\',', release_date)
            }

            if (synopsis) {
                query = format(query + ' synopsis=\'%s\',', synopsis)
            }

            db.query(format(query + ' updated_at=now() WHERE id=%s;', id))
                .then(() => {
                    resolve('Successfully update movie')
                }).catch((error) => {
                    console.log(error)
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    softDeleteMovie: (id) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE public.movies SET deleted_at=now() WHERE id=$1;', [id])
                .then(() => {
                    resolve('Successfully delete movie')
                }).catch((error) => {
                    console.log(error)
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    deleteMovie: (id) => {
        return new Promise((resolve, reject) => {
            db.query(format('DELETE FROM public.movies WHERE id=%s;', id))
                .then(() => {
                    resolve('Successfully delete movie')
                }).catch((error) => {
                    console.log(error)
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    }
}
