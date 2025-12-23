/**
 * Download Modal Component
 * Allows users to choose between RAW and JPEG download options
 */
class DownloadModal {
  constructor () {
    this.modalElement = null
    this.resolvePromise = null
  }

  /**
   * Show the modal and return a promise with the user's choice
   * @param {Object} options - Modal configuration
   * @param {boolean} options.isIndividual - true for individual download, false for bulk
   * @returns {Promise<string>} - 'raw', 'jpeg', 'both', or 'cancel'
   */
  show (options = {}) {
    return new Promise((resolve) => {
      this.resolvePromise = resolve
      this.createModal(options)
      this.showModal()
    })
  }

  /**
   * Create the modal HTML and inject it into the DOM
   */
  createModal (options) {
    const isIndividual = options.isIndividual || false

    // Remove existing modal if present
    const existingModal = document.getElementById('download-modal')
    if (existingModal) {
      existingModal.remove()
    }

    // Create modal container
    const modal = document.createElement('dialog')
    modal.id = 'download-modal'
    modal.style.cssText = `
      max-width: 500px;
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-family: arial;
      background-color: rgb(17, 17, 17);
      color: white;
    `

    if (isIndividual) {
      // Individual download modal
      modal.innerHTML = `
        <article style="margin: 0;">
          <header style="padding: 1rem; border-bottom: 1px solid #e0e0e0;">
            <h3 style="margin: 0;">Choose Download Format</h3>
          </header>
          <div style="padding: 1.5rem;">
            <p style="margin-bottom: 1.5rem;">
              This is a RAW image file. Please choose your preferred download format:
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button class="download-option" data-choice="raw" style="text-align: left; padding: 1rem; border: 2px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
                <strong>RAW (Original Quality)</strong><br>
                <small style="color: #666;">Original file format, maximum quality, but less compatible with most devices and software</small>
              </button>
              <button class="download-option" data-choice="jpeg" style="text-align: left; padding: 1rem; border: 2px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
                <strong>JPEG (Preview Quality)</strong><br>
                <small style="color: #666;">Standard format, good quality, compatible with all devices and software</small>
              </button>
            </div>
          </div>
          <footer style="padding: 1rem; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end;">
            <button class="download-cancel" style="background: #f0f0f0; color: #333; border-radius: 7px; width: 100%; height: 40px;">Cancel</button>
          </footer>
        </article>
      `
    } else {
      // Bulk download modal
      modal.innerHTML = `
        <article style="margin: 0;">
          <header style="padding: 1rem; border-bottom: 1px solid #e0e0e0;">
            <h3 style="margin: 0;">Choose Download Contents</h3>
          </header>
          <div style="padding: 1.5rem;">
            <p style="margin-bottom: 1.5rem;">
              This gallery contains RAW image files. What would you like to include in the download?
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button class="download-option" data-choice="both" style="text-align: left; padding: 1rem; border: 2px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
                <strong>Both RAW and JPEG</strong><br>
                <small style="color: #666;">Include both original RAW files and JPEG previews for maximum flexibility</small>
              </button>
              <button class="download-option" data-choice="jpeg" style="text-align: left; padding: 1rem; border: 2px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
                <strong>JPEG Previews Only</strong><br>
                <small style="color: #666;">Smaller download, standard format, compatible with all devices</small>
              </button>
              <button class="download-option" data-choice="raw" style="text-align: left; padding: 1rem; border: 2px solid #ccc; border-radius: 4px; background: white; cursor: pointer;">
                <strong>RAW Files Only</strong><br>
                <small style="color: #666;">Original quality only, requires RAW-compatible software</small>
              </button>
            </div>
          </div>
          <footer style="padding: 1rem; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end;">
            <button class="download-cancel" style="background: #f0f0f0; color: #333; border-radius: 7px; width: 100%; height: 40px;">Cancel</button>
          </footer>
        </article>
      `
    }

    document.body.appendChild(modal)
    this.modalElement = modal

    // Add event listeners
    const optionButtons = modal.querySelectorAll('.download-option')
    optionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const choice = e.currentTarget.getAttribute('data-choice')
        this.close(choice)
      })
      // Hover effect
      button.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.borderColor = '#007bff'
        e.currentTarget.style.background = '#f8f9fa'
      })
      button.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.borderColor = '#ccc'
        e.currentTarget.style.background = 'white'
      })
    })

    const cancelButton = modal.querySelector('.download-cancel')
    cancelButton.addEventListener('click', () => {
      this.close('cancel')
    })

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close('cancel')
      }
    })

    // Close on Escape key
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close('cancel')
      }
    })
  }

  /**
   * Show the modal
   */
  showModal () {
    if (this.modalElement) {
      this.modalElement.showModal()
    }
  }

  /**
   * Close the modal and resolve the promise
   */
  close (choice) {
    if (this.modalElement) {
      this.modalElement.close()
      this.modalElement.remove()
      this.modalElement = null
    }
    if (this.resolvePromise) {
      this.resolvePromise(choice)
      this.resolvePromise = null
    }
  }
}
