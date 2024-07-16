import { Link, Route, Switch, useParams } from "wouter-preact";
import { Field } from "../fields";
import { CreateView, EditView } from "./FormView";
import ViewView from "./ViewView";
import ListView from "./ListView";
import { NamedField } from "./Fields";

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

export function ResourceRoutes({name, fields}: {name: string, fields: NamedField[]}) {
    return <Switch>
        <Route path={`/${name}`} component={() => <ListPage resource={name} fields={fields}/>} />
        <Route path={`/${name}/create`} component={() => <CreatePage resource={name} fields={fields}/>} />
        <Route path={`/${name}/:id`} component={() => <ViewPage resource={name} fields={fields}/>}/>
        <Route path={`/${name}/:id/edit`} component={() => <EditPage resource={name} fields={fields}/>}/>
    </Switch>
}


function BreadCrumb({items}: {items: {text: string, href?: string}[]}) {
    return <div className="text-sm text-gray-700 my-4">
        <Link href="/" className="hover:text-blue-600">home</Link>
        {items.map(({text, href}) => <> {`>`} {href? <Link href={href} className="hover:text-blue-600">{text}</Link>: <span>{text}</span>}</>)}
    </div>
}
