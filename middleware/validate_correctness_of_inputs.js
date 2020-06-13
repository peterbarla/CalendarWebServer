function checkInp(x) {
  if (Number.isNaN(x)) {
    return false;
  }
  return true;
}

module.exports = (req, resp, next) => {
  const code = req.body.tantargykod,
    year = req.body.evfolyam,
    classes = req.body.kurzusok,
    seminar = req.body.szeminarok,
    lab = req.body.laborok;

  if (!checkInp(code) || !checkInp(year) || !checkInp(classes)
  || !checkInp(seminar) || !checkInp(lab)) {
    resp.status(500).render('error', { message: 'Invalid Inputs!' });
  } else {
    next();
  }
};
