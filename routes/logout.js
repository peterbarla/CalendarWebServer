module.exports = (req, resp) => {
  req.logout();
  req.session.destroy();
  resp.redirect('/login.html');
};
