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

    // 创建设置项
    this.createMenuSettings(
      containerEl,
      'File Menu (Tab Header)',
      settings.fileMenu.tabHeader,
      'Hide commands from the file menu when right-clicking on the tab header.'
    );
    this.createMenuSettings(
      containerEl,
      'File Menu (More Options)',
      settings.fileMenu.moreOptions,
      'Hide commands from the file menu when clicking the "More Options" button.'
    );
    this.createMenuSettings(
      containerEl,
      'File Menu (File Explorer)',
      settings.fileMenu.fileExplorerContext,
      'Hide commands from the file menu when right-clicking on a file or folder in the file explorer.'
    );
    this.createMenuSettings(
      containerEl,
      'File Menu (Link Context)',
      settings.fileMenu.linkContext,
      'Hide commands from the file menu when right-clicking on a file link.'
    );
    this.createMenuSettings(
      containerEl,
      'Files Menu (File Explorer)',
      settings.filesMenu.fileExplorerContext,
      'Hide commands from the files menu when right-clicking on files or folders in the file explorer.'
    );
    this.createMenuSettings(
      containerEl,
      'Editor Menu',
      settings.editorMenu,
      'Hide commands from the editor menu when right-clicking in the editor view.'
    );
    this.createMenuSettings(
      containerEl,
      'URL Menu',
      settings.urlMenu,
      'Hide commands from the URL menu when right-clicking on an external URL.'
    );
    this.createMenuSettings(
      containerEl,
      'Other Menus',
      settings.otherMenu,
      'Hide commands from additional menus not covered above.'
    );
  }

  /**
   * 创建菜单设置项
   * @param parentEl - 父元素
   * @param title - 菜单标题
   * @param commands - 菜单命令配置
   * @param description - 菜单描述
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

    // 创建纯文本设置项
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

    // 创建正则表达式设置项
    createTextAreaSetting(
      detailsEl,
      'Enter commands to hide (regex format)',
      'Enter command names (one per line)',
      commands.regexTexts,
      async (value) => {
        commands.regexTexts = parseCmdString(value);
        await this.plugin.saveSettings();
      },
      3 // 设置行数为 3
    );
  }
}

/**
 * 创建文本区域设置项
 * @param parentEl - 父元素
 * @param name - 设置项名称
 * @param placeholder - 占位符文本
 * @param value - 初始值
 * @param onChange - 值变化时的回调
 * @param rows - 行数（默认 8）
 * @param cols - 列数（默认 30）
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
 * 解析命令字符串
 * @param commands - 命令字符串
 * @returns 解析后的命令数组
 */
function parseCmdString(commands: string): string[] {
  return commands
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v !== '');
}
