import { useCallback } from "react";

import { KeyboardShortcutKeys } from "settings";

import { ReactHook } from "types/utility";
import { GridPosition } from "types/grid";

import { useMousetrap } from "hooks/useMousetrap";
import { useUser } from "hooks/useUser";

export interface UseMapKeyboardControlsProps {
  venueId: string;
  totalRows: number;
  totalColumns: number;
  isSeatTaken: (gridPosition: GridPosition) => boolean;
  takeSeat: (gridPosition: GridPosition) => Promise<void> | undefined;
}

// TODO: use e.preventDefault() or return false or similar in the keyboard handlers (check mousetrap docs) so we don't scroll on arrow key presses
// TODO: we may also need some kind of 'centre me on the map' logic somewhere when we do this too? For large zoomed maps.
// TODO: implement bindRef using useRef() or similar (in Camp?) then remove all withGlobalBind (default is false)
export const useMapKeyboardControls: ReactHook<
  UseMapKeyboardControlsProps,
  void
> = ({ venueId, totalRows, totalColumns, isSeatTaken, takeSeat }) => {
  const { profile } = useUser();
  const { row, column } = profile?.data?.[venueId] ?? {};

  /**
   * moveUp
   */
  const moveUp = useCallback(() => {
    if (!row || !column) return;
    if (row - 1 < 1 || isSeatTaken({ row: row - 1, column })) return;

    takeSeat({ row: row - 1, column });
  }, [row, column, isSeatTaken, takeSeat]);

  useMousetrap({
    keys: KeyboardShortcutKeys.movement.up,
    callback: moveUp,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveDown
   */
  const moveDown = useCallback(() => {
    if (!row || !column) return;
    if (row + 1 > totalRows || isSeatTaken({ row: row + 1, column })) return;

    takeSeat({ row: row + 1, column });
  }, [row, column, totalRows, isSeatTaken, takeSeat]);

  useMousetrap({
    keys: KeyboardShortcutKeys.movement.down,
    callback: moveDown,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveLeft
   */
  const moveLeft = useCallback(() => {
    if (!row || !column) return;
    if (column - 1 < 1 || isSeatTaken({ row, column: column - 1 })) return;

    takeSeat({ row, column: column - 1 });
  }, [row, column, isSeatTaken, takeSeat]);

  useMousetrap({
    keys: KeyboardShortcutKeys.movement.left,
    callback: moveLeft,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveRight
   */
  const moveRight = useCallback(() => {
    if (!row || !column) return;
    if (column + 1 > totalColumns || isSeatTaken({ row, column: column + 1 }))
      return;

    takeSeat({ row, column: column + 1 });
  }, [row, column, totalColumns, isSeatTaken, takeSeat]);

  useMousetrap({
    keys: KeyboardShortcutKeys.movement.right,
    callback: moveRight,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });
};
