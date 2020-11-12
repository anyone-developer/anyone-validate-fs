// Type definitions for anyone-validate-fs 1.0
// Project: https://github.com/anyone-developer/anyone-validate-fs#readme
// Definitions by: Zhang Nan <https://github.com/anyone-developer>
// Definitions: https://github.com/anyone-developer/anyone-validate-fs
declare namespace avfs {
	export function diff(readPath: string, expansion: string, ignoreFiles: string, ignoreDirectories: string): Promise<diffResult>;

	export function setRenderLayout(layout: 'vertical' | 'horizontal'): typeof avfs;
}

declare type diffResult = {
	diff: string;
};

export = avfs;
