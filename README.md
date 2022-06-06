# Obsidian Customizable Right Click Menu

This plugin allows you to add or hide any commands, including those of community plugins, to the right click menu and assign custom icons to them. Note that adding commands is available only on the note menu in Source and Live Preview mode, but not Preview mode or in the sidebars.

## Custom Icons

If the command doesn't yet have an icon, you can assign one from Obsidian's internal icons and Lucide icons. You can also reassign icons for commands with preixisiting icons by clicking the "edit" button once a command has been reigstered.

## Remove Commands
Add the name of the command to hide exactly as it appears in the Obsidian menu. Note that this setting will remove *all* instances of a command with that name from all context menus across Obsidian (note menu, file explorer menu, etc), not just the in-note menu. This means that in cases where a command with the same name appears in several different menus (for instance, "Open in default app" in both the file explorer menu and the note menu), it is currently impossible to hide just one of them.

If you would like to style the listed commands yourself, instead of simply removing them, the selector is `div.custom-menu-hide-item`.

## Thanks
This plugin was initially a fork of phibr0's excellent [customizable sidebar](https://github.com/phibr0/obsidian-customizable-sidebar), and still uses many elements from it. The code for hiding menu items comes in part from Panossa's [Mindful Obsidian](https://github.com/Panossa/mindful-obsidian/blob/master/main.ts)