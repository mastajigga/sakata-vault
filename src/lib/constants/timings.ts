export const TIMINGS = {
  /** Minimum time the loading screen stays visible (ms) */
  LOADING_MIN_DISPLAY: 600,
  /** Hard upper limit — forces the loading screen off if it hangs (ms) */
  LOADING_SAFETY_TIMEOUT: 4000,
  /** Delay after user stops typing before emitting "stopped typing" event (ms) */
  TYPING_STOP_DELAY: 3000,
  /** Debounce between consecutive analytics track calls (ms) */
  ANALYTICS_DEBOUNCE: 1500,
  /** Window within which the same path is not re-tracked (ms) */
  ANALYTICS_DEDUP_WINDOW: 10_000,
  /** Duration the screen-capture alert overlay remains visible (ms) */
  CAPTURE_ALERT_DURATION: 2000,
  /** Countdown in seconds for view-once images */
  VIEW_ONCE_COUNTDOWN: 5,
  /** Countdown in seconds for view-twice images */
  VIEW_TWICE_COUNTDOWN: 10,
  /** CSS duration for video fade-in/fade-out transitions */
  VIDEO_FADE_DURATION: "0.8s",
  /** Default display duration for transient UI notifications (ms) */
  NOTIFICATION_DISPLAY: 3000,
} as const;
