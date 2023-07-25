import type {PromptTemplate, Variable} from "~types";

export function validateRoles(role: PromptTemplate[]) {
    //expect array
    if (!Array.isArray(role)) {
        throw new Error(`top level element must be an array of roles`)
    }
    //expect each role has a name and content
    for (const r of role) {
        if (!r.name) {
            throw new Error(`each role must have a name`)
        }
        if (!r.content) {
            throw new Error(`each role must have a content`)
        }
        if (r.variables) {
            try {
                validateVariables(r.variables)
            } catch (e) {
                throw new Error(`invalid variables in role ${r.name}: ${e.message}`)
            }
        }
    }
}

export function validateVariables(variables: Variable[]) {
    // it's ok to have no variables
    if (!variables) {
        return
    }
    //expect array
    if (!Array.isArray(variables)) {
        throw new Error(`variables must be an array`)
    }
    //expect each variable has a name
    for (const v of variables) {
        if (!v.name) {
            throw new Error(`each variable must have a name`)
        }
    }
}
