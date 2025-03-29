const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const imagePreview = document.getElementById('imagePreview');
const convertBtn = document.getElementById('convertBtn');
const resultPreview = document.getElementById('resultPreview');

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

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    const formData = new FormData();
    formData.append('image', file);

    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({ image: file })   
    };

    try {
        const response = await fetch('https://api.getimg.ai/v1/latent-consistency/image-to-image', options);
        const result = await response.json();
        if (result.output_url) {
            resultPreview.innerHTML = `<img src="${result.output_url}" alt="Converted Image">`;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error converting image. Please try again.');
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to Ghibli Style';
    }
});
