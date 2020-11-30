import { useCallback } from "react";

import { ReactHook } from "types/utility";

import { useMousetrap } from "hooks/useMousetrap";
import { useUser } from "hooks/useUser";

export const MovementKeys = {
  up: ["up", "w"],
  down: ["down", "s"],
  left: ["left", "a"],
  right: ["right", "d"],
  enter: ["enter"],
};

// TODO: this doesnt seem to be used, can we remove it?
// export const MOVEMENT_INTERVAL = 350;

interface UseKeyboardControlsProps {
  venueId: string;
  totalRows: number;
  totalColumns: number;
  isSeatTaken: (row: number, column: number) => boolean;
  takeSeat: (row: number | null, column: number | null) => void;
  enterSelectedRoom: () => void;
  onMove?: () => void; // TODO: this doesnt seem to be needed anymore, can we remove it?
}

// TODO: use e.preventDefault() or return false or similar in the keyboard handlers (check mousetrap docs) so we don't scroll on arrow key presses
// TODO: we may also need some kind of 'centre me on the map' logic somewhere when we do this too? For large zoomed maps.
// TODO: implement bindRef using useRef() or similar (in Camp?) then remove all withGlobalBind (default is false)
export const useKeyboardControls: ReactHook<UseKeyboardControlsProps, void> = ({
  venueId,
  totalRows,
  totalColumns,
  isSeatTaken,
  takeSeat,
  enterSelectedRoom,
  onMove,
}) => {
  const { profile } = useUser();
  const { row, column } = profile?.data?.[venueId] ?? {};

  /**
   * enter
   */
  const enter = useCallback(() => {
    if (!row || !column) return;

    // TODO: implement: openRoomUrl(selectedRoom.url) ? can we do it in enterSelectedRoom?
    enterSelectedRoom();
  }, [row, column, enterSelectedRoom]);

  useMousetrap({
    keys: MovementKeys.enter,
    callback: enter,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveUp
   */
  const moveUp = useCallback(() => {
    if (!row || !column) return;
    if (row - 1 < 1 || isSeatTaken(row - 1, column)) return;

    takeSeat(row - 1, column);
    onMove && onMove(); // TODO: do we need this here anymore?
  }, [row, column, isSeatTaken, takeSeat, onMove]);

  useMousetrap({
    keys: MovementKeys.up,
    callback: moveUp,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveDown
   */
  const moveDown = useCallback(() => {
    if (!row || !column) return;
    if (row + 1 > totalRows || isSeatTaken(row + 1, column)) return;

    takeSeat(row + 1, column);
    onMove && onMove(); // TODO: do we need this here anymore?
  }, [row, column, totalRows, isSeatTaken, takeSeat, onMove]);

  useMousetrap({
    keys: MovementKeys.down,
    callback: moveDown,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveLeft
   */
  const moveLeft = useCallback(() => {
    if (!row || !column) return;
    if (column - 1 < 1 || isSeatTaken(row, column - 1)) return;

    takeSeat(row, column - 1);
    onMove && onMove(); // TODO: do we need this here anymore?
  }, [row, column, isSeatTaken, takeSeat, onMove]);

  useMousetrap({
    keys: MovementKeys.left,
    callback: moveLeft,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });

  /**
   * moveRight
   */
  const moveRight = useCallback(() => {
    if (!row || !column) return;
    if (column + 1 > totalColumns || isSeatTaken(row, column + 1)) return;

    takeSeat(row, column + 1);
    onMove && onMove(); // TODO: do we need this here anymore?
  }, [row, column, totalColumns, isSeatTaken, takeSeat, onMove]);

  useMousetrap({
    keys: MovementKeys.right,
    callback: moveRight,
    // TODO: bindRef: (null as never) as MutableRefObject<HTMLElement>,
    withGlobalBind: true, // TODO: remove this once we have a ref to bind to
  });
};
