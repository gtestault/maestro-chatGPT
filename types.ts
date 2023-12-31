export interface PromptTemplate {
    name: string
    description?: string
    content: string
    variables?: Variable[]
}

export interface Variable {
    name: string
    description?: string
    value?: string
}

