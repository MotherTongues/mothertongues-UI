// Used by `nx serve mtd-mobile-ui --configuration=pydev`, which `mothertongues dev` runs.
// Sends dictionary data and live-reload requests to the mothertongues Python data server.
// The `pydev-serve` build configuration leaves the sample dictionary_data.json out of the
// assets so that this proxy, rather than the dev server, answers requests for it.
const target = `http://localhost:${process.env.MTD_DATA_PORT || 3637}`;

module.exports = {
  '/assets/dictionary_data.json': { target, secure: false },
  '/__mtd_reload': { target, secure: false },
};
