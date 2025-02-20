import {IKeyStringOptional} from '../bb-types';
import {BB} from '../bb';

function decomposeElString (el: string) {
    if (el === '') {
        return {};
    }

    let split: string[];
    let tagName: string;
    const classes: string[] = [];

    split = el.split('.');

    if (split.length === 1) {
        split = split[0].split(',');
        tagName = split.shift()!;

    } else {
        tagName = split.shift()!;
        split.forEach((item, index) => {
            const isLast = index === split.length - 1;
            if (isLast) {
                split = item.split(',');
                const last = split.shift();
                if (last !== undefined) {
                    classes.push(last);
                }
            } else {
                classes.push(item);
            }
        });
    }

    const result = {} as {
        tagName?: string;
        classes?: string[];
        styles?: string[];
    };
    if (tagName !== '') {
        result.tagName = tagName;
    }
    if (classes.length > 0) {
        result.classes = classes;
    }
    if (split.length > 0) {
        result.styles = split;
    }
    return result;
}

function applyStyleNames (el: HTMLElement, styleNames: string[]) {
    const style: IKeyStringOptional = {};

    const operations: {
        [key: string]: (params: string[]) => void;
    } = {
        c: (params) => {
            style.color = params[0];
        },
        bg: (params) => {
            style.background = params[0];
        },
        p: (params) => {
            style.padding = params[0] + 'px';
        },
        py: (params) => {
            style.paddingTop = params[0] + 'px';
            style.paddingBottom = params[0] + 'px';
        },
        mt: (params) => {
            style.marginTop = params[0] + 'px';
        },
        mb: (params) => {
            style.marginBottom = params[0] + 'px';
        },

        // flex
        flex: () => {
            style.display = 'flex';
        },
        'flexCol': () => {
            style.flexDirection = 'column';
        },
        'flexWrap': () => {
            style.flexWrap = 'wrap';
        },
        gap: (params) => {
            style.gap = params.map(item => item + 'px').join(' ');
        },
        grow: () => {
            style.flexGrow = '1';
        },
        justify: (params) => {
            style.justifyContent = params[0];
        },
        items: (params) => {
            style.alignItems = params[0];
        },

        hidden: () => {
            style.display = 'none';
        },
        nowrap: () => {
            style.whiteSpace = 'nowrap';
        },
        abs: (params) => {
            style.position = 'absolute';
            style.left = params[0] + 'px';
            style.top = params[1] + 'px';
        },
        w: (params) => {
            style.width = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
        h: (params) => {
            style.height = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
        minh: (params) => {
            style.minHeight = params[0] + 'px';
        },
        z: (params) => {
            style.zIndex = params[0];
        },
        overflow: (params) => {
            style.overflow = params[0];
        },
        pos: (params) => {
            style.position = params[0];
        },
        left: (params) => {
            style.left = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
        top: (params) => {
            style.top = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
        right: (params) => {
            style.right = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
        bottom: (params) => {
            style.bottom = params[0] === 'full' ? '100%' : params[0] + 'px';
        },
    };

    styleNames.forEach(item => {
        const params = item.split('-');
        const operation = params.shift()!;
        operations[operation](params);
    });
    BB.css(el, style);
}

/**
 * composes HTML
 */
export function c (
    el?: HTMLElement | string,
    inner?: string | (SVGElement | HTMLElement | string)[]
): HTMLElement {
    if (el === undefined) {
        return document.createElement('div');
    }
    if (typeof el !== 'string') {
        if (inner) {
            if (typeof inner === 'string') {
                el.innerHTML = inner;
            } else {
                el.append(...inner);
            }
        }
        return el;
    }

    const decomp = decomposeElString(el);
    const result = document.createElement(decomp.tagName ?? 'div');
    decomp.classes && result.classList.add(...decomp.classes);
    decomp.styles && applyStyleNames(result, decomp.styles);

    if (inner) {
        if (typeof inner === 'string') {
            result.innerHTML = inner;
        } else {
            result.append(...inner);
        }
    }
    return result;
}