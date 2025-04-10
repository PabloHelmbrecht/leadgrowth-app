import { atom } from "jotai"
import { z } from "zod"
import { generateId } from "~/lib/utils/formatters"


//Schemas
export const userSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.enum(["admin", "non-admin"]),
    email: z.string(),
    isActive: z.boolean()

})

//Types
export type User = z.infer<typeof userSchema>


//Data
export const usersMockData: User[] = [{
    id: generateId(),
    firstName: "Pablo",
    lastName: "Helmbrecht",
    role: "admin",
    email: "pablo@weareleadgrowth.com",
    isActive: true
}]




//Atoms
export const usersMockDataAtom = atom<User[]>(usersMockData)

