import { useEffect, useMemo, useRef, useState } from "react";
import ArenaHud from "./components/ArenaHud";
import ArenaScene from "./components/ArenaScene";
import HomeScreen from "./components/HomeScreen";
import OnlineLobbyPage from "./components/OnlineLobbyPage";
import PracticePage from "./components/PracticePage";
import RulesPage from "./components/RulesPage";
import SiteNav from "./components/SiteNav";
import { playTapSound, syncAmbientAudio } from "./game/audio";
import { chooseAiMove } from "./game/ai";
import { HAND_SKINS } from "./game/skins";
import { usePathRouter } from "./hooks/usePathRouter";
import { usePersistentState } from "./hooks/usePersistentState";
import { useRoomClient } from "./hooks/useRoomClient";
import {
  applyMove,
  applyReaction,
  createInitialMatchState,
  getOpponentSeat,
  getValidSplitOptions
} from "./shared/rules";

const DEFAULT_PROFILE = {
  name: "Arena Pilot",
  skinId: "ember"
};

const CHOPSTICK_GAME_ID = "chopsticks-3d-arena";

const DEFAULT_SETTINGS = {
  sfx: true,
  ambient: false,
  reducedMotion: false,
  theme: "dark"
};

function normalizeRoomRoute(roomCode) {
  const normalizedCode = String(roomCode ?? "").replace(/\D/g, "").slice(0, 6);
  return normalizedCode ? `/online/${normalizedCode}` : "/online";
}

function buildRoomShareLink(roomCode) {
  const roomRoute = normalizeRoomRoute(roomCode);

  if (typeof window === "undefined") {
    return roomRoute;
  }

  try {
    const topLocation = window.top?.location;
    if (window.top && window.top !== window && topLocation?.origin === window.location.origin) {
      const gamehubUrl = new URL("/play", topLocation.origin);
      gamehubUrl.searchParams.set("id", CHOPSTICK_GAME_ID);
      gamehubUrl.searchParams.set("gameRoute", roomRoute);
      return gamehubUrl.toString();
    }
  } catch (_) {
    // Ignore cross-frame access issues and fall back to the standalone route.
  }

  const standaloneUrl = new URL(window.location.href);
  standaloneUrl.hash = `#${roomRoute}`;
  return standaloneUrl.toString();
}

async function copyTextToClipboard(value) {
  const text = String(value ?? "");
  if (!text) {
    return false;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "readonly");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function getAlternateSkin(currentSkinId) {
  const alternate = HAND_SKINS.find((skin) => skin.id !== currentSkinId);
  return alternate?.id ?? "tide";
}

function createPracticeSession(profile, mode) {
  return {
    type: "practice",
    practiceMode: mode,
    players: {
      A: {
        name: profile.name || "Arena Pilot",
        skinId: profile.skinId || "ember",
        connected: true
      },
      B: {
        name: mode === "ai" ? "Pulse AI" : "Second Seat",
        skinId: getAlternateSkin(profile.skinId),
        connected: true
      }
    },
    match: createInitialMatchState({
      status: "playing"
    })
  };
}

function withPlayerAccents(players) {
  if (!players) {
    return players;
  }

  return Object.fromEntries(
    Object.entries(players).map(([seat, player]) => {
      if (!player) {
        return [
          seat,
          {
            name: "Open Seat",
            skinId: "sand",
            accent: "#9fb7cf",
            connected: false
          }
        ];
      }

      const skin = HAND_SKINS.find((entry) => entry.id === player.skinId) ?? HAND_SKINS[0];
      return [
        seat,
        {
          ...player,
          accent: skin.glow
        }
      ];
    })
  );
}

function resolveRoute(path) {
  const trimmed = path !== "/" ? path.replace(/\/+$/, "") : path;
  const parts = trimmed.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { page: "home", path: "/" };
  }

  if (parts[0] === "rules") {
    return { page: "rules", path: "/rules" };
  }

  if (parts[0] === "practice") {
    if (parts[1] === "ai" || parts[1] === "self") {
      return {
        page: "practiceArena",
        path: `/practice/${parts[1]}`,
        practiceMode: parts[1]
      };
    }

    return { page: "practice", path: "/practice" };
  }

  if (parts[0] === "online") {
    if (/^\d{6}$/.test(parts[1] ?? "")) {
      return {
        page: "onlineRoom",
        path: `/online/${parts[1]}`,
        roomCode: parts[1]
      };
    }

    return { page: "online", path: "/online" };
  }

  return { page: "notFound", path: "/" };
}

function createInitialSession(route, profile) {
  if (route.page === "practiceArena") {
    return createPracticeSession(profile, route.practiceMode);
  }

  if (route.page === "onlineRoom") {
    return { type: "online" };
  }

  return { type: "idle" };
}

export default function App() {
  const [profile, setProfile] = usePersistentState("chopsticks-profile", DEFAULT_PROFILE);
  const [settings, setSettings] = usePersistentState("chopsticks-settings", DEFAULT_SETTINGS);
  const activeTheme = settings.theme === "light" ? "light" : "dark";
  const { path, navigate } = usePathRouter();
  const route = useMemo(() => resolveRoute(path), [path]);
  const {
    createRoom: createRoomRequest,
    error: roomError,
    joinRoom: joinRoomRequest,
    leaveRoom,
    requestRematch: requestRoomRematch,
    room,
    seat,
    sendMove,
    sendReaction,
    status: roomStatus
  } = useRoomClient();
  const [session, setSession] = useState(() => createInitialSession(route, profile));
  const [selectedHand, setSelectedHand] = useState(null);
  const [splitOpen, setSplitOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const attemptedRoomCodeRef = useRef("");
  const previousRouteRef = useRef(route);

  useEffect(() => {
    if (route.page === "notFound") {
      navigate("/", { replace: true });
    }
  }, [navigate, route.page]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    syncAmbientAudio(settings.ambient);
    return () => {
      syncAmbientAudio(false);
    };
  }, [settings.ambient]);

  useEffect(() => {
    if (!settings.theme) {
      setSettings((current) => ({
        ...DEFAULT_SETTINGS,
        ...current,
        theme: "dark"
      }));
    }
  }, [setSettings, settings.theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;
    document.documentElement.style.colorScheme = activeTheme;
  }, [activeTheme]);

  useEffect(() => {
    const previousRoute = previousRouteRef.current;

    if (previousRoute.page === "onlineRoom" && route.page !== "onlineRoom") {
      leaveRoom();
      attemptedRoomCodeRef.current = "";
      setSession({ type: "idle" });
    }

    if (previousRoute.page === "practiceArena" && route.page !== "practiceArena") {
      setSession((current) => (current.type === "practice" ? { type: "idle" } : current));
    }

    previousRouteRef.current = route;
  }, [leaveRoom, route]);

  useEffect(() => {
    if (route.page === "practiceArena") {
      setSession((current) => {
        if (current.type === "practice" && current.practiceMode === route.practiceMode) {
          return current;
        }

        return createPracticeSession(profile, route.practiceMode);
      });
    } else if (route.page === "onlineRoom") {
      setSession((current) => (current.type === "online" ? current : { type: "online" }));
    }
  }, [profile, route.page, route.practiceMode]);

  useEffect(() => {
    if (route.page !== "onlineRoom") {
      attemptedRoomCodeRef.current = "";
      return;
    }

    if (room?.code === route.roomCode) {
      attemptedRoomCodeRef.current = route.roomCode;
      return;
    }

    if (attemptedRoomCodeRef.current === route.roomCode) {
      return;
    }

    attemptedRoomCodeRef.current = route.roomCode;
    setBusy(true);

    joinRoomRequest(route.roomCode, profile)
      .then(() => {
        setSession({ type: "online" });
      })
      .catch((error) => {
        setToast(error.message);
        navigate("/online", { replace: true });
      })
      .finally(() => {
        setBusy(false);
      });
  }, [joinRoomRequest, navigate, profile, room?.code, route.page, route.roomCode]);

  const match =
    session.type === "practice"
      ? session.match
      : session.type === "online"
        ? room?.match ?? null
        : null;

  const rawPlayers =
    session.type === "practice"
      ? session.players
      : session.type === "online"
        ? room?.players ?? null
        : null;

  const players = useMemo(() => withPlayerAccents(rawPlayers), [rawPlayers]);
  const perspectiveSeat = session.type === "online" ? seat ?? "A" : "A";
  const controlledSeat =
    session.type === "practice"
      ? session.practiceMode === "self"
        ? match?.turn ?? "A"
        : "A"
      : session.type === "online"
        ? seat
        : null;

  const canAct = Boolean(
    match &&
      controlledSeat &&
      match.status === "playing" &&
      !match.winner &&
      match.turn === controlledSeat
  );

  const splitOptions = canAct && controlledSeat ? getValidSplitOptions(match.hands[controlledSeat]) : [];
  const modeLabel =
    session.type === "practice"
      ? session.practiceMode === "ai"
        ? "Practice vs AI"
        : "Self-Play Lab"
      : "Online Arena";
  const activeRoomCode = room?.code ?? route.roomCode ?? "";
  const roomShareLink = useMemo(() => buildRoomShareLink(activeRoomCode), [activeRoomCode]);

  const visibleReactions = useMemo(() => {
    if (!match?.reactions) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(match.reactions).filter(([, reaction]) => reaction && clock - reaction.at < 2600)
    );
  }, [clock, match?.reactions]);

  useEffect(() => {
    setSelectedHand(null);
    setSplitOpen(false);
  }, [controlledSeat, match?.sequence, route.path]);

  useEffect(() => {
    if (
      session.type !== "practice" ||
      session.practiceMode !== "ai" ||
      !match ||
      match.turn !== "B" ||
      match.winner ||
      match.status !== "playing"
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const move = chooseAiMove(match, "B");
      if (!move) {
        return;
      }

      const result = applyMove(match, "B", move);
      if (!result.ok) {
        return;
      }

      const nextMatch =
        result.match.winner === "B" || Math.random() < 0.22
          ? applyReaction(result.match, "B", result.match.winner === "B" ? "🔥" : "😈")
          : result.match;

      setSession((current) =>
        current.type === "practice"
          ? {
              ...current,
              match: nextMatch
            }
          : current
      );

      if (settings.sfx) {
        playTapSound();
      }
    }, settings.reducedMotion ? 260 : 680);

    return () => window.clearTimeout(timer);
  }, [match, session, settings.reducedMotion, settings.sfx]);

  const setMessage = (message) => {
    setToast(message);
  };

  const playTapIfEnabled = () => {
    if (settings.sfx) {
      playTapSound();
    }
  };

  const navigateTo = (nextPath, options) => {
    if (route.page === "onlineRoom" && nextPath !== route.path) {
      leaveRoom();
      attemptedRoomCodeRef.current = "";
      setSession({ type: "idle" });
    }

    if (route.page === "practiceArena" && nextPath !== route.path) {
      setSession((current) => (current.type === "practice" ? { type: "idle" } : current));
    }

    navigate(nextPath, options);
  };

  const launchPractice = (mode) => {
    navigateTo(`/practice/${mode}`);
    setToast("");
  };

  const createRoom = async () => {
    setBusy(true);
    try {
      const response = await createRoomRequest(profile);
      attemptedRoomCodeRef.current = response.room.code;
      setSession({ type: "online" });
      navigateTo(`/online/${response.room.code}`);
      try {
        await copyTextToClipboard(buildRoomShareLink(response.room.code));
        setMessage(`Room ${response.room.code} is live. Join link copied.`);
      } catch (_) {
        setMessage(`Room ${response.room.code} is live. Share the code or link with your opponent.`);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const joinRoom = async (roomCode) => {
    setBusy(true);
    try {
      const response = await joinRoomRequest(roomCode, profile);
      attemptedRoomCodeRef.current = response.room.code;
      setSession({ type: "online" });
      navigateTo(`/online/${response.room.code}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const exitArena = () => {
    if (session.type === "online") {
      leaveRoom();
      attemptedRoomCodeRef.current = "";
      navigateTo("/online");
      return;
    }

    navigateTo("/practice");
  };

  const replayPractice = () => {
    if (session.type !== "practice") {
      return;
    }

    setSession(createPracticeSession(profile, session.practiceMode));
  };

  const submitMove = async (move) => {
    if (!match || !controlledSeat) {
      return;
    }

    if (session.type === "practice") {
      const result = applyMove(match, controlledSeat, move);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      setSession((current) =>
        current.type === "practice"
          ? {
              ...current,
              match: result.match
            }
          : current
      );
      playTapIfEnabled();
      return;
    }

    try {
      await sendMove(move);
      playTapIfEnabled();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitReaction = async (emoji) => {
    if (!match || !controlledSeat) {
      return;
    }

    if (session.type === "practice") {
      setSession((current) =>
        current.type === "practice"
          ? {
              ...current,
              match: applyReaction(current.match, controlledSeat, emoji)
            }
          : current
      );
      return;
    }

    try {
      await sendReaction(emoji);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const requestRematch = async () => {
    if (session.type === "practice") {
      replayPractice();
      return;
    }

    try {
      await requestRoomRematch();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const copyRoomCode = async () => {
    if (!activeRoomCode) {
      setMessage("The room code will appear once the room finishes syncing.");
      return;
    }

    try {
      await copyTextToClipboard(activeRoomCode);
      setMessage(`Room code ${activeRoomCode} copied.`);
    } catch (_) {
      setMessage(`Room code ${activeRoomCode} is ready to share.`);
    }
  };

  const copyRoomLink = async () => {
    if (!activeRoomCode) {
      setMessage("The join link becomes available once the room is live.");
      return;
    }

    try {
      await copyTextToClipboard(roomShareLink);
      setMessage(`Join link for room ${activeRoomCode} copied.`);
    } catch (_) {
      setMessage("Copy was blocked in this browser. Share the room code instead.");
    }
  };

  const shareRoomLink = async () => {
    if (!activeRoomCode) {
      setMessage("The join link becomes available once the room is live.");
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Join my Chopsticks arena",
          text: `Join my Chopsticks arena room ${activeRoomCode}.`,
          url: roomShareLink
        });
        setMessage(`Join link for room ${activeRoomCode} shared.`);
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }

    await copyRoomLink();
  };

  const toggleSplit = () => {
    if (!canAct) {
      setMessage("Wait for your turn before splitting.");
      return;
    }

    if (splitOptions.length === 0) {
      setMessage("No legal split is available from this hand total.");
      return;
    }

    setSplitOpen((current) => !current);
  };

  const selectSplit = (hands) => {
    setSplitOpen(false);
    submitMove({
      type: "split",
      hands
    });
  };

  const handleHandClick = (seat, handIndex) => {
    if (!match || !controlledSeat) {
      return;
    }

    if (!canAct) {
      setMessage(
        session.type === "online"
          ? "Waiting for the live turn to come back to you."
          : session.practiceMode === "ai"
            ? "Pulse AI is moving."
            : "Follow the active turn indicator."
      );
      return;
    }

    if (seat === controlledSeat) {
      if (match.hands[seat][handIndex] === 0) {
        setMessage("That hand is dead.");
        return;
      }

      if (selectedHand === handIndex) {
        if (splitOptions.length > 0) {
          setSplitOpen((current) => !current);
        } else {
          setMessage("No legal split from this stance. Attack instead.");
        }
      } else {
        setSelectedHand(handIndex);
        setSplitOpen(false);
      }
      return;
    }

    if (seat === getOpponentSeat(controlledSeat)) {
      if (selectedHand === null) {
        setMessage("Select one of your live hands first.");
        return;
      }

      submitMove({
        type: "attack",
        from: selectedHand,
        to: handIndex
      });
    }
  };

  const toggleSetting = (key) => {
    setSettings((current) => ({
      ...DEFAULT_SETTINGS,
      ...current,
      [key]:
        key === "theme"
          ? (current?.theme === "light" ? "dark" : "light")
          : !current?.[key]
    }));
  };

  const contextMessage =
    toast ||
    (!match
      ? route.page === "onlineRoom"
        ? `Rejoining room ${route.roomCode}...`
        : "Pick a mode to enter the arena."
      : match.winner
        ? `${players?.[match.winner]?.name ?? "A player"} wins the round.`
        : session.type === "online" && match.status !== "playing"
          ? `Room ${activeRoomCode || "------"} is live. Copy the code or send the join link while you wait for the opponent.`
          : !canAct
            ? session.type === "online"
              ? `Waiting for ${players?.[match.turn]?.name ?? "the opponent"} to move.`
              : session.practiceMode === "ai"
                ? "Pulse AI is choosing its attack."
                : `Control ${players?.[match.turn]?.name ?? "the active seat"} this turn.`
            : splitOpen
              ? "Choose a valid split and keep your total finger count unchanged."
              : selectedHand === null
                ? "Select one of your hands, then tap an opponent hand."
                : "Attack a live enemy hand or press Split to rebalance.");

  const renderPageShell = (content) => (
    <div className="app-shell">
      <SiteNav
        currentPath={route.path}
        onNavigate={navigateTo}
        onToggleTheme={() => toggleSetting("theme")}
        theme={activeTheme}
      />
      {content}
    </div>
  );

  if (route.page === "home") {
    return renderPageShell(
      <HomeScreen
        onNavigate={navigateTo}
        onProfileChange={setProfile}
        onSettingsChange={setSettings}
        profile={profile}
        settings={settings}
      />
    );
  }

  if (route.page === "rules") {
    return renderPageShell(<RulesPage onNavigate={navigateTo} />);
  }

  if (route.page === "practice") {
    return renderPageShell(<PracticePage onLaunch={launchPractice} />);
  }

  if (route.page === "online" || (route.page === "onlineRoom" && !match)) {
    return renderPageShell(
      <OnlineLobbyPage
        busy={busy}
        error={toast || roomError}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        pendingRoomCode={route.page === "onlineRoom" ? route.roomCode : ""}
        profile={profile}
        roomStatus={roomStatus}
      />
    );
  }

  return (
    <div className="app-shell app-shell--arena">
      <ArenaScene
        controlledSeat={controlledSeat}
        match={match}
        onHandClick={handleHandClick}
        perspectiveSeat={perspectiveSeat}
        players={players}
        reducedMotion={settings.reducedMotion}
        selectedHand={selectedHand}
        theme={activeTheme}
      />

      <ArenaHud
        canAct={canAct}
        contextMessage={contextMessage}
        controlledSeat={controlledSeat}
        match={match}
        modeLabel={modeLabel}
        onCopyRoomCode={copyRoomCode}
        onCopyRoomLink={copyRoomLink}
        onExit={exitArena}
        onNavigateRules={() => navigateTo("/rules")}
        onReaction={submitReaction}
        onRematch={requestRematch}
        onReplay={replayPractice}
        onSelectSplit={selectSplit}
        onShareRoomLink={shareRoomLink}
        onToggleSetting={toggleSetting}
        onToggleSplit={toggleSplit}
        perspectiveSeat={perspectiveSeat}
        players={players}
        rematchVotes={room?.rematchVotes ?? []}
        roomCode={activeRoomCode}
        roomShareLink={roomShareLink}
        roomStatus={roomStatus}
        selectedHand={selectedHand}
        settings={settings}
        splitOpen={splitOpen}
        splitOptions={splitOptions}
        visibleReactions={visibleReactions}
        onToggleTheme={() => toggleSetting("theme")}
      />
    </div>
  );
}
