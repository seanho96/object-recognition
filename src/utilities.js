// eslint-disable-next-line
export const drawRect = (detections, ctx) => {
  // Loop through each prediction
  detections.forEach((prediction) => {
    // Extract boxes and classes
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];
    const accuracy = prediction["score"];

    // Set styling
    const color = "#51ff0d";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.font = "36px Arial";

    // Draw rectangles and text
    ctx.beginPath();
    ctx.fillText(`${Math.floor(accuracy * 100)}%`, x, y - 10);
    ctx.fillText(text, x + 85, y - 10);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
};
