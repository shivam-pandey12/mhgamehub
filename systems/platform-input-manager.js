(function attachPlatformInputManager() {
    "use strict";

    function isEditableTarget(target) {
        if (!(target instanceof Element)) {
            return false;
        }

        if (target.closest("input, textarea, select, [contenteditable='true']")) {
            return true;
        }

        const role = target.getAttribute("role");
        return role === "textbox" || role === "searchbox";
    }

    class PlatformInputManager {
        constructor(options = {}) {
            this.target = options.target || window;
            this.handlers = {};
            this.boundKeyDown = (event) => this.handleKeyDown(event);
            this.target.addEventListener("keydown", this.boundKeyDown, { passive: false });
        }

        setHandlers(handlers = {}) {
            this.handlers = { ...handlers };
        }

        handleKeyDown(event) {
            if (event.defaultPrevented || isEditableTarget(event.target)) {
                return;
            }

            if (event.key === "Escape") {
                if (typeof this.handlers.onEscape === "function") {
                    this.handlers.onEscape(event);
                }
                return;
            }

            if (!event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            switch (event.code) {
                case "Enter":
                    event.preventDefault();
                    this.handlers.onFullscreenToggle?.(event);
                    break;
                case "KeyP":
                    event.preventDefault();
                    this.handlers.onPauseToggle?.(event);
                    break;
                case "KeyR":
                    event.preventDefault();
                    this.handlers.onReload?.(event);
                    break;
                case "KeyM":
                    event.preventDefault();
                    this.handlers.onMuteToggle?.(event);
                    break;
                default:
                    break;
            }
        }

        destroy() {
            this.target.removeEventListener("keydown", this.boundKeyDown);
        }
    }

    const platform = window.GameHubPlatform || (window.GameHubPlatform = {});
    platform.PlatformInputManager = {
        PlatformInputManager,
        create(options) {
            return new PlatformInputManager(options);
        }
    };
})();
