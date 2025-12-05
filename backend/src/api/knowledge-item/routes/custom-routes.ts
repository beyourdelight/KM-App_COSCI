export default {
    routes: [
      {
        method: 'PUT',
        path: '/knowledge-items/:documentId/increment-view',
        handler: 'knowledge-item.incrementView',
        config: {
          auth: false, // false = ให้ใครก็ได้ยิงเข้ามา (Public)
        },
      },
    ],
  };