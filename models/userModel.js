const db = require('../config/db');

class User{
    constructor(first_name,last_name,email,mobile,pic){
        this.first_name = first_name;
        this.last_name = last_name;
        this.mobile = mobile;
        this.pic = pic;
        this.email = email;
    }
    
    async save(){
        let sql = `insert into user(first_name,last_name,email,mobile,pic)
         values('${this.first_name}','${this.last_name}','${this.email}',${this.mobile},'${this.pic}')`;
         const [newUser, _] = await db.execute(sql);
        return newUser.insertId;
    }
}

module.exports = {User};