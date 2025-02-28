/* eslint-disable @next/next/no-img-element */
import React from 'react'

type RenderImageProps = {
  srcImgWatermark: string
  id: string
}

const RenderImage = ({ srcImgWatermark, id }: RenderImageProps) => {
  return (
    <div className="flex items-center justify-center thumbnail thumbnail--size-medium file-details__thumbnail">
      {srcImgWatermark && (
        <div className="relative flex items-center justify-center h-[115px]">
          <img
            id={`watermark-img-${id}`}
            src={srcImgWatermark}
            alt={`watermark-img-${id}`}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default RenderImage
