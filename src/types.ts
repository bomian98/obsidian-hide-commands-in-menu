export type MouseEvent = 'auxclick' | 'contextmenu' | 'click' | 'dblclick';

export interface HideCommands {
  plainTexts: string[];
  regexTexts: string[];
}

export interface FileMenu {
  tabHeader: HideCommands;
  moreOptions: HideCommands;
  fileExplorerContext: HideCommands;
  linkContext: HideCommands;
}

export interface FilesMenu {
  fileExplorerContext: HideCommands;
}

export interface HidingCommandSettings {
  //   globalMenu: HideCommands;
  fileMenu: FileMenu;
  filesMenu: FilesMenu;
  editorMenu: HideCommands;
  urlMenu: HideCommands;
  otherMenu: HideCommands;
  delayTime: number;
}
