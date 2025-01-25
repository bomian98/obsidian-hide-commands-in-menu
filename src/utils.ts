import { HideCommands } from './types';

/**
 * 检查是否需要隐藏分隔符
 * @param children - 子元素数组
 * @param startIndex - 起始索引
 * @param endIndex - 结束索引
 * @returns 是否需要隐藏分隔符
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
 * 计算菜单的显示位置
 * @param clickX - 点击的 X 坐标
 * @param clickY - 点击的 Y 坐标
 * @param menuWidth - 菜单的宽度
 * @param menuHeight - 菜单的高度
 * @param containerWidth - 容器的宽度
 * @param containerHeight - 容器的高度
 * @param padding - 冗余间距（默认为 2px）
 * @returns 菜单的 left 和 top 坐标
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
 * 定位菜单并隐藏指定的菜单项
 * @param menuHideCommands - 隐藏命令配置
 * @param ev - 鼠标事件
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

  const menu = document.body.querySelector('.menu') as HTMLElement;
  const menuContainer = document.body.querySelector(
    '.menu-scroll'
  ) as HTMLElement;
  if (!menu || !menuContainer) return;

  // 获取菜单的类名
  const menuClasses = Array.from(menu.classList).filter(
    (className) => menuHideCommands[className]
  );
  if (!menuClasses.length) menuClasses.push('other-menu');

  // 提取 plainTexts 和 regexTexts
  const plainTexts = menuClasses.flatMap(
    (className) => menuHideCommands[className].plainTexts
  );
  const regexTexts = [
    ...new Set(
      menuClasses.flatMap((className) => menuHideCommands[className].regexTexts)
    ),
  ].map((regexStr) => new RegExp(regexStr));

  // 处理菜单项和分隔符的隐藏逻辑
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

  // 处理最后一个分隔符
  if (shouldHideSeparator(children, lastSeparatorIdx, totalChildren)) {
    children[lastSeparatorIdx].classList.add('custom-menu-hide-separator');
  }

  // 计算菜单位置并设置样式
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
