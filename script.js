document.addEventListener('DOMContentLoaded', () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const colorChangingElement = document.getElementById('color-changing-element');

      function updateColor() {
        analyser.getByteFrequencyData(dataArray);

        // Calculate average frequency
        const averageFrequency = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

        // Map average frequency to hue in the HSL color space
        const hue = Math.floor(averageFrequency / 255 * 360);

        // Update element color
        colorChangingElement.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

        requestAnimationFrame(updateColor);
      }

      updateColor();
    })
    .catch(error => console.error('Error accessing microphone:', error));
});
