import { useEffect } from "preact/hooks";

export function usePageTitle(title: string) {
    useEffect(() => {
        document.title = title
    }, [])
}
