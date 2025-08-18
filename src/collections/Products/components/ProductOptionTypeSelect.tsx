'use client'

import { useEffect, useMemo, useRef } from 'react'

import { RelationshipFieldClientComponent } from 'payload'
import { RelationshipField, useField } from '@payloadcms/ui'

export const ProductOptionTypeSelect: RelationshipFieldClientComponent = ({
  path,
  field,
  permissions,
}) => {
  const { value } = useField({ path })

  const siblingValuePath = useMemo(
    // options.[index].type -> options.[index].values
    // This is really fragile, if we update the structure of the optins array, then we'd need to update here as well
    () => path.slice(0, path.lastIndexOf('.') + 1) + 'values',
    [path],
  )

  const { setValue: setValuesSiblingValue } = useField({ path: siblingValuePath })
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value
      setValuesSiblingValue([])
    }
  }, [value])

  return <RelationshipField path={path} field={field} permissions={permissions} />
}
