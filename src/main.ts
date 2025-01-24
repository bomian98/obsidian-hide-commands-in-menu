import { Plugin, MenuItem, Menu } from "obsidian";
import CustomMenuSettingsTab, {
  CustomMenuSettings,
  DEFAULT_SETTINGS,
} from "./ui/settingsTab";
import { around } from "monkey-around";
import { hideMenuItems } from "./utils";

export default class CustomMenuPlugin extends Plugin {
  settings: CustomMenuSettings;

  async onload() {
    console.log("Loading customizable menu");

    await this.loadSettings();
    this.addSettingTab(new CustomMenuSettingsTab(this.app, this));

    const {
      fileMenu: { tabHeader, moreOptions, fileExplorerContextMenu },
      editorMenu: { editorContextMenu },
      delayTime,
    } = this.settings;

    const menuPositionMapping: Record<string, string[]> = {
      "tab-header": tabHeader,
      "more-options": moreOptions,
      "file-explorer-context-menu": fileExplorerContextMenu,
      "editor-menu": editorContextMenu,
    };

    this.registerDomEvent(document.body, "contextmenu", (ev) => {
      setTimeout(() => hideMenuItems(menuPositionMapping), delayTime);
    });

    this.registerDomEvent(document.body, "click", (ev) => {
      setTimeout(() => hideMenuItems(menuPositionMapping), delayTime);
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file, source) => {
        (menu as any).dom.addClass(source);
      })
    );

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu) => {
        (menu as any).dom.addClass("editor-menu");
      })
    );
  }

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
