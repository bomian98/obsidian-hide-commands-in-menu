import { PluginSettingTab, App, Setting, debounce, Notice } from "obsidian";
import HidingCommandPlugin from "src/main";

export interface FileMenu {
  tabHeader: string[];
  moreOptions: string[];
  fileExplorerContextMenu: string[];
}

export interface EditorMenu {
  editorContextMenu: string[];
}

export interface HidingCommandSettings {
  fileMenu: FileMenu;
  editorMenu: EditorMenu;
  delayTime: number;
}

export const DEFAULT_SETTINGS: HidingCommandSettings = {
  fileMenu: {
    tabHeader: [],
    moreOptions: [],
    fileExplorerContextMenu: [],
  },
  editorMenu: {
    editorContextMenu: [],
  },
  delayTime: 1,
};

export default class HidingCommandSettingsTab extends PluginSettingTab {
  plugin: HidingCommandPlugin;

  constructor(app: App, plugin: HidingCommandPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Hide commands" });
    containerEl.createEl("div", {
      text: "Enter the names of the commands as a line-separated list. One line one command. Commands are case-sensitive. You will need to restart Obsidian or reload the plugin for the changes to take effect.",
    });

    new Setting(containerEl)
      .setName("Tab Header")
      .setHeading()
      .setDesc("Right click on the tab")
      .addTextArea((text) => {
        const onChange = async (value: string) => {
          const list = value.split("\n").map((v) => v.trim());
          this.plugin.settings.fileMenu.tabHeader = list;
          await this.plugin.saveSettings();
        };
        text.setPlaceholder("Enter commands to hide");
        text
          .setValue(this.plugin.settings.fileMenu.tabHeader.join("\n"))
          .onChange(debounce(onChange, 500, true));
        text.inputEl.rows = 10;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("More Options")
      .setHeading()
      .setDesc("Right click on the more options button")
      .addTextArea((text) => {
        const onChange = async (value: string) => {
          const list = value.split("\n").map((v) => v.trim());
          this.plugin.settings.fileMenu.moreOptions = list;
          await this.plugin.saveSettings();
        };
        text.setPlaceholder("Enter commands to hide");
        text
          .setValue(this.plugin.settings.fileMenu.moreOptions.join("\n"))
          .onChange(debounce(onChange, 500, true));
        text.inputEl.rows = 10;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("File Explorer Context Menu")
      .setHeading()
      .setDesc("Right click on the file explorer")
      .addTextArea((text) => {
        const onChange = async (value: string) => {
          const list = value.split("\n").map((v) => v.trim());
          this.plugin.settings.fileMenu.fileExplorerContextMenu = list;
          await this.plugin.saveSettings();
        };
        text.setPlaceholder("Enter commands to hide");
        text
          .setValue(
            this.plugin.settings.fileMenu.fileExplorerContextMenu.join("\n")
          )
          .onChange(debounce(onChange, 500, true));
        text.inputEl.rows = 10;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("Editor Context Menu")
      .setHeading()
      .setDesc("Right click on the editor")
      .addTextArea((text) => {
        const onChange = async (value: string) => {
          const list = value.split("\n").map((v) => v.trim());
          this.plugin.settings.editorMenu.editorContextMenu = list;
          await this.plugin.saveSettings();
        };
        text.setPlaceholder("Enter commands to hide");
        text
          .setValue(
            this.plugin.settings.editorMenu.editorContextMenu.join("\n")
          )
          .onChange(debounce(onChange, 500, true));
        text.inputEl.rows = 10;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("Delay Time")
      .setDesc(
        "Delay time in microseconds before hiding the commands, 1 ms in default."
      )
      .addText((text) => {
        const onChange = async (value: string) => {
          if (value.trim() === "") {
            this.plugin.settings.delayTime = 1;
            await this.plugin.saveSettings();
            return;
          }
          const num = parseInt(value);
          if (isNaN(num)) {
            new Notice(`Invalid delay time: ${value}`);
            return;
          } else {
            this.plugin.settings.delayTime = num;
            await this.plugin.saveSettings();
          }
        };
        text.setPlaceholder("Enter delay time in microseconds");
        text.setValue(this.plugin.settings.delayTime.toString());
        text.onChange(debounce(onChange, 1000, true));
      });
  }
}
