(function () {
  const state = {
    devices: [],
    selected: new Set(),
    fps: 30,
    speed: 1,
    audio: "on",
    retention: 7,
    activeStream: null,
    activeDeviceId: null,
  };

  const $ = (sel) => document.querySelector(sel);
  const detectBtn = $("#detectBtn");
  const overlay = $("#testerOverlay");
  const video = $("#previewVideo");
  const previewLabel = $("#previewLabel");
  const previewFps = $("#previewFps");
  const cameraList = $("#cameraList");
  const fpsRange = $("#fpsRange");
  const fpsValue = $("#fpsValue");
  const speedRange = $("#speedRange");
  const speedValue = $("#speedValue");
  const demoVideo = $("#demoVideo");
  const demoSpeedLabel = $("#demoSpeedLabel");
  const saveBtn = $("#saveSettingsBtn");
  const saveHint = $("#saveHint");

  function loadSaved() {
    try {
      const raw = localStorage.getItem("sentrySettings");
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.fps) { state.fps = s.fps; fpsRange.value = s.fps; fpsValue.textContent = s.fps + " fps"; }
      if (s.speed) { state.speed = s.speed; speedRange.value = s.speed; speedValue.textContent = s.speed + "×"; }
      if (s.audio) { state.audio = s.audio; setToggle("[data-audio]", "audio", s.audio); }
      if (s.retention !== undefined) { state.retention = s.retention; setToggle("[data-retention]", "retention", String(s.retention)); }
    } catch (_) {}
  }

  function setToggle(selector, attr, val) {
    document.querySelectorAll(selector).forEach((b) => {
      b.classList.toggle("active", b.dataset[attr] === val);
    });
  }

  function save() {
    const payload = {
      fps: state.fps,
      speed: state.speed,
      audio: state.audio,
      retention: state.retention,
      cameras: [...state.selected],
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("sentrySettings", JSON.stringify(payload));
    saveHint.textContent = "Saved. Your installer will use these settings.";
    saveHint.style.color = "var(--s-green, #39ff14)";
    setTimeout(() => { saveHint.textContent = ""; }, 3200);
  }

  async function detect() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      overlay.innerHTML = "<p>Your browser doesn't expose camera APIs. Try Chrome or Edge.</p>";
      return;
    }
    try {
      // prompt once so labels populate
      const probe = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      probe.getTracks().forEach((t) => t.stop());
    } catch (err) {
      overlay.innerHTML = "<p>Camera permission blocked. Enable it in your browser to test.</p>";
      return;
    }
    const all = await navigator.mediaDevices.enumerateDevices();
    state.devices = all.filter((d) => d.kind === "videoinput");
    renderCameras();
    if (state.devices.length > 0) {
      state.selected.add(state.devices[0].deviceId);
      activate(state.devices[0].deviceId);
      overlay.classList.add("hidden");
    } else {
      overlay.innerHTML = "<p>No cameras detected. Plug one in and try again.</p>";
    }
  }

  function renderCameras() {
    if (state.devices.length === 0) {
      cameraList.innerHTML = '<p class="muted small">No cameras detected.</p>';
      return;
    }
    cameraList.innerHTML = "";
    state.devices.forEach((d, i) => {
      const row = document.createElement("label");
      row.className = "camera-row" + (state.selected.has(d.deviceId) ? " active" : "");
      row.innerHTML = `
        <input type="checkbox" ${state.selected.has(d.deviceId) ? "checked" : ""} />
        <span class="name">${d.label || "Camera " + (i + 1)}</span>
        <span class="tag">CAM-${String(i + 1).padStart(2, "0")}</span>
      `;
      const cb = row.querySelector("input");
      cb.addEventListener("change", () => {
        if (cb.checked) {
          state.selected.add(d.deviceId);
          activate(d.deviceId);
        } else {
          state.selected.delete(d.deviceId);
        }
        renderCameras();
      });
      row.addEventListener("click", (e) => {
        if (e.target.tagName !== "INPUT") activate(d.deviceId);
      });
      cameraList.appendChild(row);
    });
  }

  async function activate(deviceId) {
    if (state.activeStream) {
      state.activeStream.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, frameRate: { ideal: state.fps } },
        audio: false,
      });
      state.activeStream = stream;
      state.activeDeviceId = deviceId;
      video.srcObject = stream;
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      const name = state.devices.find((x) => x.deviceId === deviceId)?.label || "Camera";
      previewLabel.textContent = name;
      previewFps.textContent = (settings.frameRate ? Math.round(settings.frameRate) : state.fps) + " fps";
      overlay.classList.add("hidden");
    } catch (err) {
      overlay.classList.remove("hidden");
      overlay.innerHTML = "<p>Couldn't open that camera. It might be in use by another app.</p>";
    }
  }

  async function applyFps() {
    if (!state.activeStream) return;
    const track = state.activeStream.getVideoTracks()[0];
    try {
      await track.applyConstraints({ frameRate: { ideal: state.fps } });
      previewFps.textContent = state.fps + " fps";
    } catch (_) { /* not all devices honor runtime fps changes */ }
  }

  // ---- events ----
  if (detectBtn) detectBtn.addEventListener("click", detect);

  fpsRange.addEventListener("input", () => {
    state.fps = parseInt(fpsRange.value, 10);
    fpsValue.textContent = state.fps + " fps";
    applyFps();
  });

  speedRange.addEventListener("input", () => {
    state.speed = parseFloat(speedRange.value);
    speedValue.textContent = state.speed + "×";
    demoSpeedLabel.textContent = state.speed + "×";
    if (demoVideo) demoVideo.playbackRate = state.speed;
    if (video) video.playbackRate = state.speed;
  });

  document.querySelectorAll("[data-audio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.audio = btn.dataset.audio;
      setToggle("[data-audio]", "audio", state.audio);
    });
  });

  document.querySelectorAll("[data-retention]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.retention = parseInt(btn.dataset.retention, 10);
      setToggle("[data-retention]", "retention", btn.dataset.retention);
    });
  });

  if (saveBtn) saveBtn.addEventListener("click", save);

  // demo playback: mirror the preview stream into the demo video for honesty
  const mirrorDemo = () => {
    if (!state.activeStream || !demoVideo) return;
    demoVideo.srcObject = state.activeStream;
    demoVideo.playbackRate = state.speed;
  };
  const observer = new MutationObserver(mirrorDemo);
  observer.observe(video, { attributes: true, attributeFilter: ["srcobject"] });
  video.addEventListener("loadedmetadata", mirrorDemo);

  loadSaved();
})();
