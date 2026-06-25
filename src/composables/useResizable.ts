import { ref } from 'vue';

export function useResizable(initialWidth = 150) {
  const width = ref(initialWidth);
  const isResizing = ref(false);

  const startResizing = (event: MouseEvent) => {
    const startX = event.pageX;
    const startWidth = width.value;

    isResizing.value = true;
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.value) {
        return;
      }

      const delta = moveEvent.pageX - startX;

      width.value = Math.max(50, startWidth + delta);
    };

    const stopResizing = () => {
      isResizing.value = false;
      document.body.style.userSelect = '';

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  return {
    width,
    startResizing,
  };
}
