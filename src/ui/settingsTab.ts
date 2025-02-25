import { PluginSettingTab, App, Setting, debounce } from 'obsidian';
import HidingCommandPlugin from 'src/main';
import { HidingCommandSettings, HideCommands } from 'src/types';

const EmptyCommands: HideCommands = {
  plainTexts: [],
  regexTexts: [],
};

export const DEFAULT_SETTINGS: HidingCommandSettings = {
  fileMenu: {
    tabHeader: { ...EmptyCommands },
    moreOptions: { ...EmptyCommands },
    fileExplorerContext: { ...EmptyCommands },
    linkContext: { ...EmptyCommands },
  },
  filesMenu: {
    fileExplorerContext: { ...EmptyCommands },
  },
  editorMenu: { ...EmptyCommands },
  urlMenu: { ...EmptyCommands },
  otherMenu: { ...EmptyCommands },
  delayTime: 1,
};

export default class HidingCommandSettingsTab extends PluginSettingTab {
  plugin: HidingCommandPlugin;

  constructor(app: App, plugin: HidingCommandPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const { settings } = this.plugin;
    containerEl.empty();
    containerEl.addClass('hide-commands-settings');
    containerEl.createEl('div', {
      text: 'Enter command names as a line-separated list (one command per line). Commands are case-sensitive. Changes will take effect after restarting Obsidian or reloading the plugin.',
    });

    this.createMenuSettings(
      containerEl,
      'File menu (tab header)',
      settings.fileMenu.tabHeader,
      'Hide commands from the file menu when right-clicking on the tab header.'
    );
    this.createMenuSettings(
      containerEl,
      'File menu (more options)',
      settings.fileMenu.moreOptions,
      'Hide commands from the file menu when clicking the "More Options" button.'
    );
    this.createMenuSettings(
      containerEl,
      'File menu (file explorer)',
      settings.fileMenu.fileExplorerContext,
      'Hide commands from the file menu when right-clicking on a file or folder in the file explorer.'
    );
    this.createMenuSettings(
      containerEl,
      'File menu (link context)',
      settings.fileMenu.linkContext,
      'Hide commands from the file menu when right-clicking on a file link.'
    );
    this.createMenuSettings(
      containerEl,
      'Files menu (file explorer)',
      settings.filesMenu.fileExplorerContext,
      'Hide commands from the files menu when right-clicking on files or folders in the file explorer.'
    );
    this.createMenuSettings(
      containerEl,
      'Editor menu',
      settings.editorMenu,
      'Hide commands from the editor menu when right-clicking in the editor view.'
    );
    this.createMenuSettings(
      containerEl,
      'URL menu',
      settings.urlMenu,
      'Hide commands from the URL menu when right-clicking on an external URL.'
    );
    this.createMenuSettings(
      containerEl,
      'Other menus',
      settings.otherMenu,
      'Hide commands from additional menus not covered above.'
    );
  }

  /**
   * Create specific menu settings
   * @param parentEl - Parent element
   * @param title - Menu title
   * @param commands - Menu commands configuration
   * @param description - Menu description
   */
  private createMenuSettings(
    parentEl: HTMLElement,
    title: string,
    commands: HideCommands,
    description: string
  ): void {
    const detailsEl = parentEl.createEl('details');
    detailsEl.createEl('summary', { text: title });
    detailsEl.createEl('div', {
      text: description,
      cls: 'hide-commands-detail-description',
    });

    // Create plain text settings
    createTextAreaSetting(
      detailsEl,
      'Enter commands to hide (plain text format)',
      'Enter command names (one per line)',
      commands.plainTexts,
      async (value) => {
        commands.plainTexts = parseCmdString(value);
        await this.plugin.saveSettings();
      }
    );

    // Create regex settings
    createTextAreaSetting(
      detailsEl,
      'Enter commands to hide (regex format)',
      'Enter command names (one per line)',
      commands.regexTexts,
      async (value) => {
        commands.regexTexts = parseCmdString(value);
        await this.plugin.saveSettings();
      },
      3 // Set rows to 3
    );
  }
}

/**
 * Create textarea setting
 * @param parentEl - Parent element
 * @param name - Setting name
 * @param placeholder - Placeholder text
 * @param value - Initial value
 * @param onChange - Callback when value changes
 * @param rows - Number of rows (default 8)
 * @param cols - Number of columns (default 30)
 */
function createTextAreaSetting(
  parentEl: HTMLElement,
  name: string,
  placeholder: string,
  value: string[],
  onChange: (value: string) => Promise<void>,
  rows: number = 8,
  cols: number = 30
): Setting {
  return new Setting(parentEl).setName(name).addTextArea((text) => {
    text
      .setPlaceholder(placeholder)
      .setValue(value.join('\n'))
      .onChange(debounce(onChange, 500, true));
    text.inputEl.rows = rows;
    text.inputEl.cols = cols;
  });
}

/**
 * Parse command string
 * @param commands - Command string
 * @returns Parsed command array
 */
function parseCmdString(commands: string): string[] {
  return commands
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v !== '');
}
