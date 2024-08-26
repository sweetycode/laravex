import { dynScript } from "./dom";

const EMOJI_MAPPING = {
    'no': 10060,
    'yes': 9989,
}

function emojify(name) {
    const cp = EMOJI_MAPPING[name]
    if (cp) {
        return `&#${cp}`
    }
    return name
}

const EMOJI_EXTENSION = {
    name: 'emoji',
    level: 'inline',
    start(src) { return src.indexOf(':')},
    tokenizer(src, tokens) {
        const rule = /^:(\w+):/
        const match = rule.exec(src)
        if (match) {
            return {
                type: 'emoji',
                raw: match[0],
                emoji: match[1],
            }
        }
    },
    renderer(token) {
        return emojify(token.emoji)
    },
}

function initMarked() {
    marked.use({
        breaks: true,
        renderer: {
            link(href: string, title, text) {
                if (href == null || href == '') {
                    return false
                }
                if (href.startsWith('./') || href.startsWith('/') || href.indexOf('://') > 0) {
                    return false
                }

                return `<span data-tr="${href}">${text}</span>`
            },
            paragraph(html: string) {
                const groups = html.match(/^\.[a-zA-Z0-9\-]{1,9} /)
                if (groups == null) {
                    return false
                }
                const className = groups[0].substring(1).trim()
                return `<p class="${className}">${html.substring(groups[0].length)}</p>`
            }
        },
        extensions: [EMOJI_EXTENSION],
    })
}

export async function markdownToHtml(markdown: string) {
    await dynScript('https://cdn.jsdelivr.net/npm/marked@13.0.2/lib/marked.umd.min.js', initMarked)
    return marked.parse(markdown)
}
