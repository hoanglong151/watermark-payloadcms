import React, { useEffect, useState } from 'react'
// Type
import {
  PositionProps,
  SettingImgWatermarkProps,
  SettingProps,
} from '../../components/Watermark/type'
// Component
import { Separator } from '../../components/ui/separator'
import { Media } from '../../components/Media'
// Utils
import { calculateNewSize } from '../../components/Watermark/utils'
import { LIST_POSITION } from '../../utilities/constants'
import { Link2, Link2Off } from 'lucide-react'

const Setting = ({ listImgWatermark, previewImg, onSetting, onAddWatermark }: SettingProps) => {
  const [settingImgWatermark, setSettingImgWatermark] = useState<SettingImgWatermarkProps>({
    widthOrigin: previewImg.originWidthImgWatermark,
    heightOrigin: previewImg.originHeightImgWatermark,
    width: previewImg.newWidthImgWatermark,
    height: previewImg.newHeightImgWatermark,
    position: previewImg.position,
    globalAlpha: previewImg.globalAlpha,
    isAutoResize: previewImg.isAutoResize,
    altWatermark: previewImg.altWatermark,
    captionWatermark: previewImg.captionWatermark,
  })

  useEffect(() => {
    setSettingImgWatermark((prev) => ({
      ...prev,
      widthOrigin: previewImg.originWidthImgWatermark,
      heightOrigin: previewImg.originHeightImgWatermark,
      width: previewImg.newWidthImgWatermark,
      height: previewImg.newHeightImgWatermark,
      position: previewImg.position,
      globalAlpha: previewImg.globalAlpha,
      isAutoResize: previewImg.isAutoResize,
      altWatermark: previewImg.altWatermark,
      captionWatermark: previewImg.captionWatermark,
    }))
  }, [previewImg])

  const handleSetting = (setting: Partial<SettingImgWatermarkProps>) => {
    setSettingImgWatermark((prev) => {
      const newData: SettingImgWatermarkProps = {
        ...prev,
        ...setting,
      }
      onSetting(previewImg, newData)
      return newData
    })
  }

  const handleChangeAlt = (value: string) => {
    handleSetting({ altWatermark: value })
  }

  const handleChangeCaption = (value: string) => {
    handleSetting({ captionWatermark: value })
  }

  const handleChangeWidth = (value: number) => {
    const { newWidth, newHeight } = calculateNewSize(
      settingImgWatermark.widthOrigin,
      settingImgWatermark.heightOrigin,
      value,
      undefined,
    )

    handleSetting({
      width: settingImgWatermark.isAutoResize ? (newWidth as number) : value,
      height: settingImgWatermark.isAutoResize ? (newHeight as number) : settingImgWatermark.height,
    })
  }

  const handleChangeHeight = (value: number) => {
    const { newWidth, newHeight } = calculateNewSize(
      settingImgWatermark.widthOrigin,
      settingImgWatermark.heightOrigin,
      undefined,
      value,
    )

    handleSetting({
      width: settingImgWatermark.isAutoResize ? (newWidth as number) : settingImgWatermark.width,
      height: settingImgWatermark.isAutoResize ? (newHeight as number) : value,
    })
  }

  const handleIsAutoResize = (isResize) => {
    handleSetting({
      isAutoResize: isResize,
    })
  }

  const handleChangePosition = (value: PositionProps) => {
    handleSetting({
      position: value,
    })
  }

  const handleChangeGlobalAlpha = (value: number) => {
    handleSetting({
      globalAlpha: value,
    })
  }

  return (
    <div className="flex gap-4 py-[11px] px-[24px] flex-1 flex-col xl:flex-row">
      <div className="grid grid-cols-3 w-28 h-28 rounded-lg overflow-hidden shrink-0">
        {LIST_POSITION.map((position) => {
          return (
            <div
              key={position}
              className={`flex items-center justify-center transition-all cursor-pointer border ${
                position === settingImgWatermark.position
                  ? 'bg-[#c5c5c5] dark:bg-[#070707]'
                  : 'bg-[#e1e1e1] dark:bg-[#171717]'
              }`}
              onClick={() => handleChangePosition(position)}
            >
              •
            </div>
          )
        })}
      </div>
      <Separator orientation="vertical" className="bg-[#e1e1e1] dark:bg-[rgb(43,43,43)] h-auto" />
      <div className="flex items-start gap-x-3">
        <div className="flex items-center gap-x-3">
          <div className="field-type text">
            <label className="field-label" htmlFor="field-alt">
              Width
            </label>
            <div className="field-type__wrap">
              <input
                id="field-alt"
                data-rtl="false"
                type="text"
                value={settingImgWatermark.width}
                onChange={(event) => handleChangeWidth(parseFloat(event.target.value))}
              />
            </div>
          </div>

          {previewImg.isAutoResize ? (
            <Link2
              size={20}
              className="shrink-0 text-[rgb(43,43,43)] dark:text-white mt-7"
              onClick={() => handleIsAutoResize(false)}
            />
          ) : (
            <Link2Off
              size={20}
              className="shrink-0 text-[rgb(43,43,43)] dark:text-white mt-7"
              onClick={() => handleIsAutoResize(true)}
            />
          )}

          <div className="field-type text">
            <label className="field-label" htmlFor="field-alt">
              Height
            </label>
            <div className="field-type__wrap">
              <input
                id="field-alt"
                data-rtl="false"
                type="text"
                value={settingImgWatermark.height}
                onChange={(event) => handleChangeHeight(parseFloat(event.target.value))}
              />
            </div>
          </div>

          <div className="field-type text w-36">
            <label className="field-label" htmlFor="field-alt">
              Opacity
            </label>
            <div className="field-type__wrap">
              <input
                id="field-alt"
                data-rtl="false"
                type="number"
                step="0.1"
                value={settingImgWatermark.globalAlpha}
                onChange={(event) => handleChangeGlobalAlpha(parseFloat(event.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="field-type text">
          <label className="field-label" htmlFor="field-alt">
            Alt
          </label>
          <div className="field-type__wrap">
            <input
              id="field-alt"
              data-rtl="false"
              type="text"
              value={settingImgWatermark.altWatermark}
              onChange={(event) => handleChangeAlt(event.target.value)}
            />
          </div>
        </div>

        <div className="field-type text">
          <label className="field-label" htmlFor="field-alt">
            Caption
          </label>
          <div className="field-type__wrap">
            <input
              id="field-alt"
              data-rtl="false"
              type="text"
              value={settingImgWatermark.captionWatermark}
              onChange={(event) => handleChangeCaption(event.target.value)}
            />
          </div>
        </div>
      </div>
      <Separator orientation="vertical" className="bg-[#e1e1e1] dark:bg-[rgb(43,43,43)] h-auto" />
      <div>
        <label className="field-label" htmlFor="field-alt">
          Watermark
        </label>
        <div className="grid grid-cols-5 max-h-[52px] gap-3 overflow-auto">
          {listImgWatermark.map((imgWaterMark, indexImgWatermark) => {
            return (
              <div
                key={indexImgWatermark}
                onClick={() => onAddWatermark(previewImg, indexImgWatermark)}
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg border-[1px] border-solid ${
                    previewImg.indexImgWatermark === indexImgWatermark
                      ? 'border-[#949494]'
                      : 'border-[#cacaca] dark:border-[#222]'
                  }`}
                >
                  <Media
                    alt={`watermark-${indexImgWatermark}`}
                    resource={imgWaterMark}
                    className={`w-full h-full flex items-center justify-center rounded-sm cursor-pointer`}
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Setting
