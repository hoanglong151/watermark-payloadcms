'use server'

import { getPayload } from 'payload'
import configPromise from '../../payload.config'

export async function getOriginImgById(id: string) {
  const payload = await getPayload({ config: configPromise })
  try {
    const res = await payload.findByID({
      collection: 'media',
      id: id,
      overrideAccess: true,
    })
    return res
  } catch (err) {
    payload.logger.error(err)
    return { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }
  }
}

export async function getListWatermark() {
  const payload = await getPayload({ config: configPromise })
  try {
    const res = await payload.find({
      collection: 'watermark',
      overrideAccess: true,
      pagination: false,
    })
    return res
  } catch (err) {
    payload.logger.error(err)
    return { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }
  }
}
