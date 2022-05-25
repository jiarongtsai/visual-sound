export const sequenceConfig = {
  steps: 16,
  meterPerMeasure: 4, //一小節分成幾拍
  instruments: 27,
  lineMap: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  getSequenceState() {
    return Array(this.instruments)
      .fill(null)
      .map((_) => Array(this.steps).fill(false));
  },
  getVisualEffectState() {
    return this.generateObjectFromArrayWithDefaultValue(this.lineMap, false);
  },
  generateObjectFromArrayWithDefaultValue(array, defaultValue) {
    const obj = {};
    array.forEach((key) => (obj[key] = defaultValue));
    return obj;
  },
};
