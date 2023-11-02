import * as crypto from 'node:crypto'
import { isString } from 'lodash'

export function md5(str: string | number) {
  const hash = crypto.createHash('md5')
  hash.update(isString(str) ? str : str.toString())
  return hash.digest('hex')
}
