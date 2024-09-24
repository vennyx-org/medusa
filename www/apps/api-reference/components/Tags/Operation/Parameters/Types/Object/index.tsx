"use client"

import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import dynamic from "next/dynamic"
import type { TagOperationParametersProps } from "../.."
import type { TagsOperationParametersNestedProps } from "../../Nested"
import checkRequired from "@/utils/check-required"
import { Loading, type DetailsProps } from "docs-ui"
import { useMemo } from "react"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

const TagsOperationParametersNested =
  dynamic<TagsOperationParametersNestedProps>(
    async () => import("../../Nested"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagsOperationParametersNestedProps>

const Details = dynamic<DetailsProps>(
  async () => (await import("docs-ui")).Details,
  {
    loading: () => <Loading />,
  }
) as React.FC<DetailsProps>

export type TagOperationParametersObjectProps = {
  name?: string
  schema: SchemaObject
  isRequired?: boolean
  topLevel?: boolean
}

const TagOperationParametersObject = ({
  name,
  schema,
  isRequired,
  topLevel = false,
}: TagOperationParametersObjectProps) => {
  const isPropertiesEmpty = useMemo(
    () => !schema.properties || !Object.values(schema.properties).length,
    [schema]
  )
  const isAdditionalPropertiesEmpty = useMemo(
    () =>
      !schema.additionalProperties ||
      schema.additionalProperties.type !== "object" ||
      !schema.additionalProperties.properties ||
      !Object.values(schema.additionalProperties.properties).length,
    [schema]
  )

  if (
    (schema.type !== "object" && schema.type !== undefined) ||
    (isPropertiesEmpty && isAdditionalPropertiesEmpty && !name)
  ) {
    return <></>
  }

  const getPropertyDescriptionElm = (expandable = false) => {
    const content = (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        isRequired={isRequired}
        expandable={expandable}
      />
    )
    return expandable ? (
      <summary className="cursor-pointer">{content}</summary>
    ) : (
      <>{content}</>
    )
  }

  const getPropertyParameterElms = (isNested = false) => {
    const properties = isPropertiesEmpty
      ? schema.additionalProperties!.properties
      : schema.properties
    // sort properties to show required fields first
    const sortedProperties = Object.keys(properties).sort(
      (property1, property2) => {
        properties[property1].isRequired = checkRequired(schema, property1)
        properties[property2].isRequired = checkRequired(schema, property2)

        return properties[property1].isRequired &&
          properties[property2].isRequired
          ? 0
          : properties[property1].isRequired
          ? -1
          : 1
      }
    )
    const content = (
      <>
        {sortedProperties.map((property, index) => (
          <TagOperationParameters
            schemaObject={{
              ...properties[property],
              parameterName: property,
            }}
            key={index}
            isRequired={
              properties[property].isRequired || checkRequired(schema, property)
            }
          />
        ))}
      </>
    )
    return (
      <>
        {isNested && (
          <TagsOperationParametersNested>
            {content}
          </TagsOperationParametersNested>
        )}
        {!isNested && <div>{content}</div>}
      </>
    )
  }

  if (isPropertiesEmpty && isAdditionalPropertiesEmpty) {
    return getPropertyDescriptionElm()
  }

  if (topLevel) {
    return getPropertyParameterElms()
  }

  return (
    <Details
      summaryElm={getPropertyDescriptionElm(true)}
      className="!border-y-0"
    >
      {getPropertyParameterElms(true)}
    </Details>
  )
}

export default TagOperationParametersObject
