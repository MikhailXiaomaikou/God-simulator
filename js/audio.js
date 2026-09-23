/* audio.js —— 占位（将由完整的程序化声音取代）：所有接口皆为空操作 */
(function (GS) {
  'use strict';
  const noop = () => {};
  GS.audio = { init: noop, setMuted: noop, visibility: noop, update: noop,
    chargeStart: noop, charge: noop, chargeEnd: noop, fulfill: noop, bell: noop, good: noop, nameChime: noop,
    daySeal: noop, dawn: noop, bless: noop, behold: noop, breath: noop, rest: noop, finale: noop };
})(window.GS);
