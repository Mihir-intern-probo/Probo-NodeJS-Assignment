const pool = require('../config/db');

class User{
    
    async checkAlreadyCreated(email){
        let sql = `select * from user where email = '${email}'`;
        const [user, _] = await pool.execute(sql);
        return user;
    }
    
    async save(first_name,last_name,email,mobile,pic){
        let sql = `insert into user(first_name,last_name,email,mobile,pic)
         values('${first_name}','${last_name}','${email}',${mobile},'${pic}')`;
         const [newUser, _] = await pool.execute(sql);
        return newUser.insertId;
    }

    async getusers(val,offValue){
        let sql = `select * from user limit ${val} offset ${(offValue-1)*2}`;
        const [users, _] = await pool.execute(sql);
        console.log(users);
        return users;
    }

    async getParticularUser(id){
        let check = `select * from user where id = ${id}`;
        const [val,_] = await pool.execute(check);
        return val;
    }

    async updateUser(first_name,last_name,email,mobile,pic,id){
        let sql = `update user set first_name = '${first_name}',
                last_name = '${last_name}', 
                email = '${email}', mobile = ${mobile}, 
                pic = '${pic}' 
                where id = ${id}`;
        const [users, _] = await pool.execute(sql);
        return users;
    }

    async deleteUser(id){
        let sql = `delete from user where id = ${id}`;
        const [users, _] = await pool.execute(sql);
        return users
    }
}

module.exports = {User};