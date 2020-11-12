// Type definitions for anyone-validate-fs 1.0
// Project: https://github.com/anyone-developer/anyone-validate-fs#readme
// Definitions by: Zhang Nan <https://github.com/anyone-developer>
// Definitions: https://github.com/anyone-developer/anyone-validate-fs
export = wrapper;

declare type wrapper = {
  setRenderLayout: typeof setRenderLayout;
  diff: typeof diff;
  avfs: avfs;
};

declare function diff(readPath: string, expansion: string, ignoreFiles: string, ignoreDirectories: string): diffResult | Error;

declare function setRenderLayout(layout: 'vertical' | 'horizontal'): avfs;

declare type avfs = wrapper;

declare type diffResult = {
  diff?: string;
};
