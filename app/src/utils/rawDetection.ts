import { Asset } from '../types'

// Common RAW image MIME types
const RAW_MIME_TYPES = [
  'image/x-adobe-dng',
  'image/dng',
  'image/x-sony-arw',
  'image/x-sony-sr2',
  'image/x-sony-srf',
  'image/x-canon-cr2',
  'image/x-canon-cr3',
  'image/x-canon-crw',
  'image/x-nikon-nef',
  'image/x-nikon-nrw',
  'image/x-fuji-raf',
  'image/x-olympus-orf',
  'image/x-panasonic-raw',
  'image/x-panasonic-rw2',
  'image/x-pentax-pef',
  'image/x-pentax-dng',
  'image/x-sigma-x3f',
  'image/x-kodak-dcr',
  'image/x-kodak-kdc',
  'image/x-epson-erf',
  'image/x-minolta-mrw',
  'image/x-hasselblad-3fr',
  'image/x-mamiya-mef',
  'image/x-phase-one-iiq',
  'image/x-leaf-mos',
  'image/x-red-r3d'
]

// Common RAW file extensions
const RAW_EXTENSIONS = [
  '.dng',  // Adobe Digital Negative
  '.arw',  // Sony
  '.sr2',  // Sony
  '.srf',  // Sony
  '.cr2',  // Canon
  '.cr3',  // Canon
  '.crw',  // Canon
  '.nef',  // Nikon
  '.nrw',  // Nikon
  '.raf',  // Fujifilm
  '.orf',  // Olympus
  '.rw2',  // Panasonic
  '.raw',  // Panasonic/Leica
  '.pef',  // Pentax
  '.srw',  // Samsung
  '.x3f',  // Sigma
  '.dcr',  // Kodak
  '.kdc',  // Kodak
  '.erf',  // Epson
  '.mrw',  // Minolta
  '.3fr',  // Hasselblad
  '.mef',  // Mamiya
  '.mos',  // Leaf
  '.iiq',  // Phase One
  '.r3d'   // RED
]

/**
 * Determines if an asset is a RAW image file
 * @param asset The asset to check
 * @returns true if the asset is a RAW image, false otherwise
 */
export function isRawAsset (asset: Asset): boolean {
  // Check MIME type first
  if (asset.originalMimeType) {
    const mimeType = asset.originalMimeType.toLowerCase()
    if (RAW_MIME_TYPES.includes(mimeType)) {
      return true
    }
  }

  // Check file extension as fallback
  if (asset.originalFileName) {
    const extension = asset.originalFileName.match(/(\.\w+)$/)?.[1]?.toLowerCase()
    if (extension && RAW_EXTENSIONS.includes(extension)) {
      return true
    }
  }

  return false
}
