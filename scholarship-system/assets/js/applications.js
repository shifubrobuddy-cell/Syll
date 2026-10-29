/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Document Upload Validation & Application UI
 * File: assets/js/applications.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Setup file dropzones
    document.querySelectorAll('.file-dropzone').forEach(dropzone => {
        const fileInput = document.getElementById(dropzone.dataset.target);
        if (!fileInput) return;

        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const sizeKb = Math.round(file.size / 1024);
                
                // Max 5MB check
                if (file.size > 5 * 1024 * 1024) {
                    alert('File exceeds 5MB size limit.');
                    fileInput.value = '';
                    return;
                }

                // Allowed types check
                const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
                if (!allowed.includes(file.type)) {
                    alert('Only PDF, JPG, and PNG files are accepted.');
                    fileInput.value = '';
                    return;
                }

                dropzone.querySelector('.dropzone-text').textContent = file.name;
                dropzone.querySelector('.dropzone-subtext').textContent = `Ready for upload (${sizeKb} KB)`;
                dropzone.style.borderColor = 'var(--success)';
            }
        });

        // Drag and drop support
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    });
});
