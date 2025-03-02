import { Where } from 'payload'
import { PositionProps } from './type'

// Tính toán width x height tấm hình
export const calculateNewSize = (
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number,
) => {
  // Tính tỉ lệ thay đổi theo chiều rộng hoặc chiều cao
  const scaleWidth = (newWidth || 0) / originalWidth
  const scaleHeight = (newHeight || 0) / originalHeight

  // Nếu có chiều rộng mới, tính lại chiều cao tương ứng để giữ tỉ lệ
  if (newWidth && !newHeight) {
    newHeight = originalHeight * scaleWidth
  }

  // Nếu có chiều cao mới, tính lại chiều rộng tương ứng để giữ tỉ lệ
  if (newHeight && !newWidth) {
    newWidth = originalWidth * scaleHeight
  }

  return { newWidth, newHeight }
}

// Tính toán vị trí tấm hình
export const calculatePosition = (
  position: PositionProps,
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
) => {
  // canvasWidth: chiều dài canvas
  // canvasHeight: chiều cao canvas
  // watermarkWidth: chiều dài tấm hình watermask
  // watermarkHeight: chiều cao tấm hình watermask
  // xWatermark: đẩy từ trái canvas qua (px)
  // yWatermark: đẩy từ trên canvas xuống (px)
  // VD: canvasWidth = 200px, canvasHeight = 100px, watermarkWidth = 20px, watermarkHeight = 20px, xWatermark = 0, yWatermark = 0
  // => hình watermask nằm ở vị trí: góc trên bên trái tấm hình
  switch (position) {
    case 'top-right':
      return {
        xWatermark: canvasWidth - watermarkWidth,
        yWatermark: 0,
      }
    case 'top-center':
      return {
        xWatermark: canvasWidth / 2 + watermarkWidth / 2 - watermarkWidth,
        yWatermark: 0,
      }
    case 'top-left':
      return {
        xWatermark: 0,
        yWatermark: 0,
      }
    case 'bottom-right':
      return {
        xWatermark: canvasWidth - watermarkWidth,
        yWatermark: canvasHeight - watermarkHeight,
      }
    case 'bottom-center':
      return {
        xWatermark: canvasWidth / 2 + watermarkWidth / 2 - watermarkWidth,
        yWatermark: canvasHeight - watermarkHeight,
      }
    case 'bottom-left':
      return {
        xWatermark: 0,
        yWatermark: canvasHeight - watermarkHeight,
      }
    case 'center-right':
      return {
        xWatermark: canvasWidth - watermarkWidth,
        yWatermark: canvasHeight / 2 + watermarkHeight / 2 - watermarkHeight,
      }
    case 'center-center':
      return {
        xWatermark: canvasWidth / 2 + watermarkWidth / 2 - watermarkWidth,
        yWatermark: canvasHeight / 2 + watermarkHeight / 2 - watermarkHeight,
      }
    case 'center-left':
      return {
        xWatermark: 0,
        yWatermark: canvasHeight / 2 + watermarkHeight / 2 - watermarkHeight,
      }
  }
}

export function mediaWhere(idImage: string | string[]) {
  let where: Where = {}
  if (typeof idImage === 'string') {
    where = {
      id: {
        equals: idImage,
      },
    }
  }

  // array
  if (typeof idImage === 'object') {
    where = {
      or: (idImage as string[]).map((idImg) => {
        return {
          id: {
            equals: idImg,
          },
        }
      }),
    }
  }
  return where
}

// Tạo URL (Base 64) => File
export const dataURLtoFile = (dataURL: string, filename: string) => {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  if (arr.length > 1) {
    const bstr = atob(arr[arr.length - 1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  return false
}
