import { Link, Router } from "wouter-preact";
import { NamedField } from './Fields';
import { ResourceRoutes } from "./Pages";
import { render } from "preact";

export type NavLink = {href: string, label: string}
export type Resource = {name: string, fields: NamedField[]}

export function BasicAdminApp({base='/admin', navLinks, resources}: {
    base: string,
    navLinks: NavLink[],
    resources: Resource[],
}) {
    return <Router base={base}>
        <Nav navLinks={navLinks}/>
        <div className="max-w-4xl mx-auto my-4">
            {resources.map(({name, fields}) =>
                <ResourceRoutes name={name} fields={fields}/>
            )}
        </div>
    </Router>
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

export function renderBasicAdminApp({parentElement, base='/admin', navLinks, resources}: {
    parentElement: HTMLElement,
    base: string,
    navLinks: NavLink[],
    resources: Resource[]}) {
    render(<BasicAdminApp base={base} navLinks={navLinks} resources={resources}/>, parentElement);
}


