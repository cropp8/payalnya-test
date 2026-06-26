import { onBeforeUnmount, watch, type Ref } from 'vue';

export function useResizable(tableRef: Ref<HTMLTableElement | undefined>) {
  let activeCellIndex: number | null = null;
  let initialColumnWidths: number[] = [];
  let startX = 0;
  let absorbColumnIndex = 0;
  let headerCells: HTMLTableCellElement[] = [];

  const onResizerMouseDown = (e: MouseEvent, cellIndex: number) => {
    if (!tableRef.value?.rows[0]?.cells) return;

    startX = e.clientX;
    activeCellIndex = cellIndex;
    absorbColumnIndex = cellIndex + 1;
    headerCells = Array.from(tableRef.value.rows[0].cells);

    if (absorbColumnIndex >= headerCells.length) return;

    initialColumnWidths = headerCells.map((cell) => cell.offsetWidth);

    headerCells.forEach((cell, i) => {
      cell.style.width = `${initialColumnWidths[i]}px`;
    });

    document.body.style.userSelect = 'none';
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

    if (!cell1 || !cell2 || width1 === undefined || width2 === undefined) return;

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

  const attachResizers = (table: HTMLTableElement) => {
    const cells = Array.from(table.rows[0]?.cells ?? []);

    cells.forEach((cell, index) => {
      const resizer = cell.querySelector('.ptt-table__resizer');

      if (resizer) {
        resizer.addEventListener('mousedown', (e) =>
          onResizerMouseDown(e as MouseEvent, index),
        );
      }
    });
  };

  watch(
    tableRef,
    (newTable) => {
      if (newTable) {
        attachResizers(newTable);
      }
    },
    { immediate: true },
  );

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });
}
