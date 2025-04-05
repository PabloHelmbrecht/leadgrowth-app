import type { Contact } from "../stores/mockData/contact"
import type { Sequence } from "../stores/mockData/sequence"

export type supportedContactFieldsType = {
    label: string
    value: keyof Contact
}[]

export type supportedCompanyFieldsType = {
    label: string
    value: string //Cuando tenga la definición de la empresa, cambiar a keyof Company
}[]

export type supportedSequenceFieldsType = {
    label: string
    value: keyof Sequence
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

export const supportedSequenceFields: supportedSequenceFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]

export const supportedCompanyFields: supportedCompanyFieldsType = [
    { label: "Name", value: "name" },
    { label: "Status", value: "status" },
]
