export default {
  routes: [
    {
      method: 'POST',
      path: '/student-login/register',
      handler: 'api::student-login.student-login.register',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/student-login/favorites',
      handler: 'api::student-login.student-login.updateFavorites',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/student-login/favorites/:id', // :User ID 
      handler: 'api::student-login.student-login.getFavorites',
      config: { auth: false },
    },
  ],
};