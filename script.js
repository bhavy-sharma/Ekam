const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('dropZone');
        const imagePreview = document.getElementById('imagePreview');
        const convertBtn = document.getElementById('convertBtn');

        // Handle file selection
        fileInput.addEventListener('change', handleFileSelect);
        
        // Handle drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#45a049';
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#4CAF50';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = '#4CAF50';
            const files = e.dataTransfer.files;
            if (files.length) {
                fileInput.files = files;
                handleFileSelect();
            }
        });

        function handleFileSelect() {
            const file = fileInput.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    convertBtn.disabled = false;
                }
                reader.readAsDataURL(file);
            }
        }

        // Handle conversion button click
        convertBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            try {
            // Show loading state
            convertBtn.disabled = true;
            convertBtn.textContent = 'Converting...';

            // First convert the file to base64
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });

            const response = await fetch('https://waifu2x.udp.jp/api', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                image: base64Image,
                style: 'anime',
                noise: 1,
                scale: 2
                })
            });

            const result = await response.json();
            
            // Display the converted image
            if (result.url) {
                imagePreview.innerHTML = `<img src="${result.url}" alt="Converted Image">`;
            }
            } catch (error) {
            console.error('Error:', error);
            alert('Error converting image. Please try again.');
            } finally {
            // Reset button state
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert';
            }
        });