import { Link, Route, Switch, useParams } from "wouter-preact";
import { CreateView, EditView } from "./FormView";
import ViewView from "./ViewView";
import ListView from "./ListView";
import { Resource } from "./BasicAdminApp";

export function ListPage({resource}: {resource: Resource}) {
    return <>
        <BreadCrumb items={[{text: resource.name, href: `/${resource.name}`},]}/>
        <ListView resource={resource}/>
    </>
}

export function EditPage({resource}: {resource: Resource}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: resource.name, href: `/${resource.name}`},
        {text: id, href: `/${resource.name}/${id}`},
        {text: 'edit',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <EditView resource={resource} id={id}/>
    </>
}

export function CreatePage({resource}: {resource: Resource}) {
    const breadcrumbs = [
        {text: resource.name, href: `/${resource.name}`},
        {text: 'create',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <CreateView resource={resource} />
    </>
}

export function ViewPage({resource}: {resource: Resource}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: resource.name, href: `/${resource.name}`},
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
    return <div className="text-sm text-gray-700 my-4">
        <Link href="/" className="hover:text-blue-600">home</Link>
        {items.map(({text, href}) => <> {`>`} {href? <Link href={href} className="hover:text-blue-600">{text}</Link>: <span>{text}</span>}</>)}
    </div>
}
