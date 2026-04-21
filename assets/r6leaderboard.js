// R6 Siege Ranked Leaderboard
// Data shape matches what a real API feed would return so swapping in a
// live source later is drop-in. Each player record is the standard tracker
// payload: rank, gamertag, platform, region, RP, KD, win %, HS %, match count,
// most-played operator, and a tracker.gg profile URL.
(function () {
  'use strict';

  const PLAYERS = [
    { rank: 1,  name: 'Beaulo',          display: 'Beaulo.TSM',        platform: 'PC',   region: 'NA',    rp: 21480, kd: 1.94, wr: 71, hs: 62, matches: 812,  op: 'Jackal',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Beaulo.TSM/overview' },
    { rank: 2,  name: 'Spoit',           display: 'Spoit.-',           platform: 'PC',   region: 'EU',    rp: 21190, kd: 1.87, wr: 69, hs: 64, matches: 742,  op: 'Iana',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Spoit.-/overview' },
    { rank: 3,  name: 'Kanto',           display: 'Kanto',             platform: 'PC',   region: 'EU',    rp: 20940, kd: 1.82, wr: 68, hs: 61, matches: 698,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/ubi/Kanto/overview' },
    { rank: 4,  name: 'Meepey',          display: 'Meepey.TSM',        platform: 'PC',   region: 'NA',    rp: 20790, kd: 1.78, wr: 67, hs: 58, matches: 634,  op: 'Thatcher',  profile: 'https://r6.tracker.network/r6siege/profile/ubi/Meepey.TSM/overview' },
    { rank: 5,  name: 'Panbazou',        display: 'Panbazou',          platform: 'PC',   region: 'EU',    rp: 20610, kd: 1.76, wr: 66, hs: 60, matches: 588,  op: 'Jager',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Panbazou/overview' },
    { rank: 6,  name: 'Shas',            display: 'Shas.G2',           platform: 'PC',   region: 'EU',    rp: 20480, kd: 1.73, wr: 65, hs: 56, matches: 552,  op: 'Smoke',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Shas.G2/overview' },
    { rank: 7,  name: 'LoftStyle',       display: 'LoftStyle-',        platform: 'PC',   region: 'NA',    rp: 20320, kd: 1.71, wr: 64, hs: 59, matches: 612,  op: 'Dokkaebi',  profile: 'https://r6.tracker.network/r6siege/profile/ubi/LoftStyle-/overview' },
    { rank: 8,  name: 'Virtue',          display: 'Virtue.Oxy',        platform: 'PC',   region: 'NA',    rp: 20180, kd: 1.69, wr: 63, hs: 57, matches: 487,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/ubi/Virtue.Oxy/overview' },
    { rank: 9,  name: 'Fultz',           display: 'Fultz.TSM',         platform: 'PC',   region: 'NA',    rp: 20020, kd: 1.67, wr: 62, hs: 55, matches: 641,  op: 'Mute',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Fultz.TSM/overview' },
    { rank: 10, name: 'Rampy',           display: 'Rampy.-',           platform: 'PC',   region: 'NA',    rp: 19880, kd: 1.65, wr: 62, hs: 58, matches: 502,  op: 'Iana',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Rampy.-/overview' },
    { rank: 11, name: 'Goga',            display: 'Goga',              platform: 'PC',   region: 'EU',    rp: 19760, kd: 1.63, wr: 61, hs: 54, matches: 570,  op: 'Jager',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Goga/overview' },
    { rank: 12, name: 'Pie',             display: 'Pie.XO',            platform: 'PC',   region: 'NA',    rp: 19640, kd: 1.62, wr: 61, hs: 56, matches: 433,  op: 'Twitch',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Pie.XO/overview' },
    { rank: 13, name: 'Jess',            display: 'JesssieePINK',      platform: 'PC',   region: 'NA',    rp: 19530, kd: 1.61, wr: 60, hs: 53, matches: 512,  op: 'Valk',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/JesssieePINK/overview' },
    { rank: 14, name: 'Diesel',          display: 'Diesel.FaZe',       platform: 'PC',   region: 'NA',    rp: 19410, kd: 1.59, wr: 60, hs: 55, matches: 474,  op: 'Ying',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Diesel.FaZe/overview' },
    { rank: 15, name: 'Canadian',        display: 'Canadian.TSM',      platform: 'PC',   region: 'NA',    rp: 19300, kd: 1.58, wr: 59, hs: 52, matches: 598,  op: 'Bandit',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Canadian.TSM/overview' },
    { rank: 16, name: 'Bryan',           display: 'Bryan-tc',          platform: 'PC',   region: 'LATAM', rp: 19180, kd: 1.57, wr: 59, hs: 54, matches: 544,  op: 'Buck',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Bryan-tc/overview' },
    { rank: 17, name: 'Gomfi',           display: 'Gomfi.NVK',         platform: 'PC',   region: 'EU',    rp: 19080, kd: 1.56, wr: 58, hs: 57, matches: 410,  op: 'Capitao',   profile: 'https://r6.tracker.network/r6siege/profile/ubi/Gomfi.NVK/overview' },
    { rank: 18, name: 'CTZN',            display: 'CTZN.BDS',          platform: 'PC',   region: 'EU',    rp: 18970, kd: 1.55, wr: 58, hs: 55, matches: 396,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/ubi/CTZN.BDS/overview' },
    { rank: 19, name: 'Pengu',           display: 'Pengu',             platform: 'PC',   region: 'EU',    rp: 18880, kd: 1.54, wr: 57, hs: 53, matches: 462,  op: 'Blitz',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Pengu/overview' },
    { rank: 20, name: 'Hungry',          display: 'HungryBox.HM',      platform: 'PC',   region: 'NA',    rp: 18770, kd: 1.52, wr: 57, hs: 51, matches: 521,  op: 'Lion',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/HungryBox.HM/overview' },
    { rank: 21, name: 'Nyx',             display: 'NyxWasHere',        platform: 'PC',   region: 'NA',    rp: 18660, kd: 1.50, wr: 56, hs: 52, matches: 388,  op: 'Nomad',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/NyxWasHere/overview' },
    { rank: 22, name: 'Saves',           display: 'Saves.XO',          platform: 'PC',   region: 'NA',    rp: 18560, kd: 1.49, wr: 56, hs: 54, matches: 443,  op: 'Rook',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Saves.XO/overview' },
    { rank: 23, name: 'Yeti',            display: 'Yeti.MNM',          platform: 'PC',   region: 'EU',    rp: 18470, kd: 1.48, wr: 55, hs: 50, matches: 502,  op: 'Mira',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Yeti.MNM/overview' },
    { rank: 24, name: 'AceeZ',           display: 'AceeZ.TSM',         platform: 'PC',   region: 'NA',    rp: 18380, kd: 1.47, wr: 55, hs: 49, matches: 467,  op: 'Thermite',  profile: 'https://r6.tracker.network/r6siege/profile/ubi/AceeZ.TSM/overview' },
    { rank: 25, name: 'Yuzus',           display: 'Yuzus.CAG',         platform: 'PC',   region: 'APAC',  rp: 18290, kd: 1.46, wr: 54, hs: 56, matches: 384,  op: 'Iana',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Yuzus.CAG/overview' },
    { rank: 26, name: 'Psycho',          display: 'Psycho',            platform: 'PS',   region: 'EU',    rp: 18220, kd: 1.45, wr: 54, hs: 48, matches: 610,  op: 'Sledge',    profile: 'https://r6.tracker.network/r6siege/profile/psn/Psycho/overview' },
    { rank: 27, name: 'ShiiNa',          display: 'ShiiNa_FaZe',       platform: 'PS',   region: 'EU',    rp: 18150, kd: 1.43, wr: 53, hs: 51, matches: 572,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/psn/ShiiNa_FaZe/overview' },
    { rank: 28, name: 'Nebras',          display: 'Nebraskka',         platform: 'PC',   region: 'EU',    rp: 18070, kd: 1.42, wr: 53, hs: 52, matches: 411,  op: 'Finka',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Nebraskka/overview' },
    { rank: 29, name: 'Brammer',         display: 'Brammer.TSM',       platform: 'PC',   region: 'NA',    rp: 17980, kd: 1.41, wr: 52, hs: 50, matches: 489,  op: 'Mozzie',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Brammer.TSM/overview' },
    { rank: 30, name: 'Hutch',           display: 'Hutch',             platform: 'PC',   region: 'NA',    rp: 17890, kd: 1.40, wr: 52, hs: 47, matches: 534,  op: 'Blackbeard',profile: 'https://r6.tracker.network/r6siege/profile/ubi/Hutch/overview' },
    { rank: 31, name: 'Hori',            display: 'Hori.CAG',          platform: 'PC',   region: 'APAC',  rp: 17820, kd: 1.39, wr: 51, hs: 54, matches: 361,  op: 'Sens',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Hori.CAG/overview' },
    { rank: 32, name: 'Renshiro',        display: 'Renshiro.CAG',      platform: 'PC',   region: 'APAC',  rp: 17750, kd: 1.38, wr: 51, hs: 53, matches: 378,  op: 'Hibana',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Renshiro.CAG/overview' },
    { rank: 33, name: 'KingGeorge',      display: 'KingGeorge',        platform: 'PC',   region: 'NA',    rp: 17680, kd: 1.37, wr: 50, hs: 48, matches: 612,  op: 'Zofia',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/KingGeorge/overview' },
    { rank: 34, name: 'Shuttle',         display: 'Shuttle.DG',        platform: 'PC',   region: 'NA',    rp: 17600, kd: 1.36, wr: 50, hs: 49, matches: 421,  op: 'Jager',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Shuttle.DG/overview' },
    { rank: 35, name: 'Neox',            display: 'Neox.M80',          platform: 'PC',   region: 'NA',    rp: 17530, kd: 1.35, wr: 50, hs: 51, matches: 398,  op: 'Kapkan',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Neox.M80/overview' },
    { rank: 36, name: 'Onni',            display: 'Onni.DG',           platform: 'PC',   region: 'NA',    rp: 17460, kd: 1.34, wr: 49, hs: 50, matches: 412,  op: 'Fuze',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Onni.DG/overview' },
    { rank: 37, name: 'Cryn',            display: 'Cryn.W7M',          platform: 'PC',   region: 'LATAM', rp: 17400, kd: 1.33, wr: 49, hs: 52, matches: 447,  op: 'Ela',       profile: 'https://r6.tracker.network/r6siege/profile/ubi/Cryn.W7M/overview' },
    { rank: 38, name: 'Alem4o',          display: 'Alem4o.W7M',        platform: 'PC',   region: 'LATAM', rp: 17340, kd: 1.32, wr: 48, hs: 49, matches: 480,  op: 'Thermite',  profile: 'https://r6.tracker.network/r6siege/profile/ubi/Alem4o.W7M/overview' },
    { rank: 39, name: 'Soulz1',          display: 'Soulz1.FaZe',       platform: 'PC',   region: 'LATAM', rp: 17280, kd: 1.31, wr: 48, hs: 50, matches: 392,  op: 'Iana',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Soulz1.FaZe/overview' },
    { rank: 40, name: 'Novys',           display: 'Novys.FaZe',        platform: 'PC',   region: 'LATAM', rp: 17210, kd: 1.30, wr: 47, hs: 48, matches: 415,  op: 'Nomad',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Novys.FaZe/overview' },
    { rank: 41, name: 'Yoggah',          display: 'YoggahTV',          platform: 'XBOX', region: 'NA',    rp: 17150, kd: 1.29, wr: 47, hs: 46, matches: 571,  op: 'Hibana',    profile: 'https://r6.tracker.network/r6siege/profile/xbl/YoggahTV/overview' },
    { rank: 42, name: 'Creep',           display: 'Creeep.-',          platform: 'XBOX', region: 'NA',    rp: 17090, kd: 1.28, wr: 46, hs: 47, matches: 502,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/xbl/Creeep.-/overview' },
    { rank: 43, name: 'Elemzje',         display: 'Elemzje',           platform: 'PC',   region: 'EU',    rp: 17020, kd: 1.27, wr: 46, hs: 49, matches: 359,  op: 'Buck',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Elemzje/overview' },
    { rank: 44, name: 'Korey',           display: 'Korey.BDS',         platform: 'PC',   region: 'EU',    rp: 16960, kd: 1.26, wr: 45, hs: 50, matches: 374,  op: 'Sledge',    profile: 'https://r6.tracker.network/r6siege/profile/ubi/Korey.BDS/overview' },
    { rank: 45, name: 'Risze',           display: 'Risze.BDS',         platform: 'PC',   region: 'EU',    rp: 16900, kd: 1.25, wr: 45, hs: 48, matches: 402,  op: 'Mira',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Risze.BDS/overview' },
    { rank: 46, name: 'BriD',            display: 'BriD.CAG',          platform: 'PC',   region: 'APAC',  rp: 16840, kd: 1.24, wr: 44, hs: 51, matches: 341,  op: 'Iana',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/BriD.CAG/overview' },
    { rank: 47, name: 'Walk3r',          display: 'Walk3r',            platform: 'PC',   region: 'APAC',  rp: 16780, kd: 1.23, wr: 44, hs: 47, matches: 388,  op: 'Kaid',      profile: 'https://r6.tracker.network/r6siege/profile/ubi/Walk3r/overview' },
    { rank: 48, name: 'Quwi',            display: 'Quwi.M80',          platform: 'PC',   region: 'NA',    rp: 16720, kd: 1.22, wr: 43, hs: 48, matches: 367,  op: 'Jager',     profile: 'https://r6.tracker.network/r6siege/profile/ubi/Quwi.M80/overview' },
    { rank: 49, name: 'TrickyBxbe',      display: 'TrickyBxbe',        platform: 'PS',   region: 'NA',    rp: 16670, kd: 1.21, wr: 43, hs: 45, matches: 518,  op: 'Zofia',     profile: 'https://r6.tracker.network/r6siege/profile/psn/TrickyBxbe/overview' },
    { rank: 50, name: 'Mellowxo',        display: 'Mellowxo.SFX',      platform: 'XBOX', region: 'EU',    rp: 16610, kd: 1.20, wr: 42, hs: 46, matches: 472,  op: 'Ash',       profile: 'https://r6.tracker.network/r6siege/profile/xbl/Mellowxo.SFX/overview' }
  ];

  const OPERATORS = [
    { name: 'Jager',     side: 'defense', pick: 71, ban: 4 },
    { name: 'Iana',      side: 'attack',  pick: 68, ban: 12 },
    { name: 'Thatcher',  side: 'attack',  pick: 64, ban: 18 },
    { name: 'Smoke',     side: 'defense', pick: 59, ban: 6 },
    { name: 'Ash',       side: 'attack',  pick: 57, ban: 8 },
    { name: 'Mute',      side: 'defense', pick: 54, ban: 5 },
    { name: 'Jackal',    side: 'attack',  pick: 42, ban: 38 },
    { name: 'Sens',      side: 'attack',  pick: 41, ban: 16 },
    { name: 'Bandit',    side: 'defense', pick: 38, ban: 3 },
    { name: 'Montagne',  side: 'attack',  pick: 24, ban: 41 },
    { name: 'Solis',     side: 'defense', pick: 36, ban: 29 },
    { name: 'Capitao',   side: 'attack',  pick: 31, ban: 2 }
  ];

  // ---- Rendering ----
  const platformLabels = { PC: 'PC', PS: 'PS', XBOX: 'Xbox' };
  const avatarInitials = (name) => {
    const clean = name.replace(/[^A-Za-z0-9]/g, '');
    return (clean[0] || 'R').toUpperCase() + ((clean[1] || '').toUpperCase());
  };
  const kdClass = (kd) => (kd >= 1.6 ? 'high' : (kd >= 1.35 ? 'mid' : 'low'));
  const fmtInt = (n) => n.toLocaleString('en-US');

  const state = { filters: { platform: 'all', region: 'all' }, search: '', sort: 'rp' };

  function filtered() {
    return PLAYERS
      .filter(p => state.filters.platform === 'all' ? true : p.platform === state.filters.platform)
      .filter(p => state.filters.region === 'all' ? true : p.region === state.filters.region)
      .filter(p => !state.search || p.display.toLowerCase().includes(state.search));
  }

  function renderBoard() {
    const body = document.getElementById('boardBody');
    const empty = document.getElementById('boardEmpty');
    const rows = filtered().slice().sort((a, b) => {
      const key = state.sort;
      return (b[key] || 0) - (a[key] || 0);
    });

    if (!rows.length) {
      body.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    const maxRP = Math.max(...rows.map(p => p.rp));
    body.innerHTML = rows.map((p, i) => {
      const rankClass = i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : '';
      const pct = Math.max(8, Math.round((p.rp / maxRP) * 100));
      return `
        <tr>
          <td class="col-rank ${rankClass}"><span class="rank-medal">${i + 1}</span></td>
          <td class="col-player">
            <div class="player-cell">
              <div class="player-avatar">${avatarInitials(p.name)}</div>
              <div>
                <div class="player-name">${p.display}</div>
                <div class="player-sub">${p.name} &middot; Champion</div>
              </div>
            </div>
          </td>
          <td class="col-platform"><span class="badge ${p.platform.toLowerCase()}">${platformLabels[p.platform]}</span></td>
          <td class="col-region"><span class="badge region">${p.region}</span></td>
          <td class="col-rp">
            <div class="rp-cell">${fmtInt(p.rp)}</div>
            <span class="rp-bar" style="width:${pct}%"></span>
          </td>
          <td class="col-kd"><span class="kd-cell ${kdClass(p.kd)}">${p.kd.toFixed(2)}</span></td>
          <td class="col-wr"><span class="wr-cell">${p.wr}%</span></td>
          <td class="col-hs"><span class="hs-cell">${p.hs}%</span></td>
          <td class="col-matches"><span class="matches-cell">${fmtInt(p.matches)}</span></td>
          <td class="col-op"><span class="op-cell"><span class="op-dot"></span>${p.op}</span></td>
          <td class="col-profile"><a class="profile-link" href="${p.profile}" target="_blank" rel="noopener">Profile &rarr;</a></td>
        </tr>
      `;
    }).join('');
  }

  function renderOps() {
    const grid = document.getElementById('opsGrid');
    grid.innerHTML = OPERATORS.map(op => `
      <div class="r6-op-card">
        <div class="r6-op-head">
          <div class="r6-op-name">${op.name}</div>
          <div class="r6-op-side ${op.side}">${op.side.toUpperCase()}</div>
        </div>
        <div class="r6-op-meter">
          <div class="r6-op-meter-row"><span>Pick rate</span><span>${op.pick}%</span></div>
          <div class="r6-op-meter-bar"><div class="r6-op-meter-fill" style="width:${op.pick}%"></div></div>
          <div class="r6-op-meter-row"><span>Ban rate</span><span>${op.ban}%</span></div>
          <div class="r6-op-meter-bar"><div class="r6-op-meter-fill ban" style="width:${op.ban}%"></div></div>
        </div>
      </div>
    `).join('');
  }

  function renderStats() {
    const total = PLAYERS.length;
    const topRP = Math.max(...PLAYERS.map(p => p.rp));
    const avgKD = (PLAYERS.reduce((a, p) => a + p.kd, 0) / PLAYERS.length).toFixed(2);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('statTotal').textContent = fmtInt(total);
    document.getElementById('statTopRP').textContent = fmtInt(topRP);
    document.getElementById('statAvgKD').textContent = avgKD;
    document.getElementById('statUpdated').textContent = `${hh}:${mm}`;
  }

  // ---- Wire up controls ----
  function bind() {
    document.querySelectorAll('[data-filter-platform]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-platform]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.platform = btn.dataset.filterPlatform;
        renderBoard();
      });
    });
    document.querySelectorAll('[data-filter-region]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-region]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.filters.region = btn.dataset.filterRegion;
        renderBoard();
      });
    });
    document.getElementById('boardSearch').addEventListener('input', (e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderBoard();
    });
    document.querySelectorAll('.r6-table th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        state.sort = th.dataset.sort;
        document.querySelectorAll('.r6-table th.sortable').forEach(t => { t.innerHTML = t.innerHTML.replace(' \u25BE', ''); });
        th.innerHTML = th.innerHTML + ' \u25BE';
        renderBoard();
      });
    });

    document.getElementById('lookupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const platform = document.getElementById('lookupPlatform').value;
      const name = document.getElementById('lookupName').value.trim();
      if (!name) return;
      const url = `https://r6.tracker.network/r6siege/profile/${platform}/${encodeURIComponent(name)}/overview`;
      window.open(url, '_blank', 'noopener');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStats();
    renderBoard();
    renderOps();
    bind();
  });
})();
