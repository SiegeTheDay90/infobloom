import WordCloud from 'wordcloud';

/**
 * Attach a word cloud to a canvas using wordcloud.js
 * @param {HTMLCanvasElement} canvasEl - The target canvas element
 * @param {Array<[string, number]>} dataList - Array of [word, count] tuples
 */
export function attachWordCloud(canvasEl, dataList) {
  if (!canvasEl || !Array.isArray(dataList) || dataList.length === 0) {
    console.warn("attachWordCloud: Invalid canvas or data list.");
    return;
  }
  // debugger;

  dataList = groupByCount(dataList);
  return new WordCloud(canvasEl, {
    list: dataList,
    gridSize: Math.round(16 * canvasEl.width / 1024),
    weightFactor: size => Math.pow(size, 1.5),
    fontFamily: 'Impact, Arial, sans-serif',
    color: () => `hsl(${Math.random() * 360}, 70%, 50%)`,
    backgroundColor: '#ffffff',
    rotateRatio: 0.4,
    rotationSteps: 2,
    shuffle: true
  });
}

function groupByCount(wordList) {
  let counts = {};
    wordList.forEach((word) => {
        if (counts[word]) {
          counts[word] += 1;
        } else {
          counts[word] = 1;
        }
    })

    return Object.entries(counts);
}