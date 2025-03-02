import { Media } from '../../payload-types'

export type PositionProps =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type PreviewImgProps = {
  id: string
  src: string
  srcWatermark: string
  position: PositionProps
  globalAlpha: number
  indexImgWatermark: number
  altWatermark: string
  captionWatermark: string
  originWidthImgWatermark: number
  originHeightImgWatermark: number
  newWidthImgWatermark: number
  newHeightImgWatermark: number
  fileOrigin: Media | null
  fileWatermark: Media | null
  isAutoResize: boolean
}

export type SettingProps = {
  listImgWatermark: Media[]
  previewImg: PreviewImgProps
  onSetting: (previewImg: PreviewImgProps, setting: SettingImgWatermarkProps) => void
  onAddWatermark: (
    imgPreview: PreviewImgProps,
    indexImgWatermark: number,
    globalAlpha?: number,
    position?: PositionProps,
    newWidth?: number,
    newHeight?: number,
  ) => Promise<void>
}

export type SettingImgWatermarkProps = {
  widthOrigin: number
  heightOrigin: number
  width: number
  height: number
  position: PositionProps
  globalAlpha: number
  altWatermark: string
  captionWatermark: string
  isAutoResize: boolean
}
