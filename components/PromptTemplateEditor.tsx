import React, {useEffect} from "react"
import type {PromptTemplate} from "~types";
import {Alert, Button, Divider, Form, Input, Tag, Typography} from "antd";
import {possibleTagColors} from "~constants";

const {TextArea} = Input
const {Text} = Typography

type Form = {
    name: string
    description: string
    content: string
}


export type PromptTemplateWithOldName = PromptTemplate & { oldName?: string }
type PromptTemplateEditorProps = {
    promptTemplate?: PromptTemplate
    onAbort: () => void
    onConfirm: (promptTemplate: PromptTemplateWithOldName) => void
}
export default function PromptTemplateEditor({promptTemplate, onConfirm, onAbort}: PromptTemplateEditorProps) {
    const [form] = Form.useForm<Form>();
    const [parameterNames, setParameterNames] = React.useState<string[]>([])
    const content = Form.useWatch('content', form);

    function extractWordsInBraces(inputString: string): string[] {
        const regex = /\{([^}]+)\}/g;
        let match;
        const matches = [];

        while ((match = regex.exec(inputString)) !== null) {
            matches.push(match[1]);
        }

        return matches;
    }

    useEffect(() => {
        setParameterNames(extractWordsInBraces(content))
    }, [content])
    const layout = {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    }
    const handleFinish = (values: Form) => {
        onConfirm({
            ...promptTemplate,
            oldName: promptTemplate? promptTemplate.name : undefined,
            name: values.name,
            description: values.description,
            content: values.content,
            variables: parameterNames.map(p => ({
               name: p
            }))
        })
    }
    const tipParameter = '{MY_PARAMETER}'
    return (
        <div className="prompt-template-editor">
            <Form onFinish={handleFinish}
                  form={form}
                  {...layout}
                  initialValues={{
                      name: promptTemplate?.name,
                      description: promptTemplate?.description,
                      content: promptTemplate?.content
                  }}
                  name="basic">
                <Form.Item name="name" label="Name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input/>
                </Form.Item>
                <Alert message={<Text>You can set parameters in your prompt by using curly braces example: <Text
                    code>{tipParameter}</Text></Text>}
                       style={{marginBottom: 16}}
                       type="info"
                       showIcon/>
                <Form.Item name="content" label="content">
                    <TextArea rows={4}/>
                </Form.Item>
                {parameterNames.length > 0 && <Divider plain>Parameters</Divider>}
                <div className="maestro-editor-parameter-list">
                    {parameterNames.map((parameterName, index) => (
                        <Tag key={index}
                             color={possibleTagColors[index % possibleTagColors.length]}>{parameterName}</Tag>
                    ))}
                </div>
                <Divider/>
                <div className="maestro-editor-footer">
                    <Button type="default" onClick={onAbort}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Save</Button>
                </div>
            </Form>
        </div>
    )
}
