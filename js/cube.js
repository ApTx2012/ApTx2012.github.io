document.addEventListener("DOMContentLoaded", () => {
  const cube = document.createElement("div");
  cube.id = "magic-cube";

  const faces = [
    "front",
    "back",
    "left",
    "right",
    "top",
    "bottom"
  ];

  faces.forEach(face => {
    const div = document.createElement("div");
    div.className = face;
    cube.appendChild(div);
  });

  document.body.appendChild(cube);
});