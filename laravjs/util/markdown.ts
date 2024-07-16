import { dynScript } from "./dom";

function initMarked() {
    marked.use({
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
        }
    })
}

export async function markdownToHtml(markdown: string) {
    await dynScript('https://cdn.jsdelivr.net/npm/marked@13.0.2/lib/marked.umd.min.js', initMarked)
    return marked.parse(markdown)
}
