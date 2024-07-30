import { Link, Route, Switch, useParams } from "wouter-preact";
import { CreateView, EditView } from "./FormView";
import ViewView from "./ViewView";
import ListView from "./ListView";
import _ from '../util/dash';
import { Resource } from "./Resource";
import { useHttpState } from "../util/requests";

export function HomePage() {
    const stats = useHttpState(`/admin/api/stats`, [])
    return <div className="text-center">
        {stats.map(({resource, count}) => <div className="my-8">
            <h3 class="my-4 text-xl font-bold">{_.capitalize(resource)}</h3>
            <p class="text-gray-500 my-4">count: {count}</p>
            <p class="space-x-3">
                <Link href={`/${resource}`} className="text-blue-600 border-2 border-blue-600 rounded-md px-6 py-2 hover:bg-blue-600 hover:text-white">view</Link>
                <Link href={`/${resource}/create`} className="text-indigo-600 border-2 border-indigo-600 rounded-md px-6 py-2 hover:bg-indigo-600 hover:text-white">create</Link>
            </p>
        </div>)}
    </div>
}

export function ListPage({resource}: {resource: Resource}) {
    return <>
        <BreadCrumb items={[{text: _.capitalize(resource.name), href: `/${resource.name}`},]}/>
        <ListView resource={resource}/>
    </>
}

export function EditPage({resource}: {resource: Resource}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: _.capitalize(resource.name), href: `/${resource.name}`},
        {text: id, href: `/${resource.name}/${id}`},
        {text: 'Edit',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <EditView resource={resource} id={id}/>
    </>
}

export function CreatePage({resource}: {resource: Resource}) {
    const breadcrumbs = [
        {text: _.capitalize(resource.name), href: `/${resource.name}`},
        {text: 'Create',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <CreateView resource={resource} />
    </>
}

export function ViewPage({resource}: {resource: Resource}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: _.capitalize(resource.name), href: `/${resource.name}`},
        {text: id},
    ]
    return <>
    <BreadCrumb items={breadcrumbs}/>
        <ViewView resource={resource} id={id}/>
    </>
}

export function ResourceRoutes({resource}: {resource: Resource}) {
    return <Switch>
        <Route path={`/${resource.name}`} component={() => <ListPage resource={resource}/>} />
        <Route path={`/${resource.name}/create`} component={() => <CreatePage resource={resource}/>} />
        <Route path={`/${resource.name}/:id`} component={() => <ViewPage resource={resource}/>}/>
        <Route path={`/${resource.name}/:id/edit`} component={() => <EditPage resource={resource}/>}/>
    </Switch>
}


function BreadCrumb({items}: {items: {text: string, href?: string}[]}) {
    return <nav className="my-4">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
            <li class="inline-flex items-center">
                <Link href="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                    <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Home
                </Link>
            </li>
            {items.map(({text, href}) => <li>
                <div class="flex items-center">
                    <svg class="w-3 h-3 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    {href ? <Link href={href} class="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2">{text}</Link>
                        : <span className="text-sm font-medium text-gray-700">{text}</span>}
                </div>
            </li>)}
        </ol>
    </nav>
}
