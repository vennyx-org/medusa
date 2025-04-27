import {
  DeclarationReflection,
  IntrinsicType,
  ParameterReflection,
  ReferenceType,
  Reflection,
  ReflectionType,
} from "typedoc"

export function getHookChildren(
  reflection?: DeclarationReflection
): DeclarationReflection[] {
  const hookChildren: DeclarationReflection[] = []
  if (!reflection) {
    return hookChildren
  }

  const hookChildrenProperty = reflection.getChildByName("hooks")
  if (!(hookChildrenProperty instanceof DeclarationReflection)) {
    return hookChildren
  }

  switch (hookChildrenProperty.type?.type) {
    case "reflection":
      hookChildren.push(
        ...(hookChildrenProperty.type.declaration.children || [])
      )
      break
    case "intersection":
      hookChildrenProperty.type.types.forEach((type) => {
        if (type.type !== "reflection") {
          return
        }

        hookChildren.push(...(type.declaration.children || []))
      })
      break
  }

  return hookChildren
}

export function cleanUpHookInput(
  parameters: ParameterReflection[]
): (ParameterReflection | DeclarationReflection)[] {
  const hasInvokeParameter = parameters.some(
    (parameter) => parameter.name === "invoke"
  )
  if (hasInvokeParameter) {
    return getHookInputFromInvoke(parameters)
  }
  return parameters.map((parameter) => {
    if (parameter.type?.type !== "reference" || !parameter.type.reflection) {
      return parameter
    }

    cleanUpReflectionType(parameter.type.reflection)

    if (
      parameter.type.reflection &&
      parameter.type.reflection instanceof DeclarationReflection &&
      parameter.type.reflection.children
    ) {
      parameter.type.reflection.children.forEach(cleanUpReflectionType)
    }

    return parameter
  })
}

function cleanUpReflectionType(reflection: Reflection): Reflection {
  if (
    !(reflection instanceof DeclarationReflection) &&
    !(reflection instanceof ParameterReflection)
  ) {
    return reflection
  }

  if (reflection.name === "__type") {
    reflection.name = "input"
  }

  if (
    reflection.type?.type === "reference" &&
    reflection.type.name === "WorkflowData" &&
    reflection.type.typeArguments?.length
  ) {
    reflection.type = reflection.type.typeArguments[0]
  }

  if (reflection.defaultValue) {
    delete reflection.defaultValue
  }

  if (reflection.name === "additional_data") {
    reflection.type = new IntrinsicType("Record<string, unknown> | undefined")
  } else if (
    reflection.type?.type === "intersection" &&
    reflection.type.types.length >= 2
  ) {
    reflection.type = reflection.type.types[1]
  }

  if (reflection instanceof DeclarationReflection && reflection.children) {
    reflection.children.forEach(cleanUpReflectionType)
  }

  return reflection
}

function getHookInputFromInvoke(
  parameters: ParameterReflection[]
): DeclarationReflection[] {
  const invokeParameter = parameters.find(
    (parameter) =>
      parameter.name === "invoke" &&
      parameter.type?.type === "reference" &&
      parameter.type.typeArguments?.length &&
      parameter.type.typeArguments[0].type === "reflection"
  )
  if (!invokeParameter) {
    return []
  }

  const reflection = cleanUpReflectionType(
    (
      (invokeParameter.type as ReferenceType)
        .typeArguments![0] as ReflectionType
    ).declaration
  )

  if (
    reflection &&
    reflection instanceof DeclarationReflection &&
    reflection.children
  ) {
    reflection.children.forEach(cleanUpReflectionType)
  }

  return [reflection] as DeclarationReflection[]
}
