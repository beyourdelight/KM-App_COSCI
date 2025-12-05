// /**

/**
 * knowledge-item router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::knowledge-item.knowledge-item');

//  * knowledge-item controller
//  */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreController('api::knowledge-item.knowledge-item', ({ strapi }) => ({

//   // ฟังก์ชันสำหรับบวกยอดวิว
// async incrementView(ctx) {
//     try {
//       // ดึง documentId จาก URL
//     const { documentId } = ctx.params;

//       // 1. หาบทความนั้นก่อน
//     const entity = await strapi.documents('api::knowledge-item.knowledge-item').findOne({
//         documentId: documentId,
//     });

//     if (!entity) {
//         return ctx.notFound('Item not found');
//     }

//       // 2. คำนวณยอดวิวใหม่
//       // (ต้องแปลงเป็น number ก่อนบวก เพราะบางที database ส่งมาเป็น string)
//     // @ts-ignore  <-- ใส่บรรทัดนี้เพิ่มเข้าไปข้างบน
// const currentViews = Number(entity.views) || 0;
//     const newViewCount = currentViews + 1;

//       // 3. บันทึกกลับลง Database
//     await strapi.documents('api::knowledge-item.knowledge-item').update({
//         documentId: documentId,
//         data: {
//     // @ts-ignore  <-- ใส่บรรทัดนี้เพิ่มเข้าไปข้างบน
// views: newViewCount,
//         },
//     });

//       // ส่งค่าวิวใหม่กลับไปบอกหน้าเว็บ
//     return { views: newViewCount };

//     } catch (err) {
//       ctx.body = err;
//     }
//   }
// }));