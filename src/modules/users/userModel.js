const db = require('../../configs/db')
const format = require('pg-format')

module.exports = {
    getUsers: async ({ search, orderBy, order, page, limit }) => {
        try {
            let query = format('SELECT * FROM public.users')
            if (search) {
                query = format(query + ' WHERE email LIKE \'%%%s%%\' AND deleted_at ISNULL', search)
            }

            if (orderBy) {
                query = format(query + ' ORDER BY %s', orderBy)
            }

            if (order) {
                query = format(query + ' %s', order)
            }

            if (page && limit) {
                const offset = (page - 1) * limit
                query = format(query + ' LIMIT %s OFFSET %s', limit, offset)
            }

            const { rows } = await db.query('SELECT COUNT(id) as "count" FROM public.users')
            const counts = rows[0].count

            const meta = {
                next:
                    page == Math.ceil(counts / limit)
                        ? null
                        : `/api/v1/users?search=${search}&orderBy=${orderBy}&order=${order}&page=${Number(page) + 1}&limit=${limit}`,
                prev:
                    page == 1
                        ? null
                        : `/api/v1/users?all?search=${search}&orderBy=${orderBy}&order=${order}&page=${Number(page) - 1}&limit=${limit}`,
                counts
            }

            console.log(query)

            const prods = await db.query(query)
            return { data: prods.rows, meta }
        } catch (error) {
            new Error(`SQL : ${error.sqlMessage}`)
        }
    },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM public.users WHERE id=$1', [id])
                .then((data) => {
                    resolve(data.rows)
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    getUserByEmail: ({email}) => {
        return new Promise((resolve, reject) => {
            db.query(format('SELECT * FROM public.users WHERE email=\'%s\';', email))
                .then((data) => {
                    resolve(data.rows)
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    addUser: ({ role_id, firstName, lastName, phoneNumber, email, password, avatar, isRegister }) => {
        return new Promise((resolve, reject) => {
            if (isRegister) {
                db.query('INSERT INTO public.users (first_name, last_name, phone_number, email, "password", created_at, updated_at, deleted_at, avatar) VALUES($1, $2, $3, $4, $5, now(), null, null, $6);', [
                    role_id,
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password,
                    avatar
                ]).then(() => {
                    resolve('Register success')
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
            } else {
                db.query('INSERT INTO public.users (role_id, first_name, last_name, phone_number, email, "password", created_at, updated_at, deleted_at, avatar) VALUES($1, $2, $3, $4, $5, $6, now(), null, null, $7);', [
                    role_id,
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password,
                    avatar
                ]).then(() => {
                    resolve('Successfully add user')
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
            }
        })
    },
    updateUser: ({ id, role_id, first_name, last_name, phone_number, email, password, director, avatar }) => {
        return new Promise((resolve, reject) => {
            // let query = 'UPDATE public.users SET %s=\'%s\' WHERE %s=\'%s\';'
            let query = 'UPDATE public.users SET'

            if (role_id) {
                query = format(query + ' role_id=\'%s\',', role_id)
            }

            if (first_name) {
                query = format(query + ' first_name=\'%s\',', first_name)
            }

            if (last_name) {
                query = format(query + ' last_name=\'%s\',', last_name)
            }

            if (phone_number) {
                query = format(query + ' phone_number=\'%s\',', phone_number)
            }

            if (email) {
                query = format(query + ' email=\'%s\',', email)
            }

            if (password) {
                query = format(query + ' password=\'%s\',', password)
            }

            if (director) {
                query = format(query + ' director=\'%s\',', director)
            }

            if (avatar) {
                query = format(query + ' avatar=\'%s\',', avatar)
            }

            db.query(format(query + ' updated_at=now() WHERE id=%s;', id))
                .then(() => {
                    resolve('Successfully update user')
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    softDeleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE public.users SET deleted_at=now() WHERE id=$1;', [id])
                .then(() => {
                    resolve('Successfully delete movie')
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    },
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(format('DELETE FROM public.users WHERE id=%s;', id))
                .then(() => {
                    resolve('Successfully delete movie')
                }).catch((error) => {
                    reject(new Error(`SQL : ${error.sqlMessage}`))
                })
        })
    }
}
