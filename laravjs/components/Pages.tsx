import { Link, Route, Switch, useParams } from "wouter-preact";
import { Field } from "../fields";
import { CreateView, EditView } from "./FormView";
import ViewView from "./ViewView";
import ListView from "./ListView";

export function ListPage({resource, fields}: {resource: string, fields: Field[]}) {
    return <>
        <BreadCrumb items={[{text: resource, href: `/${resource}`},]}/>
        <ListView resource={resource} fields={fields} />
    </>
}

export function EditPage({resource, fields}: {resource: string, fields: Field[]}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: resource, href: `/${resource}`},
        {text: id, href: `/${resource}/${id}`},
        {text: 'edit',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <EditView resource={resource} fields={fields} id={id}/>
    </>
}

export function CreatePage({resource, fields}: {resource: string, fields: Field[]}) {
    const breadcrumbs = [
        {text: resource, href: `/${resource}`},
        {text: 'create',}
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <CreateView resource={resource} fields={fields} />
    </>
}

export function ViewPage({resource, fields}: {resource: string, fields: Field[]}) {
    const {id} = useParams()
    const breadcrumbs = [
        {text: resource, href: `/${resource}`},
        {text: id},
    ]
    return <>
        <BreadCrumb items={breadcrumbs}/>
        <ViewView resource={resource} fields={fields} id={id}/>
    </>
}

export function ResourceRoutes({resource, fields}: {resource: string, fields: Field[]}) {
    return <Switch>
        <Route path={`/${resource}`} component={() => <ListPage resource={resource} fields={fields}/>} />
        <Route path={`/${resource}/create`} component={() => <CreatePage resource={resource} fields={fields}/>} />
        <Route path={`/${resource}/:id`} component={() => <ViewPage resource={resource} fields={fields}/>}/>
        <Route path={`/${resource}/:id/edit`} component={() => <EditPage resource={resource} fields={fields}/>}/>
    </Switch>
}


function BreadCrumb({items}: {items: {text: string, href?: string}[]}) {
    return <div className="text-sm text-gray-700 my-4">
        <Link href="/" className="hover:text-blue-600">home</Link>
        {items.map(({text, href}) => <> {`>`} {href? <Link href={href} className="hover:text-blue-600">{text}</Link>: <span>{text}</span>}</>)}
    </div>
}
