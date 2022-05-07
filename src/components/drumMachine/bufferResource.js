import * as Tone from "tone";

// export const bufferResource = unstable_createResource(
//   (url) =>
//     new Promise((resolve) => {
//       const buffer = new Tone.Player(url, () => {
//         resolve(buffer);
//       }).toDestination();
//     })
// );

export const bufferResource = (url) =>
  new Promise((resolve) => {
    const buffer = new Tone.Player(url, () => {
      resolve(buffer);
    }).toDestination();
  });
