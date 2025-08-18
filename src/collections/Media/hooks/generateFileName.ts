import type { CollectionBeforeValidateHook } from 'payload'

function extractFileNameParts(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return {
      name: fileName,
      extension: '',
    }
  }

  return {
    name: fileName.slice(0, lastDotIndex),
    extension: fileName.slice(lastDotIndex + 1),
  }
}

/**
 * Generates the filename
 */
export const generateFileName: CollectionBeforeValidateHook = async (params) => {
  const data = params.data
  if (data) {
    const date = Date.now()
    const { name, extension } = extractFileNameParts(data.filename)

    data.filename = `images/${name}_${date}${extension ? `.${extension}` : ''}`
  }
}
