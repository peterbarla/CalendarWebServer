module.exports = (req, resp) => {
  console.log(req.query.kod);
  resp.redirect(`materials/details?kod=${req.query.kod}`);
};
