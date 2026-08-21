export const clickPosition = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener(
    'click',
    (e) => {
      
      if (e.clientX !== 0 || e.clientY !== 0) {
        clickPosition.x = e.clientX;
        clickPosition.y = e.clientY;
      }
    },
    true 
  );
}
