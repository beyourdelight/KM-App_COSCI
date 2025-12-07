/**
 * student-login controller
 */

import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_cosci_db'
};

function parseThaiName(fullName: string) {
  if (!fullName) return { firstName: '', lastName: '' };
  let cleanName = fullName.replace(/^(นาย|นางสาว|นาง|ดร\.|ผศ\.|รศ\.|อ\.|อาจารย์|mr\.|ms\.|miss)\s*/yi, '').trim();
  const parts = cleanName.split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}

export default {
  
  async register(ctx) {
    console.log('>>> V5 API HIT: Student Login Register');

    const { buasri_code, email, password } = ctx.request.body;

    if (!buasri_code || !email || !password) {
      return ctx.badRequest('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    let connection;

    try {
      // 1. เชื่อมต่อ MySQL
      connection = await mysql.createConnection(dbConfig);
      
      let roleName = '';
      let rawName = '';

      // 2. เช็คตาราง Student
      const [students]: any = await connection.execute('SELECT * FROM student WHERE stu_buasri = ?', [buasri_code]);
      
      if (students.length > 0) {
        roleName = 'Student';
        rawName = students[0].stu_name || students[0].stu_eng_name;
      } else {
        // 3. เช็คตาราง Staff
        const [staffs]: any = await connection.execute('SELECT * FROM staff WHERE staff_buasri = ?', [buasri_code]);
        if (staffs.length > 0) {
          roleName = 'Staff';
          rawName = staffs[0].staff_name;
        }
      }

      await connection.end();

      if (!roleName) return ctx.badRequest('ไม่พบรหัสบัวศรีในระบบ');

      // 4. เช็ค Email ซ้ำ
      const existingUser = await strapi.documents('plugin::users-permissions.user').findFirst({
        filters: { email: email }
      });

      if (existingUser) return ctx.badRequest('อีเมลนี้ถูกใช้งานแล้ว');

      // 5. หา Role ID
      const roles = await strapi.documents('plugin::users-permissions.role').findMany({
        filters: { name: roleName }
      });
      
      let roleID = 1; 
      if (roles.length > 0) roleID = (roles[0] as any).id;

      const { firstName, lastName } = parseThaiName(rawName);

      // 6. สร้าง User
      const newUser = await strapi.plugin('users-permissions').service('user').add({
        username: buasri_code,
        email,
        password,
        role: roleID,
        confirmed: true,
        buasri_id: buasri_code,
        first_name: firstName,
        last_name: lastName,
        position: roleName,
        provider: 'local'
      });

      // 7. สร้าง Token
      const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: newUser.id });

      return { jwt, user: newUser };

    } catch (err: any) {
      console.error(err);
      if (connection) {
        try { await connection.end(); } catch(e) {}
      }
      return ctx.internalServerError(err.message || 'Internal Server Error');
    }
  },
  async updateFavorites(ctx) {
    console.log('>>> API HIT: Update Favorites (Custom v5)');
    
    // รับค่า User Document ID และ List ของ Favorites (Document IDs)
    const { userDocId, favorites } = ctx.request.body;

    if (!userDocId || !Array.isArray(favorites)) {
      return ctx.badRequest('ข้อมูลไม่ถูกต้อง (User Document ID or Favorites list missing)');
    }

    try {
      // ใช้ Strapi Document Service (v5 Way) อัปเดตข้อมูลโดยตรง
      const updatedUser = await strapi.documents('plugin::users-permissions.user').update({
        documentId: userDocId, // ใช้ Document ID ระบุตัวตน
        data: {
          favorites: favorites // อัปเดต List ของ Document IDs
        },
        populate: ['favorites'] // ดึงข้อมูลล่าสุดกลับมาดู
      });

      return { 
        message: 'Saved successfully', 
        favorites: updatedUser.favorites 
      };

    } catch (err: any) {
      console.error('Update Fav Error:', err);
      return ctx.internalServerError(err.message);
    }
  },
  async getFavorites(ctx) {
    const { id } = ctx.params; // รับ User ID (ตัวเลข) จาก URL

    try {
      // ใช้ strapi.db.query เพื่อดึงข้อมูลผ่าน ID ตัวเลข (Integer)
      // และสั่ง populate ลึกๆ เพื่อเอารูปภาพและวิดีโอ
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: id },
        populate: {
          favorites: {
            populate: {
              coverImage: true, // เอารูปปก
              videoList: {      // เอาวิดีโอ (เพื่อเช็คว่าเป็น video หรือ topic)
                  populate: { directFile: true } 
              }
            }
          }
        }
      });

      if (!user) return ctx.notFound('User not found');

      return user.favorites || [];

    } catch (err: any) {
      console.error('Get Fav Error:', err);
      return ctx.internalServerError(err.message);
    }
  }
};