//components/Modal.jsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { overlayVariants, modalBoxVariants } from "../utils/motionVariants";

function Modal({ isOpen, onClose, title, children }) {
  // ── Close modal on Escape key press ─────────────────────────────────────
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Prevent body scroll when modal is open ──────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}             /* click outside → close */
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} /* prevent bubbling to overlay */
            variants={modalBoxVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">{title}</h2>
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
