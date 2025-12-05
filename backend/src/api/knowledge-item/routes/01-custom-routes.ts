export default {
    routes: [
      {
        method: 'PUT',
        path: '/knowledge-items/:documentId/increment-view', 
        handler: 'knowledge-item.incrementView',
      }
    ]
  }