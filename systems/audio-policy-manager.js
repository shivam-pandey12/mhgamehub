(function attachAudioPolicyManager() {
    "use strict";

    class AudioPolicyManager {
        constructor() {
            this.frame = null;
            this.muted = false;
        }

        setMuted(muted) {
            this.muted = Boolean(muted);
            if (!this.frame) {
                return;
            }

            if (this.muted) {
                this.pauseFrameAudio(this.frame);
            } else {
                this.resumeFrameAudio(this.frame);
            }
        }

        attachToFrame(frame, options = {}) {
            this.frame = frame;
            this.muted = Boolean(options.muted);

            try {
                const win = frame?.contentWindow;
                const doc = frame?.contentDocument;
                if (!win || !doc?.documentElement || !doc.body) {
                    return;
                }

                this.patchAudioContext(win, "AudioContext");
                this.patchAudioContext(win, "webkitAudioContext");
                this.patchAudioFactory(win);
                this.observeMedia(win, doc);

                if (this.muted) {
                    this.pauseFrameAudio(frame);
                } else {
                    this.resumeFrameAudio(frame);
                }
            } catch (error) {
                console.warn("Audio policy attach failed:", error);
            }
        }

        patchAudioFactory(win) {
            if (typeof win.Audio !== "function" || win.Audio.__gamehubWrappedAudio) {
                return;
            }

            const manager = this;
            const OriginalAudio = win.Audio;
            function WrappedAudio(...args) {
                const audio = new OriginalAudio(...args);
                if (manager.muted) {
                    manager.muteMediaElement(audio);
                }
                return audio;
            }

            Object.setPrototypeOf(WrappedAudio, OriginalAudio);
            WrappedAudio.prototype = OriginalAudio.prototype;
            WrappedAudio.__gamehubWrappedAudio = true;
            win.Audio = WrappedAudio;
        }

        patchAudioContext(win, ctorName) {
            const AudioCtor = win[ctorName];
            if (typeof AudioCtor !== "function" || AudioCtor.__gamehubWrappedContext) {
                return;
            }

            const manager = this;
            const trackedContexts = win.__gamehubAudioContexts || new Set();
            win.__gamehubAudioContexts = trackedContexts;

            function WrappedAudioContext(...args) {
                const context = new AudioCtor(...args);
                trackedContexts.add(context);

                if (manager.muted) {
                    Promise.resolve().then(() => context.suspend?.().catch(() => undefined));
                }

                return context;
            }

            Object.setPrototypeOf(WrappedAudioContext, AudioCtor);
            WrappedAudioContext.prototype = AudioCtor.prototype;
            WrappedAudioContext.__gamehubWrappedContext = true;
            win[ctorName] = WrappedAudioContext;
        }

        observeMedia(win, doc) {
            if (win.__gamehubAudioObserver) {
                win.__gamehubAudioObserver.disconnect();
            }

            const observer = new win.MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (!(node instanceof win.Element)) {
                            return;
                        }

                        if (node.matches?.("audio, video")) {
                            this.applyMediaPolicy(node);
                        }

                        node.querySelectorAll?.("audio, video").forEach((media) => this.applyMediaPolicy(media));
                    });
                });
            });

            observer.observe(doc.documentElement, { childList: true, subtree: true });
            win.__gamehubAudioObserver = observer;
        }

        collectMedia(frame) {
            const doc = frame?.contentDocument;
            if (!doc) {
                return [];
            }

            return [...doc.querySelectorAll("audio, video")];
        }

        applyMediaPolicy(media) {
            if (this.muted) {
                this.muteMediaElement(media);
                return;
            }

            try {
                media.muted = false;
                media.defaultMuted = false;
                if (Number.isFinite(media.volume) && media.volume === 0) {
                    media.volume = 1;
                }
            } catch (_) {
                // Ignore individual media failures.
            }
        }

        muteMediaElement(media) {
            if (!media) {
                return;
            }

            try {
                media.muted = true;
                media.defaultMuted = true;
                media.volume = 0;
                media.pause?.();
            } catch (_) {
                // Ignore individual media failures.
            }
        }

        suspendContexts(frame) {
            const contexts = frame?.contentWindow?.__gamehubAudioContexts;
            if (!(contexts instanceof Set)) {
                return;
            }

            contexts.forEach((context) => {
                try {
                    context.suspend?.().catch(() => undefined);
                } catch (_) {
                    // Ignore.
                }
            });
        }

        resumeContexts(frame) {
            const contexts = frame?.contentWindow?.__gamehubAudioContexts;
            if (!(contexts instanceof Set) || this.muted) {
                return;
            }

            contexts.forEach((context) => {
                try {
                    context.resume?.().catch(() => undefined);
                } catch (_) {
                    // Ignore.
                }
            });
        }

        pauseFrameAudio(frame = this.frame) {
            if (!frame) {
                return;
            }

            this.collectMedia(frame).forEach((media) => this.muteMediaElement(media));
            this.suspendContexts(frame);
        }

        resumeFrameAudio(frame = this.frame) {
            if (!frame) {
                return;
            }

            this.collectMedia(frame).forEach((media) => this.applyMediaPolicy(media));
            this.resumeContexts(frame);
        }

        disposeFrameAudio(frame = this.frame) {
            if (!frame) {
                return;
            }

            try {
                this.pauseFrameAudio(frame);
                frame.contentWindow?.__gamehubAudioObserver?.disconnect?.();
            } catch (_) {
                // Ignore cleanup failures.
            }

            if (frame === this.frame) {
                this.frame = null;
            }
        }
    }

    const platform = window.GameHubPlatform || (window.GameHubPlatform = {});
    platform.AudioPolicyManager = {
        AudioPolicyManager,
        create() {
            return new AudioPolicyManager();
        }
    };
})();
