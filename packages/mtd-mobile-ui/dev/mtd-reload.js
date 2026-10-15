// Reloads the page when `mothertongues dev` rebuilds the dictionary data.
// Only included by the `pydev-serve` build configuration, never in packaged builds.
// Kept in sync with RELOAD_SCRIPT in mothertongues/devserver.py.
(function () {
  var first = null;
  new EventSource('/__mtd_reload').onmessage = function (e) {
    if (first === null) first = e.data;
    else if (e.data !== first) location.reload();
  };
})();
