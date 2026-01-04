import { useEffect, useRef } from "react";

export const useVisible = (imagesRef) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("entries: " + entries[0]);
        entries.forEach((entry) => {
          console.log("entry: " + entry);
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observerRef.current.unobserve(img);
          }
        });
      },
      {
        rootMargin: "200px", // 🔥 начинает грузить заранее
      }
    );

    imagesRef.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, []);
};
