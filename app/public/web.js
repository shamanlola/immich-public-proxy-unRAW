// How many thumbnails to load per "page" fetched from Immich
const PER_PAGE = 50

class LGallery {
  items
  lightGallery
  element
  index = PER_PAGE

  /**
   * Create a lightGallery instance and populate it with the first page of gallery items
   */
  init (params = {}) {
    // Create the lightGallery instance
    this.element = document.getElementById('lightgallery')
    this.lightGallery = lightGallery(this.element, Object.assign({
      plugins: [lgZoom, lgThumbnail, lgVideo, lgFullscreen],
      speed: 500,
      /*
      This license key was graciously provided by LightGallery under their
      GPLv3 open-source project license:
      */
      licenseKey: '8FFA6495-676C4D30-8BFC54B6-4D0A6CEC'
      /*
      Please do not take it and use it for other projects, as it was provided
      specifically for Immich Public Proxy.

      For your own projects you can use the default license key of
      0000-0000-000-0000 as per their docs:

      https://www.lightgalleryjs.com/docs/settings/#licenseKey
      */
    }, params.lgConfig))
    this.items = params.items

    // Set up RAW download interception for individual images
    this.setupDownloadInterception()

    let timeout
    window.addEventListener('scroll', () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(lgallery.handleScroll, 100)
    })
    lgallery.handleScroll()
  }

  /**
   * Replace download button for RAW files with custom modal-triggered button
   */
  setupDownloadInterception () {
    console.log('setupDownloadInterception called')

    // RAW file extensions to detect
    const RAW_EXTENSIONS = [
      '.dng', '.arw', '.cr2', '.cr3', '.nef', '.nrw',
      '.raf', '.orf', '.rw2', '.pef', '.sr2', '.x3f',
      '.dcr', '.kdc', '.erf', '.mrw', '.3fr', '.mef',
      '.mos', '.iiq', '.r3d', '.raw', '.srw'
    ]

    // Function to check if filename is RAW
    const isRawFile = (filename) => {
      if (!filename) return false
      const ext = filename.toLowerCase().match(/\.\w+$/)?.[0]
      return RAW_EXTENSIONS.includes(ext)
    }

    // Function to replace download button for RAW files
    const replaceDownloadButton = () => {
      const downloadBtn = document.querySelector('.lg-download')

      if (!downloadBtn) {
        console.log('No download button found')
        return
      }

      if (downloadBtn.dataset.rawReplaced) {
        console.log('Button already replaced')
        return
      }

      const filename = downloadBtn.getAttribute('download')
      console.log('Download button found, filename:', filename)

      if (!isRawFile(filename)) {
        console.log('Not a RAW file, skipping')
        return
      }

      console.log('✓ Replacing download button for RAW file:', filename)

      // Mark as replaced to avoid duplicate processing
      downloadBtn.dataset.rawReplaced = 'true'

      // Remove the href and download attributes to prevent auto-download
      const originalHref = downloadBtn.getAttribute('href')
      downloadBtn.removeAttribute('href')
      downloadBtn.removeAttribute('download')
      downloadBtn.style.cursor = 'pointer'

      // Add click handler for modal
      downloadBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        e.stopPropagation()

        console.log('✓ RAW download button clicked')

        const modal = new DownloadModal()
        const choice = await modal.show({ isIndividual: true })

        console.log('✓ User chose:', choice)

        if (choice === 'raw') {
          // Download original RAW
          window.location.href = originalHref
        } else if (choice === 'jpeg') {
          // Download JPEG preview
          const jpegUrl = originalHref.replace('/original', '/preview')
          const jpegFilename = filename.replace(/\.\w+$/, '.jpg')

          const link = document.createElement('a')
          link.href = jpegUrl
          link.download = jpegFilename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      })
    }

    // Poll for the button every 250ms
    setInterval(replaceDownloadButton, 250)

    // Also try immediately
    setTimeout(replaceDownloadButton, 100)
    setTimeout(replaceDownloadButton, 500)
    setTimeout(replaceDownloadButton, 1000)
  }

  /**
   * Listen for scroll events and load more gallery items
   */
  handleScroll () {
    const rect = lgallery.element.getBoundingClientRect()
    const scrollPosition = Math.max(0, rect.bottom - window.innerHeight)
    const buffer = 200 // pixels before bottom to trigger load

    if (scrollPosition <= buffer) {
      lgallery.loadMoreItems()
    }
  }

  /**
   * Load more gallery items as per lightGallery docs
   * https://www.lightgalleryjs.com/demos/infinite-scrolling/
   */
  loadMoreItems () {
    if (this.index < this.items.length) {
      // Append new thumbnails
      this.items
        .slice(this.index, this.index + PER_PAGE)
        .forEach(item => {
          this.element.insertAdjacentHTML('beforeend', item.html + '\n')
        })
      this.index += PER_PAGE
      this.lightGallery.refresh()
    } else {
      // Remove the loading spinner once all items are loaded
      document.getElementById('loading-spinner')?.remove()
    }
  }
}
const lgallery = new LGallery()
