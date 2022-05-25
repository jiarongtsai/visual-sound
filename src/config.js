export const sequenceConfig = {
  steps: 16,
  meterPerMeasure: 4, //一小節分成幾拍
  instruments: 27,
  lineMap: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  //fixme
  sequenceState: Array(27)
    .fill(null)
    .map((_) => Array(16).fill(false)),
  //fixme
  initialVisualEffectState: initialVisualEffect(
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    false
  ),
};

function initialVisualEffect(arr, fill) {
  const obj = {};
  arr.forEach((key) => (obj[key] = fill));
  return obj;
}
