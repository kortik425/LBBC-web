import { useEffect, useRef } from "react";

const SWIPE_SCROLL_THRESHOLD = 50; // px
const SWIPE_TIME_LIMIT = 50; // ms
const ANGLE_THRESHOLD = 30; // degrees

const useScrollAndSwipeDetection = (
  onScrollUp: () => void,
  onScrollDown: () => void,
) => {
  const lastScrollY = useRef(0);

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const gestureTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (gestureTriggered.current) return;
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;

      if (Math.abs(deltaY) < SWIPE_SCROLL_THRESHOLD) return;

      if (deltaY > 0) {
        onScrollUp();
      } else {
        onScrollDown();
      }

      lastScrollY.current = currentY;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX;
      startTime.current = Date.now();
      gestureTriggered.current = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]; // ← this is the lifted finger
      const touchEndY = touch.clientY;
      const touchEndX = touch.clientX;
      if (
        touchStartY.current === null ||
        touchStartX.current === null ||
        startTime.current === null
      )
        return;

      const deltaY = touchStartY.current - touchEndY;
      const timeElapsed = Date.now() - startTime.current;

      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(touchStartX.current - touchEndX);

      const angle = Math.atan2(absDeltaY, absDeltaX) * (180 / Math.PI);
      const isVertical = angle > ANGLE_THRESHOLD;
      const isFast = timeElapsed < SWIPE_TIME_LIMIT;
      const isLongEnough = absDeltaY > SWIPE_SCROLL_THRESHOLD;

      if (isVertical && isFast && isLongEnough) {
        console.log("entra");
        if (deltaY > 0) {
          onScrollUp();
        } else {
          onScrollDown();
        }
      }

      // Reset
      touchStartY.current = null;
      touchStartX.current = null;
      startTime.current = null;
      gestureTriggered.current = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onScrollUp, onScrollDown]);
};

export default useScrollAndSwipeDetection;
