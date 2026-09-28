import { useState, useEffect, useRef, useCallback } from "react";
import { getSystem, setSystem, subscribe } from "./system";

const IDLE_TIMER = { phase: "idle", remaining: 0, total: 0, endsAt: null };
const publishTimer = (phase, remaining, total) =>
  setSystem({ timer: { phase, remaining, total, endsAt: phase === "running" ? Date.now() + remaining * 1000 : null } });

/* Resume a timer that is still counting in the Dynamic Island */
function restoreTimer() {
  const t = getSystem().timer;
  if (!t || t.phase === "idle") return null;
  if (t.phase === "running" && t.endsAt) {
    const rem = Math.max(0, Math.round((t.endsAt - Date.now()) / 1000));
    return rem > 0 ? { phase: "running", remaining: rem, total: t.total } : null;
  }
  if (t.phase === "paused") return { phase: "paused", remaining: t.remaining, total: t.total };
  return null;
}

const CLOCK_FONT = "'SF Pro Rounded', ui-rounded, 'SF Pro Display', -apple-system, system-ui, sans-serif";

const ICON_ON = "#FF9500";
const ICON_OFF = "rgba(255,255,255,0.40)";

function WorldClockIcon({ active }) {
  const c = active ? ICON_ON : ICON_OFF;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.25" stroke={c} strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8.25" stroke={c} strokeWidth="1.4" />
      <path d="M3.75 12h16.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.1 7.4h13.8M5.1 16.6h13.8" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AlarmIcon({ active }) {
  const c = active ? ICON_ON : ICON_OFF;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13.5" r="7" stroke={c} strokeWidth="1.7" />
      <path d="M12 10.5v3.2l2.2 1.6" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 7.3C3.5 4.9 5.2 3.2 7.2 3.2" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M20.5 7.3C20.5 4.9 18.8 3.2 16.8 3.2" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.4 19.3l-1.6 1.9M17.6 19.3l1.6 1.9" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function StopwatchIcon({ active }) {
  const c = active ? ICON_ON : ICON_OFF;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13.5" r="7.5" stroke={c} strokeWidth="1.7" />
      <path d="M12 13.5l3-3" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 6V3.5M10 2.5h4" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M18.5 5.6l1.3-1.3" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TimerIcon({ active }) {
  const c = active ? ICON_ON : ICON_OFF;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13.5" r="7.5" stroke={c} strokeWidth="1.7" />
      <path d="M12 13.5V6a7.5 7.5 0 0 1 6.5 3.75z" fill={c} />
      <path d="M9.5 2.5h5M12 2.8V5" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

function formatMs(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  return `${pad(min)}:${pad(sec)}.${pad(cs)}`;
}

function formatCountdown(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function StopwatchTab({ audioRef }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const lapStartRef = useRef(0);

  const tick = useCallback(() => {
    setElapsed(Date.now() - startTimeRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleStartStop = () => {
    if (running) {
      cancelAnimationFrame(rafRef.current);
      setRunning(false);
    } else {
      startTimeRef.current = Date.now() - elapsed;
      setRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const handleLapReset = () => {
    if (running) {
      const lapTime = elapsed - lapStartRef.current;
      setLaps((prev) => [
        { num: prev.length + 1, lap: lapTime, total: elapsed },
        ...prev,
      ]);
      lapStartRef.current = elapsed;
    } else {
      setElapsed(0);
      setLaps([]);
      lapStartRef.current = 0;
    }
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  /* Live activity → Dynamic Island (throttled to ~4/s) */
  const lastPubRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (running && now - lastPubRef.current < 250) return;
    lastPubRef.current = now;
    setSystem({ stopwatch: { running, elapsed } });
  }, [running, elapsed]);
  useEffect(() => () => setSystem({ stopwatch: { running: false, elapsed: 0 } }), []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none flex items-center justify-center pt-10 pb-6">
        <span
          style={{
            fontVariantNumeric: "tabular-nums",
            fontFeatureSettings: '"tnum" 1',
            fontSize: "clamp(58px, 18vw, 82px)",
            fontWeight: 200,
            color: "#fff",
            letterSpacing: "-1.5px",
            lineHeight: 1,
            fontFamily: CLOCK_FONT,
          }}
        >
          {formatMs(elapsed)}
        </span>
      </div>

      <div className="flex-none flex justify-around px-8 pb-6">
        <button
          onClick={handleLapReset}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#2C2C2E",
            color: "#fff",
            fontSize: 16,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          {running ? "Lap" : "Reset"}
        </button>
        <button
          onClick={handleStartStop}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: running ? "#3A1A1A" : "#1A3A1A",
            color: running ? "#FF3B30" : "#30D158",
            fontSize: 16,
            fontWeight: 500,
            border: `2px solid ${running ? "#FF3B30" : "#30D158"}`,
            cursor: "pointer",
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
      </div>

      <div style={{ height: 1, background: "#2C2C2E", flexShrink: 0 }} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {laps.map((l) => (
          <div
            key={l.num}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderBottom: "1px solid #1C1C1E",
            }}
          >
            <span style={{ color: "#8E8E93", fontSize: 16, fontFamily: CLOCK_FONT, fontWeight: 400 }}>Lap {l.num}</span>
            <span style={{ color: "#fff", fontVariantNumeric: "tabular-nums", fontSize: 16, fontFamily: CLOCK_FONT, fontWeight: 400 }}>
              {formatMs(l.lap)}
            </span>
            <span style={{ color: "#8E8E93", fontVariantNumeric: "tabular-nums", fontSize: 16, fontFamily: CLOCK_FONT, fontWeight: 400 }}>
              {formatMs(l.total)}
            </span>
          </div>
        ))}
        {laps.length === 0 && (
          <div style={{ textAlign: "center", color: "#3A3A3C", marginTop: 40, fontSize: 15 }}>
            No laps recorded
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressRing({ progress, size = 220, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2C2C2E" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#FF9500"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s linear" }}
      />
    </svg>
  );
}

function NumberPicker({ value, onChange, max, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <button
        onClick={() => onChange((value + 1) % (max + 1))}
        style={{ background: "none", border: "none", color: "#FF9500", fontSize: 22, cursor: "pointer", padding: "4px 12px" }}
      >
        ▲
      </button>
      <div
        style={{
          fontVariantNumeric: "tabular-nums",
          fontSize: 48,
          fontWeight: 300,
          color: "#fff",
          fontFamily: CLOCK_FONT,
          letterSpacing: "-1px",
          minWidth: 64,
          textAlign: "center",
        }}
      >
        {pad(value)}
      </div>
      <button
        onClick={() => onChange(value === 0 ? max : value - 1)}
        style={{ background: "none", border: "none", color: "#FF9500", fontSize: 22, cursor: "pointer", padding: "4px 12px" }}
      >
        ▼
      </button>
      <span style={{ color: "#8E8E93", fontSize: 12, marginTop: 2 }}>{label}</span>
    </div>
  );
}

function TimerTab({ audioRef }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const restoredRef = useRef(restoreTimer());
  const [phase, setPhase] = useState(restoredRef.current?.phase || "idle"); // idle | running | paused | done
  const [remaining, setRemaining] = useState(restoredRef.current?.remaining || 0);
  const [total, setTotal] = useState(restoredRef.current?.total || 0);
  const intervalRef = useRef(null);

  const totalSec = hours * 3600 + minutes * 60 + seconds;

  const clearTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleStart = () => {
    if (totalSec === 0) return;
    setTotal(totalSec);
    setRemaining(totalSec);
    setPhase("running");
  };

  const handlePause = () => {
    clearTimer();
    setPhase("paused");
  };

  const handleResume = () => {
    setPhase("running");
  };

  const handleCancel = () => {
    clearTimer();
    setPhase("idle");
    setRemaining(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPhase("idle");
    setRemaining(0);
  };

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setPhase("done");
            if (audioRef.current) audioRef.current.play().catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimer();
  }, [phase]);

  /* Live activity → Dynamic Island. A running timer keeps counting there via
     endsAt, so on unmount only clear the store when nothing is in flight. */
  useEffect(() => {
    if (phase === "idle") setSystem({ timer: IDLE_TIMER });
    else if (phase === "done") setSystem({ timer: { phase: "done", remaining: 0, total, endsAt: null } });
    else publishTimer(phase, remaining, total);
  }, [phase, remaining, total]);
  useEffect(() => () => {
    const t = getSystem().timer;
    if (t.phase !== "running" && t.phase !== "paused") setSystem({ timer: IDLE_TIMER });
  }, []);
  /* Cancelled from the Dynamic Island → drop back to idle here too */
  useEffect(() => subscribe((st) => {
    if (st.timer.phase === "idle") {
      setPhase((p) => (p === "running" || p === "paused" ? "idle" : p));
    }
  }), []);

  const progress = total > 0 ? (total - remaining) / total : 0;

  if (phase === "idle") {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6 gap-8">
        <div style={{ fontSize: 22, color: "#8E8E93", fontWeight: 500 }}>Set Timer</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NumberPicker value={hours} onChange={setHours} max={23} label="hours" />
          <span style={{ color: "#fff", fontSize: 40, fontWeight: 200, marginBottom: 28 }}>:</span>
          <NumberPicker value={minutes} onChange={setMinutes} max={59} label="min" />
          <span style={{ color: "#fff", fontSize: 40, fontWeight: 200, marginBottom: 28 }}>:</span>
          <NumberPicker value={seconds} onChange={setSeconds} max={59} label="sec" />
        </div>
        <button
          onClick={handleStart}
          disabled={totalSec === 0}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: totalSec === 0 ? "#1C1C1E" : "#1A3A1A",
            color: totalSec === 0 ? "#3A3A3C" : "#30D158",
            fontSize: 16,
            fontWeight: 500,
            border: `2px solid ${totalSec === 0 ? "#3A3A3C" : "#30D158"}`,
            cursor: totalSec === 0 ? "default" : "pointer",
          }}
        >
          Start
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#0C0C0E",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 300, color: "#fff", fontFamily: CLOCK_FONT, letterSpacing: "-0.5px" }}>Time's Up!</div>
        <div style={{ fontSize: 16, color: "#8E8E93" }}>Timer finished</div>
        <button
          onClick={handleStopAlarm}
          style={{
            padding: "14px 40px",
            borderRadius: 30,
            background: "#FF3B30",
            color: "#fff",
            fontSize: 17,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Stop
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ProgressRing progress={progress} size={220} stroke={8} />
        <span
          style={{
            position: "absolute",
            fontVariantNumeric: "tabular-nums",
            fontSize: 56,
            fontWeight: 200,
            color: "#fff",
            letterSpacing: "-1px",
            fontFamily: CLOCK_FONT,
          }}
        >
          {formatCountdown(remaining)}
        </span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <button
          onClick={handleCancel}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#2C2C2E",
            color: "#fff",
            fontSize: 16,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={phase === "running" ? handlePause : handleResume}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: phase === "running" ? "#3A1A1A" : "#1A3A1A",
            color: phase === "running" ? "#FF3B30" : "#30D158",
            fontSize: 16,
            fontWeight: 500,
            border: `2px solid ${phase === "running" ? "#FF3B30" : "#30D158"}`,
            cursor: "pointer",
          }}
        >
          {phase === "running" ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 51,
        height: 31,
        borderRadius: 16,
        background: value ? "#30D158" : "#3A3A3C",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: value ? 22 : 2,
          width: 27,
          height: 27,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function AlarmTab({ audioRef }) {
  const [alarms, setAlarms] = useState([
    { id: 1, time: "07:00", label: "Wake Up", enabled: true },
    { id: 2, time: "08:30", label: "Morning Stand-up", enabled: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTime, setNewTime] = useState("09:00");
  const [newLabel, setNewLabel] = useState("");
  const [swipedId, setSwipedId] = useState(null);
  const [firingAlarm, setFiringAlarm] = useState(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const ss = now.getSeconds();
      if (ss !== 0) return;
      const currentTime = `${hh}:${mm}`;
      alarms.forEach((a) => {
        if (a.enabled && a.time === currentTime && !firingAlarm) {
          setFiringAlarm(a);
          if (audioRef.current) audioRef.current.play().catch(() => {});
        }
      });
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [alarms, firingAlarm]);

  const dismissAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setFiringAlarm(null);
  };

  const addAlarm = () => {
    if (!newTime) return;
    setAlarms((prev) => [
      ...prev,
      { id: Date.now(), time: newTime, label: newLabel || "Alarm", enabled: true },
    ]);
    setNewTime("09:00");
    setNewLabel("");
    setShowAdd(false);
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  };

  const deleteAlarm = (id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
    setSwipedId(null);
  };

  const fmt12 = (t) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return { time: `${h12}:${pad(m)}`, ampm };
  };

  const onTouchStart = (e, id) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e, id) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) setSwipedId(id);
    else if (dx > 30) setSwipedId(null);
    touchStartX.current = null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 8px" }}>
        <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Alarm</span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{ background: "none", border: "none", color: "#FF9500", fontSize: 16, cursor: "pointer", fontWeight: 500 }}
        >
          {showAdd ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#1C1C1E", margin: "0 16px 12px", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              style={{
                flex: 1,
                background: "#2C2C2E",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "8px 12px",
                fontSize: 16,
                colorScheme: "dark",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              style={{
                flex: 1,
                background: "#2C2C2E",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                padding: "8px 12px",
                fontSize: 16,
              }}
            />
            <button
              onClick={addAlarm}
              style={{
                background: "#FF9500",
                border: "none",
                borderRadius: 8,
                color: "#000",
                padding: "8px 18px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {alarms.map((alarm) => {
          const { time, ampm } = fmt12(alarm.time);
          const isSwiped = swipedId === alarm.id;
          return (
            <div
              key={alarm.id}
              style={{ position: "relative", overflow: "hidden" }}
              onTouchStart={(e) => onTouchStart(e, alarm.id)}
              onTouchEnd={(e) => onTouchEnd(e, alarm.id)}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 80,
                  background: "#FF3B30",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                onClick={() => deleteAlarm(alarm.id)}
              >
                <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Delete</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 20px",
                  borderBottom: "1px solid #1C1C1E",
                  background: "#0C0C0E",
                  transform: isSwiped ? "translateX(-80px)" : "translateX(0)",
                  transition: "transform 0.25s ease",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 44,
                        fontWeight: 200,
                        color: alarm.enabled ? "#fff" : "#6E6E73",
                        fontFamily: CLOCK_FONT,
                        letterSpacing: "-1px",
                        lineHeight: 1,
                      }}
                    >
                      {time}
                    </span>
                    <span style={{ color: alarm.enabled ? "#fff" : "#6E6E73", fontSize: 20, fontWeight: 300, fontFamily: CLOCK_FONT }}>{ampm}</span>
                  </div>
                  <div style={{ color: "#8E8E93", fontSize: 13, marginTop: 2 }}>{alarm.label}</div>
                </div>
                <Toggle value={alarm.enabled} onChange={() => toggleAlarm(alarm.id)} />
              </div>
            </div>
          );
        })}
      </div>

      {firingAlarm && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            gap: 20,
          }}
        >
          <div style={{ fontSize: 18, color: "#8E8E93" }}>ALARM</div>
          <div style={{ fontSize: 32, color: "#fff", fontWeight: 600 }}>{firingAlarm.label}</div>
          <div style={{ fontSize: 58, color: "#fff", fontWeight: 200, fontFamily: CLOCK_FONT, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
            {fmt12(firingAlarm.time).time} {fmt12(firingAlarm.time).ampm}
          </div>
          <button
            onClick={dismissAlarm}
            style={{
              marginTop: 20,
              padding: "14px 50px",
              borderRadius: 30,
              background: "#FF9500",
              color: "#000",
              fontSize: 17,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

const CITIES = [
  { city: "New York", country: "United States", tz: "America/New_York" },
  { city: "London", country: "United Kingdom", tz: "Europe/London" },
  { city: "Dubai", country: "UAE", tz: "Asia/Dubai" },
  { city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
  { city: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
  { city: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
  { city: "Sydney", country: "Australia", tz: "Australia/Sydney" },
  { city: "Los Angeles", country: "United States", tz: "America/Los_Angeles" },
];

function getUtcOffset(tz) {
  try {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const localStr = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZoneName: "short",
    }).format(now);
    const tzPart = localStr.match(/GMT[+-]\d+/)?.[0] || "";
    const offset = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value || tz;
    return offset;
  } catch {
    return tz;
  }
}

function WorldClockTab() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (tz) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now);
  };

  const dayLabel = (tz) => {
    const today = new Date().toLocaleDateString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, weekday: "short" });
    const there = new Date().toLocaleDateString("en-US", { timeZone: tz, weekday: "short" });
    if (today === there) return "Today";
    const todayNum = new Date().getDay();
    const thereDate = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const thereNum = thereDate.getDay();
    if (thereNum > todayNum || (todayNum === 6 && thereNum === 0)) return "Tomorrow";
    return "Yesterday";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px 8px" }}>
        <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>World Clock</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {CITIES.map(({ city, country, tz }) => {
          const timeStr = fmt(tz);
          const offset = getUtcOffset(tz);
          const dl = dayLabel(tz);
          return (
            <div
              key={tz}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: "1px solid #1C1C1E",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: "#8E8E93", fontSize: 12, marginBottom: 1 }}>{dl} · {offset}</div>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>{city}</div>
                <div style={{ color: "#8E8E93", fontSize: 13 }}>{country}</div>
              </div>
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 38,
                  fontWeight: 200,
                  color: "#fff",
                  fontFamily: CLOCK_FONT,
                  letterSpacing: "-0.5px",
                }}
              >
                {timeStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TimerApp() {
  const [activeTab, setActiveTab] = useState("stopwatch");
  const audioRef = useRef(null);

  const tabs = [
    { id: "worldclock", label: "World Clock", Icon: WorldClockIcon },
    { id: "alarm", label: "Alarms", Icon: AlarmIcon },
    { id: "stopwatch", label: "Stopwatch", Icon: StopwatchIcon },
    { id: "timer", label: "Timers", Icon: TimerIcon },
  ];

  return (
    <div
      className="h-full"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#0C0C0E",
        color: "#fff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <audio ref={audioRef} src="/audio/alarm.mp3" loop />

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {activeTab === "stopwatch" && <StopwatchTab audioRef={audioRef} />}
        {activeTab === "timer" && <TimerTab audioRef={audioRef} />}
        {activeTab === "alarm" && <AlarmTab audioRef={audioRef} />}
        {activeTab === "worldclock" && <WorldClockTab />}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: "0.5px solid rgba(255,255,255,0.10)",
          background: "rgba(12,12,14,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          paddingTop: 8,
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          flexShrink: 0,
        }}
      >
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 2px",
                background: "none",
                border: "none",
                cursor: "pointer",
                gap: 4,
              }}
            >
              <Icon active={isActive} />
              <span
                style={{
                  fontSize: 10,
                  lineHeight: 1,
                  color: isActive ? "#FF9500" : "rgba(255,255,255,0.40)",
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: 0.1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
