import { removeBackground } from 'https://esm.sh/@imgly/background-removal@1.5.5';

const fileInput = document.querySelector('#file');
const dropzone = document.querySelector('#dropzone');
const statusEl = document.querySelector('#status');
const editor = document.querySelector('#editor');
const resultImg = document.querySelector('#result');
const preview = document.querySelector('#preview');
const downloadBtn = document.querySelector('#download');
const resetBtn = document.querySelector('#reset');
let originalUrl = null, resultUrl = null, resultBlob = null, activeView = 'result';

function status(message) { statusEl.textContent = message; }
function clearUrls() {
  if (originalUrl) URL.revokeObjectURL(originalUrl);
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  originalUrl = resultUrl = null;
}
async function processFile(file) {
  if (!file) return;
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) return status('Please choose a PNG, JPG, or WEBP image.');
  if (file.size > 15 * 1024 * 1024) return status('This image is larger than 15 MB. Please choose a smaller one.');
  clearUrls(); resultBlob = null; downloadBtn.disabled = true;
  originalUrl = URL.createObjectURL(file);
  resultImg.src = originalUrl; editor.hidden = false; activeView = 'result';
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.view === 'result'));
  preview.style.background = 'transparent';
  status('Loading the AI model and removing the background… The first run may take a little longer.');
  try {
    const blob = await removeBackground(file, {
      model: 'medium',
      output: { format: 'image/png', quality: 0.9 },
      progress: (key, current, total) => {
        if (total) status(`Processing: ${Math.round(current / total * 100)}%`);
      }
    });
    resultBlob = blob; resultUrl = URL.createObjectURL(blob);
    resultImg.src = resultUrl; downloadBtn.disabled = false;
    status('Background removed! Your transparent PNG is ready.');
  } catch (err) {
    console.error(err);
    status('Could not process this image. Check your internet connection and try again.');
  }
}
fileInput.addEventListener('change', e => processFile(e.target.files[0]));
['dragenter','dragover'].forEach(type => dropzone.addEventListener(type, e => {e.preventDefault();dropzone.classList.add('drag');}));
['dragleave','drop'].forEach(type => dropzone.addEventListener(type, e => {e.preventDefault();dropzone.classList.remove('drag');}));
dropzone.addEventListener('drop', e => processFile(e.dataTransfer.files[0]));
document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  activeView = btn.dataset.view;
  resultImg.src = activeView === 'original' ? originalUrl : (resultUrl || originalUrl);
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
}));
document.querySelectorAll('.swatch').forEach(btn => btn.addEventListener('click', () => {
  preview.style.background = btn.dataset.color === 'transparent' ? 'transparent' : btn.dataset.color;
  document.querySelectorAll('.swatch').forEach(b => b.classList.toggle('selected', b === btn));
}));
document.querySelector('#customColor').addEventListener('input', e => {
  preview.style.background = e.target.value;
  document.querySelectorAll('.swatch').forEach(b => b.classList.remove('selected'));
});
downloadBtn.addEventListener('click', () => {
  if (!resultBlob) return;
  const a = document.createElement('a'); a.href = resultUrl; a.download = 'morsalin-bg-removed.png'; a.click();
});
resetBtn.addEventListener('click', () => {
  clearUrls(); resultBlob = null; fileInput.value = ''; editor.hidden = true; downloadBtn.disabled = true;
  status('Choose an image to get started.');
});
