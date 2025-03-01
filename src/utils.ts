import { HideCommands } from './types';

/**
 * Check if the separator needs to be hidden
 * @param children - Array of child elements
 * @param startIndex - Start index
 * @param endIndex - End index
 * @returns Whether the separator should be hidden
 */
function shouldHideSeparator(
  children: Element[],
  startIndex: number,
  endIndex: number
): boolean {
  for (let i = startIndex + 1; i < endIndex; i++) {
    if (!children[i].classList.contains('custom-menu-hide-item')) {
      return false;
    }
  }
  return true;
}

/**
 * Calculate the display position of the menu
 * @param clickX - X coordinate of the click
 * @param clickY - Y coordinate of the click
 * @param menuWidth - Width of the menu
 * @param menuHeight - Height of the menu
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @param padding - Redundant padding (default 2px)
 * @returns Left and top coordinates of the menu
 */
function calculateMenuPositionWithPadding(
  clickX: number,
  clickY: number,
  menuWidth: number,
  menuHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding: number = 2
): { left: number; top: number } {
  let left = clickX + padding;
  let top = clickY + padding;

  if (left + menuWidth > containerWidth) {
    left = clickX - menuWidth - padding;
  }

  if (top + menuHeight > containerHeight) {
    top = clickY - menuHeight - padding;
  }

  left = Math.max(0, Math.min(left, containerWidth - menuWidth));
  top = Math.max(0, Math.min(top, containerHeight - menuHeight));

  return { left, top };
}

/**
 * Position the menu and hide specified menu items
 * @param menuHideCommands - Hide commands configuration
 * @param ev - Mouse event
 */
export function hideMenuItems(
  menuHideCommands: Record<string, HideCommands>,
  ev: MouseEvent
): void {
  const container = document.querySelector('.app-container') as HTMLElement;
  if (!container) return;

  const { offsetHeight: containerHeight, offsetWidth: containerWidth } =
    container;
  const { clientX: clickX, clientY: clickY } = ev;

  const menus = document.body.querySelectorAll('.menu');
  const menu = menus[menus.length - 1] as HTMLElement;
  if (!menu) return;
  const menuContainer = menu.querySelector('.menu-scroll');
  if (!menuContainer) return;

  // Get menu class names
  const menuClasses = Array.from(menu.classList).filter(
    (className) => menuHideCommands[className]
  );
  if (!menuClasses.length) menuClasses.push('other-menu');

  // Extract plainTexts and regexTexts
  const plainTexts = menuClasses.flatMap(
    (className) => menuHideCommands[className].plainTexts
  );
  const regexTexts = [
    ...new Set(
      menuClasses.flatMap((className) => menuHideCommands[className].regexTexts)
    ),
  ].map((regexStr) => new RegExp(regexStr));

  // Handle menu items and separators hiding logic
  const children = Array.from(menuContainer.children);
  const totalChildren = children.length;
  let lastSeparatorIdx = -1;

  children.forEach((child, index) => {
    if (child.classList.contains('menu-item')) {
      const titleElement = child.querySelector('.menu-item-title');
      const title = titleElement?.textContent?.trim();
      if (!title) return;

      const shouldHide =
        plainTexts.includes(title) ||
        regexTexts.some((regex) => regex.test(title));
      if (shouldHide) {
        child.classList.add('custom-menu-hide-item');
      }
    } else if (child.classList.contains('menu-separator')) {
      if (shouldHideSeparator(children, lastSeparatorIdx, index)) {
        child.classList.add('custom-menu-hide-separator');
      }
      lastSeparatorIdx = index;
    }
  });

  // Handle the last separator
  if (shouldHideSeparator(children, lastSeparatorIdx, totalChildren)) {
    children[lastSeparatorIdx].classList.add('custom-menu-hide-separator');
  }

  // Calculate menu position and set styles
  const { offsetHeight: menuHeight, offsetWidth: menuWidth } = menu;
  const { left, top } = calculateMenuPositionWithPadding(
    clickX,
    clickY,
    menuWidth,
    menuHeight,
    containerWidth,
    containerHeight
  );

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}
