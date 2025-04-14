export default function CameraConfiguration(itemType: string) {
  switch (itemType) {
    case "Switch":
      return { position: [-1, 1.2, -1], zoom: 80 };
    case "Keyboard":
      return { position: [-1, 1.2, -1], zoom: 10 };
    case "PCB":
      return { position: [0, -70, -50], zoom: 1 };
    case "Plate":
      return { position: [0, 100, 0], zoom: 1 };
    case "Stabilizers":
      return { position: [-25, 25, 20], zoom: 1.5 };

    default:
      return { position: [-1, 1.2, -1], zoom: 20 };
  }
}
