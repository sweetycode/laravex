import { Link, Route, Router } from "wouter-preact";
import { HomePage, ResourceRoutes } from "./Pages";
import { render } from "preact";
import { Resource } from "./Resource";

export type NavLink = {href: string, label: string}

export function BasicAdminApp({base='/admin', navLinks, resources}: {
    base: string,
    navLinks: NavLink[],
    resources: Resource[],
}) {
    return <Router base={base}>
        <Nav navLinks={navLinks}/>
        <div className="max-w-4xl mx-auto p-4">
            {resources.map(resource =>
                <ResourceRoutes resource={resource}/>
            )}
            <Route path="/" component={HomePage} />
        </div>
    </Router>
}




function Nav({navLinks}: {navLinks: {href: string, label: string}[]}) {
    return <nav className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-xl flex items-center p-4">
            <ul className="space-x-8 flex">
                {navLinks.map(({href, label}) =>
                    <li><Link href={href} className="hover:text-blue-700">{label}</Link></li>
                )}
            </ul>
            <div className="grow"></div>
            <a href="/" className="border-4 border-purple-500 px-8 py-1 rounded-lg hover:bg-purple-500 hover:text-white text-base">Site</a>
        </div>

    </nav>
}

export function renderBasicAdminApp({parentElement, base='/admin', navLinks, resources}: {
    parentElement: HTMLElement,
    base?: string,
    navLinks: NavLink[],
    resources: Resource[]}) {
    render(<BasicAdminApp base={base} navLinks={navLinks} resources={resources}/>, parentElement);
}


