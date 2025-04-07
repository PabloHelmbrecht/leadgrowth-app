import type { Contact } from "../stores/mockData/contact"
import type { Workflow } from "../stores/mockData/workflow"

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
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Company", value: "company" },
    { label: "Stage", value: "stage" },
    { label: "Zip", value: "zip" },
    { label: "Is Active", value: "isActive" },
    { label: "Created At", value: "createdAt" },
]

export const supportedWorkflowFields: supportedWorkflowFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]

export const supportedCompanyFields: supportedCompanyFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]
