# Obsidian Customizable Right Click Menu

This plugin allows you to hide any commands, including those of community plugins. 

Note: this plugin, like all my plugins, is semi-abandonded.

## Prerequisite

Before using this plugin, ensure you have disable "Native menus" in Obsidian's Appearance settings.

## Remove Commands

Add the name of the command to hide exactly as it appears in the Obsidian menu. Note that this setting will remove *all* instances of a command with that name from all context menus across Obsidian (note menu, file explorer menu, etc), not just the in-note menu. 

Unlike kzhovn's [obsidian-customizable-menu](https://github.com/kzhovn/obsidian-customizable-menu), this implementation requires commands to be entered line-by-line rather than using comma separation, ensuring better readability.

If you would like to style the listed commands yourself, instead of simply removing them, the selector is `div.custom-menu-hide-item`.

## Development Roadmap

- [ ] Develop remove commands across multiple menus.
- [ ] Hide redundant menu separators when all enclosed commands are hidden for cleaner UI.

## Thanks

This plugin was initially a fork of kzhovn's excellent [obsidian-customizable-menu](https://github.com/kzhovn/obsidian-customizable-menu).