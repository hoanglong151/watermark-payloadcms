import { Config } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

export const defaultLexical: Config['editor'] = lexicalEditor({
  features: () => {
    return [ParagraphFeature(), UnderlineFeature(), BoldFeature(), ItalicFeature()]
  },
})
