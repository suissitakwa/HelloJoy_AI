import { useCallback, useEffect, useRef, useState } from "react";
import VoiceAssistant from "./demo/VoiceAssistant";
import { fetchDemoBusiness } from "./demo/api";
import { formatPhone, site } from "./config";

const OPEN_EVENT = "hellojoy:open-receptionist";
const BUBBLE_DELAY_MS = 5000;
const BUBBLE_VISIBLE_MS = 5000;

type MicState = "idle" | "checking" | "ready" | "not-found" | "denied" | "unsupported";

/** Opens the receptionist panel from any button on the page. */
export function openReceptionist() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function classifyMicError(error: unknown): MicState {
  const name = error instanceof DOMException || error instanceof Error ? error.name : "";
  return name === "NotAllowedError" || name === "SecurityError" ? "denied" : "not-found";
}

/** Where to send a visitor whose microphone can't be used: our line, the receptionist's line, or sign-up. */
function useFallback() {
  const [assistantPhone, setAssistantPhone] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetchDemoBusiness(controller.signal)
      .then((business) => setAssistantPhone(business.assistant_phone ?? ""))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  if (site.phone) {
    return { text: `call us at ${formatPhone(site.phone)}`, href: `tel:${site.phone}`, lead: "or call us at", label: formatPhone(site.phone) };
  }
  if (assistantPhone) {
    return {
      text: `call the receptionist at ${formatPhone(assistantPhone)}`,
      href: `tel:${assistantPhone}`,
      lead: "or call the receptionist itself at",
      label: formatPhone(assistantPhone),
    };
  }
  const cta = site.primaryCta;
  if (cta.kind === "link") {
    const label = cta.short === "Book a meeting" ? "book a meeting with us" : "get set up without the demo";
    return { text: label, href: cta.href, lead: "or", label };
  }
  return { text: "try again from a device with a microphone", href: "", lead: "or try from a device with a microphone", label: "" };
}

export default function ReceptionistWidget() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [mic, setMic] = useState<MicState>("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const fallback = useFallback();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // 5 s after landing, the bubble shows for 5 s, hides for 5 s, and repeats.
  // It rests while the panel is open and stops once the visitor dismisses it.
  useEffect(() => {
    if (open || bubbleDismissed) {
      setBubble(false);
      return;
    }
    let timer: number;
    const show = () => {
      setBubble(true);
      timer = window.setTimeout(hide, BUBBLE_VISIBLE_MS);
    };
    const hide = () => {
      setBubble(false);
      timer = window.setTimeout(show, BUBBLE_DELAY_MS);
    };
    timer = window.setTimeout(show, BUBBLE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [open, bubbleDismissed]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Ask for the microphone before any call starts, so a missing or blocked mic
  // becomes a friendly message instead of a failed call.
  const checkMic = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMic("unsupported");
      return;
    }
    setMic("checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMic("ready");
    } catch (error) {
      setMic(classifyMicError(error));
    }
  }, []);

  const micProblem = mic === "not-found" || mic === "denied" || mic === "unsupported";
  const fallbackLink = fallback.href ? (
    <>
      {fallback.lead}{" "}
      <a href={fallback.href} {...(fallback.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {fallback.label}
      </a>
      .
    </>
  ) : (
    <>{fallback.lead}.</>
  );

  return (
    <div className="rw">
      <div
        ref={panelRef}
        className={`rw-panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-labelledby="rw-title"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
      >
        <div className="rw-head">
          <span className="rw-dot" aria-hidden="true" />
          <h2 id="rw-title" className="rw-title">
            Demo receptionist
          </h2>
          <button type="button" className="rw-close" onClick={close} aria-label="Close receptionist">
            ×
          </button>
        </div>

        <div className="rw-body">
          {micProblem ? (
            <div className="rw-note" role="alert">
              <p className="rw-lead">{mic === "denied" ? "Microphone blocked" : "Mic not found"}</p>
              <p>
                {mic === "denied"
                  ? "Allow microphone access in your browser and try again, "
                  : mic === "unsupported"
                    ? "This browser can't use a microphone here. Try Chrome or Safari, "
                    : "Check your microphone and try again, "}
                {fallbackLink}
              </p>
              <button type="button" className="btn btn-primary rw-start" onClick={checkMic}>
                Try again
              </button>
            </div>
          ) : mic === "ready" ? (
            <VoiceAssistant autoStart alternative={fallback.text} />
          ) : (
            <div className="rw-note">
              <p className="rw-lead">Call our sample business, a grooming salon.</p>
              <p>Ask about prices, check open times, or book an appointment. We'll ask to use your microphone first.</p>
              <button type="button" className="btn btn-primary rw-start" onClick={checkMic} disabled={mic === "checking"}>
                {mic === "checking" ? "Waiting for microphone…" : "Start talking"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rw-dock">
        <div className={`rw-bubble${bubble ? " is-visible" : ""}`} aria-hidden={!bubble} inert={!bubble}>
          <button type="button" className="rw-bubble-text" onClick={() => setOpen(true)}>
            Want to hear how we answer your calls? Talk to me.
          </button>
          <button type="button" className="rw-bubble-close" onClick={() => setBubbleDismissed(true)} aria-label="Dismiss message">
            ×
          </button>
        </div>
        <button
          ref={launcherRef}
          type="button"
          className="rw-launcher"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 1 0-7 0v6A3.5 3.5 0 0 0 12 15Zm6-3.5a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.91V20H8.5a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H13v-2.59A6 6 0 0 0 18 11.5Z"
            />
          </svg>
          <span>{open ? "Close" : "Talk to our receptionist"}</span>
        </button>
      </div>
    </div>
  );
}
