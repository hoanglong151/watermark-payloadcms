'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { PaginatedDocs } from 'payload'
// Type
import { PositionProps, PreviewImgProps, SettingImgWatermarkProps } from './type'
import { Media, Watermark } from '../../payload-types'
// Component
import { toast, useAllFormFields, useDocumentInfo, useField } from '@payloadcms/ui'
import { Label } from '../../components/ui/label'
import RenderImage from './render-image'
import Setting from './setting'
// Action
import { getListWatermark, getOriginImgById } from './action'
// Utils
import { Loader2, X } from 'lucide-react'
import { LIST_POSITION, LOAD_CONTENT } from '../../utilities/constants'
import { getClientSideURL, getServerSideURL } from '../../utilities/getURL'
import { calculateNewSize, calculatePosition, dataURLtoFile } from './utils'
// Styles
import './styles.css'

const defaultValuePreviewImg = {
  id: `${new Date().getTime()}`,
  src: '',
  srcWatermark: '',
  position: LIST_POSITION[1],
  globalAlpha: 1,
  indexImgWatermark: -1,
  newHeightImgWatermark: 0,
  newWidthImgWatermark: 0,
  originHeightImgWatermark: 0,
  originWidthImgWatermark: 0,
  altWatermark: '',
  captionWatermark: '',
  fileOrigin: null,
  fileWatermark: null,
  isAutoResize: true,
}

const WatermarkField = ({ field, path }) => {
  const { label } = field
  const timerId = useRef<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isEdit, setIsEdit] = useState(true)
  const [previewImg, setPreviewImg] = useState<PreviewImgProps>(defaultValuePreviewImg)
  const [listWatermark, setListWatermark] = useState<Media[]>([])

  // Lấy state của các fields trong form
  const [fields] = useAllFormFields()
  // Lấy id của Image
  const { id = '' } = useDocumentInfo()
  // Giá trị field watermark
  const { value, setValue } = useField({ path: path })

  // Get danh sách watermark
  const handleGetWatermark = async () => {
    try {
      const list = (await getListWatermark()) as PaginatedDocs<Watermark>
      return setListWatermark(list?.docs as Media[])
    } catch (_) {
      return toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  const handleSetPreviewImgNew = (previewImg: PreviewImgProps) => {
    setPreviewImg(previewImg)
  }

  const handleSetPreviewImg = async (id: string) => {
    setIsLoading(true)
    try {
      const img = (await getOriginImgById(id)) as Media
      const imgWatermark = img.watermark as Media | null
      let caption = ''
      if (!!imgWatermark?.caption?.root?.children?.length) {
        if (!!imgWatermark?.caption?.root?.children[0].children) {
          caption = imgWatermark?.caption?.root?.children[0].children[0]?.text
        }
      }

      handleSetPreviewImgNew({
        ...previewImg,
        id: img.id,
        src: img.url || '',
        srcWatermark: imgWatermark?.url || img.url || '',
        altWatermark: imgWatermark?.alt || '',
        captionWatermark: caption,
        fileOrigin: img,
        fileWatermark: imgWatermark || img,
      })

      return img
    } catch (_) {
      const src = URL.createObjectURL(fields.file?.value as File)
      handleSetPreviewImgNew({
        ...previewImg,
        src: src,
        srcWatermark: src,
        fileOrigin: fields.file?.value as Media,
        fileWatermark: fields.file?.value as Media,
      })
      return { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPreviewImgWatermark = async (id: string) => {
    setIsLoading(true)
    try {
      const img = (await getOriginImgById(id)) as Media
      let caption = ''
      if (!!img.caption?.root?.children?.length) {
        if (!!img.caption?.root?.children[0].children) {
          caption = img?.caption?.root?.children[0].children[0]?.text
        }
      }

      handleSetPreviewImgNew({
        ...previewImg,
        id: img.id,
        srcWatermark: img.url || '',
        altWatermark: img.alt || '',
        captionWatermark: caption,
        fileWatermark: img,
      })

      return img
    } catch (_) {
      const src = URL.createObjectURL(fields.file?.value as File)
      handleSetPreviewImgNew({
        ...previewImg,
        src: src,
        srcWatermark: src,
        fileOrigin: fields.file?.value as Media,
        fileWatermark: fields.file?.value as Media,
      })
      return { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }
    } finally {
      setIsLoading(false)
    }
  }

  // Case 1: Có file watermark local nhưng chưa tạo watermark
  // Case 2: Đã tạo watermark
  // Case 3: Có file watermark local và đã tạo watermark
  useEffect(() => {
    handleGetWatermark()
    if (!!fields.file?.value && !value) {
      const src = URL.createObjectURL(fields.file?.value as File)
      return handleSetPreviewImgNew({
        ...previewImg,
        src: src,
        srcWatermark: src,
        fileOrigin: fields.file?.value as Media,
        fileWatermark: fields.file?.value as Media,
      })
    }
    if (id) {
      handleSetPreviewImg(`${id}`)
      return setIsEdit(false)
    }
    if (value) {
      const src = URL.createObjectURL(fields.file?.value as File)
      handleSetPreviewImgNew({
        ...previewImg,
        src: src,
        srcWatermark: src,
        fileOrigin: fields.file?.value as Media,
        fileWatermark: fields.file?.value as Media,
      })
      handleSetPreviewImgWatermark(value as string)
      return setIsEdit(false)
    }
  }, [id, fields.file?.value])

  // Render hình có watermark
  const handleAddWatermark = async (
    previewImg: PreviewImgProps,
    indexImgWatermark: number, // Số thứ tự img watermark trong list
    globalAlpha: number = 1,
    position: PositionProps = LIST_POSITION[1],
    newWidth?: number,
    newHeight?: number,
    alt?: string,
    caption?: string,
    isAutoResize: boolean = true,
  ) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = previewImg.src
    img.crossOrigin = 'anonymous'

    if (!!ctx) {
      img.onload = () => {
        // Vẽ hình ảnh gốc vào canvas
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Vẽ watermark (hình ảnh) lên canvas
        const watermarkImg = new Image()
        watermarkImg.src = `${getServerSideURL()}/${listWatermark[indexImgWatermark]?.url}`
        watermarkImg.crossOrigin = 'anonymous'

        watermarkImg.onload = () => {
          let newWatermarkWidth = watermarkImg.width
          let newWatermarkHeight = watermarkImg.height
          if (canvas.width < watermarkImg.width && !!isAutoResize) {
            const { newWidth, newHeight } = calculateNewSize(
              newWatermarkWidth,
              newWatermarkHeight,
              canvas.width,
              undefined,
            )
            newWatermarkWidth = newWidth as number
            newWatermarkHeight = newHeight as number
          }
          const watermarkWidth = newWidth ? newWidth : newWatermarkWidth * 0.3 // Điều chỉnh kích thước watermark (30% kích thước gốc)
          const watermarkHeight = newHeight ? newHeight : newWatermarkHeight * 0.3 // Điều chỉnh kích thước watermark (30% kích thước gốc)

          // Vị trí watermark ở góc dưới phải
          const { xWatermark, yWatermark } = calculatePosition(
            position,
            canvas.width,
            canvas.height,
            watermarkWidth,
            watermarkHeight,
          )
          const x = xWatermark
          const y = yWatermark

          ctx.globalAlpha = globalAlpha // Độ trong suốt của watermark (opacity)
          ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight)

          // Tạo URL mới cho ảnh đã được thêm watermark
          const watermarkedImageUrl = canvas.toDataURL('image/png')

          const newData = {
            ...previewImg,
            srcWatermark: watermarkedImageUrl,
            indexImgWatermark: indexImgWatermark,
            globalAlpha: globalAlpha,
            position: position,
            originWidthImgWatermark: watermarkImg.width,
            originHeightImgWatermark: watermarkImg.height,
            newWidthImgWatermark: watermarkWidth,
            newHeightImgWatermark: watermarkHeight,
            altWatermark: alt || '',
            captionWatermark: caption || '',
            isAutoResize: isAutoResize,
          }

          handleSetPreviewImgNew(newData)

          canvas.remove()
          img.remove()
          watermarkImg.remove()
        }
      }
    }
  }

  // Setting hình (có setTimeout để đỡ spam dẫn đến lag)
  const handleSetting = (previewImg: PreviewImgProps, setting: SettingImgWatermarkProps) => {
    if (!!timerId.current) {
      clearTimeout(timerId.current)
      timerId.current = null
    }

    timerId.current = setTimeout(() => {
      handleAddWatermark(
        previewImg,
        previewImg.indexImgWatermark,
        setting.globalAlpha,
        setting.position,
        setting.width,
        setting.height,
        setting.altWatermark,
        setting.captionWatermark,
        setting.isAutoResize,
      )
    }, 350)
  }

  // Submit watermark
  const handleSubmit = async () => {
    setIsLoadingSubmit(true)
    try {
      if (!!previewImg) {
        const formData = new FormData()
        const filename =
          (previewImg.fileOrigin as Media & { name: string })?.name ||
          previewImg.fileOrigin?.filename
        const convertFile = dataURLtoFile(
          previewImg.srcWatermark,
          `${filename?.split('.')[0]}-watermark`,
        )

        if (!!convertFile) {
          formData.append(`file`, convertFile)
          formData.append(
            `_payload`,
            JSON.stringify({
              alt: previewImg.altWatermark,
              caption: LOAD_CONTENT(previewImg.captionWatermark),
            }),
          )
          const response: Media = await fetch(`${getClientSideURL()}/api/media`, {
            method: 'POST',
            body: formData,
          }).then(async (res) => {
            const data = await res.json()
            return data.doc
          })
          let caption = ''
          if (!!response.caption?.root?.children?.length) {
            if (!!response.caption?.root?.children[0].children) {
              caption = response.caption?.root?.children[0].children[0]?.text
            }
          }

          handleSetPreviewImgNew({
            ...previewImg,
            id: response.id,
            srcWatermark: response.url || '',
            altWatermark: response.alt || '',
            captionWatermark: caption,
            fileWatermark: response,
            isAutoResize: true,
          })
          setValue(response.id)
          setIsEdit(false)
          toast.success('Cập nhật watermark thành công')
          return response
        }
      }
    } catch (_) {
      return { error: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.' }
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  const handleRemovePreviewImg = () => {
    if (value) {
      handleSetPreviewImgWatermark(value as string)
      setIsEdit(false)
    }
  }

  return (
    <div className="field-type flex-1">
      <Label className="field-label text-[13px] leading-[20px]">{label}</Label>
      {isLoading ? (
        <p>Loading...</p>
      ) : previewImg.srcWatermark ? (
        <div className="flex items-start file-details flex-col xl:flex-row">
          <RenderImage srcImgWatermark={previewImg.srcWatermark} id={previewImg.id} />

          {isEdit ? (
            <Fragment>
              <Setting
                listImgWatermark={listWatermark}
                previewImg={previewImg}
                onSetting={handleSetting}
                onAddWatermark={handleAddWatermark}
              />
              <div className="flex items-center gap-6 ml-6 xl:mr-6 -mt-2">
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={isLoadingSubmit}
                  className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup bg-[#dddddd] hover:bg-[#ebebeb] text-black dark:bg-[#4a4a4a] dark:text-white dark:hover:bg-[#3d3d3d]"
                >
                  {isLoadingSubmit ? <Loader2 className="animate-spin mr-2" size={16} /> : <></>}
                  Save
                </button>

                {value ? (
                  <button
                    type="button"
                    className="rounded-full w-[24px] h-[24px] cursor-pointer p-0 border-[0.5px] border-solid border-[#ddd] bg-white dark:border-[#3d3d3d] dark:bg-[#222222] flex items-center justify-center"
                    onClick={() => handleRemovePreviewImg()}
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </Fragment>
          ) : (
            <button
              onClick={() => {
                handleSetPreviewImgNew({
                  ...previewImg,
                  srcWatermark: previewImg.src,
                  fileWatermark: previewImg.fileOrigin as Media,
                })
                setIsEdit(true)
              }}
              type="button"
              className="border-none cursor-pointer py-2 px-3 rounded-md ml-[24px] my-auto bg-[#dddddd] hover:bg-[#ebebeb] dark:bg-[rgba(60,60,60)] dark:hover:bg-[rgb(47,47,47)]"
            >
              Chỉnh sửa watermark
            </button>
          )}
        </div>
      ) : (
        <p>Vui lòng chọn hình ảnh</p>
      )}
    </div>
  )
}

export default WatermarkField
