export function hideMenuItems(menuPositionMapping: Record<string, string[]>) {
  const menu = document.body.querySelector(".menu");
  const menuScroll = document.body.querySelector(".menu-scroll");
  if (!menu || !menuScroll) return;

  const position = Array.from(menu.classList).find(
    (className) => menuPositionMapping[className]
  );

  if (!position) return;

  const hideTitles = menuPositionMapping[position];
  const children = Array.from(menuScroll.children);
  let lastSeparatorIndex = -1;

  children.forEach((child, index) => {
    if (child.classList.contains("menu-item")) {
      const titleElement = child.querySelector(".menu-item-title");
      if (
        titleElement?.textContent &&
        hideTitles.includes(titleElement.textContent)
      ) {
        child.classList.add("custom-menu-hide-item");
      }
    }

    if (child.classList.contains("menu-separator")) {
      if (
        lastSeparatorIndex !== -1 &&
        handleSeparatorVisibility(children, lastSeparatorIndex, index)
      ) {
        child.classList.add("custom-menu-hide-separator");
      }
      lastSeparatorIndex = index;
    }
  });

  // Handle items after last separator
  if (
    lastSeparatorIndex !== -1 &&
    handleSeparatorVisibility(children, lastSeparatorIndex, children.length)
  ) {
    children[lastSeparatorIndex].classList.add("custom-menu-hide-separator");
  }
}

const handleSeparatorVisibility = (
  children: Element[],
  startIndex: number,
  endIndex: number
) => {
  for (let i = startIndex + 1; i < endIndex; i++) {
    if (!children[i].classList.contains("custom-menu-hide-item")) {
      return false;
    }
  }
  return true;
};
