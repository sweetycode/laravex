import { Link, Route, Router } from "wouter-preact";
import { Field } from "./Fields";
import { ResourceRoutes } from "./Pages";
import { render } from "preact";

export type NavLink = {href: string, label: string}
export type ResourceWithFields = {resource: string, fields: Field[]}

export function BasicAdminApp({base='/admin', navLinks, resourcesWithFields}: {
    base: string,
    navLinks: NavLink[],
    resourcesWithFields: ResourceWithFields[]
}) {
    return <Router base={base}>
        <Nav navLinks={navLinks}/>
        <div className="max-w-4xl mx-auto my-4">
            {resourcesWithFields.map(({resource, fields}) =>
                <ResourceRoutes resource={resource} fields={fields}/>
            )}
        </div>
    </Router>
}

function BasicAdminHome() {
    return <h1>home</h1>
}

function Nav({navLinks}: {navLinks: {href: string, label: string}[]}) {
    return <nav className="py-4 border-b border-gray-200">
        <ul className="max-w-4xl mx-auto text-xl space-x-8">
            {navLinks.map(({href, label}) =>
                <li className="inline"><Link href={href} className="hover:text-blue-700">{label}</Link></li>
            )}
        </ul>
    </nav>
}

export function renderBasicAdminApp({parentElement, base='/admin', navLinks, resourcesWithFields}: {
    parentElement: HTMLElement,
    base: string,
    navLinks: NavLink[],
    resourcesWithFields: ResourceWithFields[]}) {
    render(<BasicAdminApp base={base} navLinks={navLinks} resourcesWithFields={resourcesWithFields}/>, parentElement);
}


