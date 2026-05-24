// Ansiktspar for Vors. Hvert par har et glad og et sint bilde.
// Legg til flere par ved å importere nye bilder i src/assets/faces/.

import face1Happy from "../assets/faces/face1_happy.png";
import face1Angry from "../assets/faces/face1_angry.png";
import face2Happy from "../assets/faces/face2_happy.png";
import face2Angry from "../assets/faces/face2_angry.png";

export const FACE_PAIRS = [
  { id: 1, happy: face1Happy, angry: face1Angry },
  { id: 2, happy: face2Happy, angry: face2Angry },
];

// Bygg et tilfeldig blandet array med ansiktspar for et rutenett.
export function buildFaceGrid(size) {
  return Array.from({ length: size }, () =>
    FACE_PAIRS[Math.floor(Math.random() * FACE_PAIRS.length)]
  );
}
