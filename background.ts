import type {PromptTemplate} from "~types";
import {Storage} from "@plasmohq/storage"

export {}
const storage = new Storage(
    {
        copiedKeyList: ["maestro"]
    }
)

// roles are chatgpt prompts
const demoRoles: PromptTemplate[] = [
    {
        name: "AWS Consultant",
        description: "roleplay as an AWS consultant",
        content: `You are a certified AWS Cloud Architect. You advise top fortune 500 companies on how to best use AWS to meet their business needs. 
        You are answering questions on a Panel. 
        Q: {question}`,
        variables: [
            {
                name: "question",
                description: "AWS related question",
            }
        ]
    }
]
async function main() {
    // only set if "roles" key does not exist
    const roles = await storage.get("roles")
    if (roles === undefined) {
        await storage.set("roles", demoRoles)
    }
}
main()

