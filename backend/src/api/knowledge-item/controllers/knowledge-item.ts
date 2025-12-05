/**
 * knowledge-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::knowledge-item.knowledge-item', ({ strapi }) => ({
  async incrementView(ctx) {
    try {
      // 1. ดึง ID จาก URL (เช่น /knowledge-items/abcdef123/increment-view)
      const { documentId } = ctx.params;

      // 2. ค้นหาบทความนั้นในฐานข้อมูลเพื่อดูยอดวิวปัจจุบัน
      const entity = await strapi.documents('api::knowledge-item.knowledge-item').findOne({
        documentId: documentId,
      });

      if (!entity) {
        return ctx.notFound('Document not found');
      }

      // 3. บวกเลขเพิ่ม 1 (ถ้าของเดิมว่าง ให้เริ่มที่ 0)
      // @ts-ignore
      const currentViews = Number(entity.views) || 0;
      const newViewCount = currentViews + 1;

      // 4. บันทึกค่าใหม่ลงฐานข้อมูล (หัวใจสำคัญอยู่ตรงนี้!)
      const updatedEntity = await strapi.documents('api::knowledge-item.knowledge-item').update({
        documentId: documentId,
        data: {
          // @ts-ignore
          views: newViewCount,
        },
      });

      // 5. ส่งค่ากลับไปบอก Frontend ว่าอัปเดตแล้วนะ
      return updatedEntity;

    } catch (err) {
      ctx.body = err;
    }
  },
}));