if (typeof HTMLElement.prototype.showPopover === "function") {
  const overlay = document.createElement("div");
  overlay.className = "source-overlay";
  overlay.id = "source-overlay";
  overlay.popover = "manual";
  document.body.append(overlay);

  let active;
  let pinned = false;
  let closeTimer;

  function stopClosing() {
    clearTimeout(closeTimer);
  }

  function closeSource() {
    stopClosing();
    if (!active) return;
    active.removeAttribute("aria-expanded");
    active.removeAttribute("aria-controls");
    overlay.hidePopover();
    active = null;
    pinned = false;
  }

  function queueClose() {
    stopClosing();
    if (!pinned) closeTimer = setTimeout(closeSource, 180);
  }

  function placeOverlay() {
    const anchor = active.getBoundingClientRect();
    const below = innerHeight - anchor.bottom - 8;
    const above = anchor.top - 8;
    overlay.style.maxHeight = `${Math.max(80, Math.max(above, below))}px`;
    const {width, height} = overlay.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.right - width + 10, innerWidth - width - 8));
    const top = height > below && above > below
      ? anchor.top - height + 1
      : Math.max(8, Math.min(anchor.bottom - 1, innerHeight - height - 8));
    overlay.style.left = `${left}px`;
    overlay.style.top = `${top}px`;
  }

  function openSource(trigger, keepOpen = false) {
    stopClosing();
    if (active !== trigger) {
      closeSource();
      active = trigger;
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("aria-controls", overlay.id);
      document.body.append(overlay);
      overlay.replaceChildren(...[...trigger.nextElementSibling.childNodes].map(node => node.cloneNode(true)));
      overlay.showPopover();
      placeOverlay();
    }
    pinned = keepOpen;
  }

  document.addEventListener("pointerover", event => {
    const trigger = event.target.closest(".citation summary");
    if (event.pointerType === "mouse" && trigger && !pinned) openSource(trigger);
  });
  document.addEventListener("pointerout", event => {
    if (active?.contains(event.target) && !active.contains(event.relatedTarget) && !overlay.contains(event.relatedTarget)) {
      queueClose();
    }
  });
  overlay.addEventListener("pointerenter", stopClosing);
  overlay.addEventListener("pointerleave", event => {
    if (!active?.contains(event.relatedTarget)) queueClose();
  });
  document.addEventListener("click", event => {
    const trigger = event.target.closest(".citation summary");
    if (!trigger) {
      if (!overlay.contains(event.target)) closeSource();
      return;
    }
    event.preventDefault();
    if (active === trigger && pinned) closeSource();
    else {
      openSource(trigger, true);
      if (event.detail === 0) overlay.querySelector("a")?.focus();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !active) return;
    event.preventDefault();
    const trigger = active;
    closeSource();
    trigger.focus({preventScroll: true});
  });
  window.addEventListener("resize", closeSource);
  document.addEventListener("scroll", event => {
    if (event.target !== overlay) closeSource();
  }, {capture: true});
}
