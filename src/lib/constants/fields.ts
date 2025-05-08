//Types
import { type Contact } from "../hooks/use-contacts"
import { type Workflow } from "../hooks/use-workflows"

export type supportedContactFieldsType = {
    label: string
    value: keyof Contact
}[]

export type supportedCompanyFieldsType = {
    label: string
    value: string //Cuando tenga la definición de la empresa, cambiar a keyof Company
}[]

export type supportedWorkflowFieldsType = {
    label: string
    value: keyof Workflow
}[]

export const supportedContactFields: supportedContactFieldsType = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Company", value: "company" },
    { label: "Stage", value: "stage" },
    { label: "Created At", value: "created_at" },
]

export const supportedWorkflowFields: supportedWorkflowFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]

export const supportedCompanyFields: supportedCompanyFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]
