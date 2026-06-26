import { onBeforeUnmount, watch, type Ref } from 'vue';

export function useResizable(tableRef: Ref<HTMLTableElement | undefined>) {
  let activeCellIndex: number | null = null;
  let initialColumnWidths: number[] = [];
  let startX = 0;
  let absorbColumnIndex = 0;
  let headerCells: HTMLTableCellElement[] = [];

  const onMouseDown = (e: MouseEvent) => {
    if (!tableRef.value?.rows[0]?.cells) return;

    const targetTh = (e.target as HTMLElement).closest('th');

    if (!targetTh) {
      return;
    }

    if (e.offsetX > targetTh.offsetWidth - 8) {
      startX = e.clientX;
      activeCellIndex = targetTh.cellIndex;
      absorbColumnIndex = activeCellIndex + 1;
      headerCells = Array.from(tableRef.value.rows[0].cells);

      if (absorbColumnIndex >= headerCells.length) {
        activeCellIndex = null;

        return;
      }

      initialColumnWidths = headerCells.map((cell) => cell.offsetWidth);
      console.log(initialColumnWidths);

      headerCells.forEach((cell, i) => {
        cell.style.width = `${initialColumnWidths[i]}px`;
      });

      document.body.style.userSelect = 'none';
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (activeCellIndex === null) return;

    const currentX = e.clientX;
    const diffX = Math.abs(startX - currentX);
    const index1 = currentX < startX ? activeCellIndex : absorbColumnIndex;
    const index2 = currentX < startX ? absorbColumnIndex : activeCellIndex;
    const cell1 = headerCells[index1];
    const cell2 = headerCells[index2];
    const width1 = initialColumnWidths[index1];
    const width2 = initialColumnWidths[index2];

    if (!cell1 || !cell2 || width1 === undefined || width2 === undefined) {
      return;
    }

    const newWidth = Math.max(width1 - diffX, 40);

    cell1.style.width = `${newWidth}px`;
    cell2.style.width = `${width2 + (width1 - newWidth)}px`;
  };

  const onMouseUp = () => {
    if (activeCellIndex !== null) {
      activeCellIndex = null;
      document.body.style.userSelect = '';
    }
  };

  watch(
    tableRef,
    (newTable, oldTable) => {
      if (oldTable) {
        oldTable.removeEventListener('mousedown', onMouseDown);
      }

      if (newTable) {
        newTable.addEventListener('mousedown', onMouseDown);
      }
    },
    { immediate: true },
  );

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  onBeforeUnmount(() => {
    if (tableRef.value) {
      tableRef.value.removeEventListener('mousedown', onMouseDown);
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });
}
