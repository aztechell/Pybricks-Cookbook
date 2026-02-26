function initArcDemos() {
  const demos = document.querySelectorAll("[data-arc-demo]");

  demos.forEach((demo) => {
    const radiusInputs = demo.querySelectorAll('input[name="arc-demo-radius"]');
    const motionInputs = demo.querySelectorAll('input[name="arc-demo-motion"]');

    const circle = demo.querySelector("[data-arc-demo-circle]");
    const radiusLine = demo.querySelector("[data-arc-demo-radius-line]");
    const centerDot = demo.querySelector("[data-arc-demo-center-dot]");
    const centerLabel = demo.querySelector("[data-arc-demo-center-label]");
    const path = demo.querySelector("[data-arc-demo-path]");
    const callCode = demo.querySelector("[data-arc-demo-call]");
    const currentText = demo.querySelector("[data-arc-demo-text]");

    if (!circle || !radiusLine || !centerDot || !centerLabel || !path || !callCode || !currentText) {
      return;
    }

    const geometry = {
      right: {
        centerX: 270,
        centerY: 130,
        labelX: 286,
        labelY: 126,
        paths: {
          forward: "M180 130 A90 90 0 0 1 270 40",
          backward: "M180 130 A90 90 0 0 0 270 220",
        },
        label: "центр справа",
        radiusValue: 120,
      },
      left: {
        centerX: 90,
        centerY: 130,
        labelX: 106,
        labelY: 126,
        paths: {
          forward: "M180 130 A90 90 0 0 0 90 40",
          backward: "M180 130 A90 90 0 0 1 90 220",
        },
        label: "центр слева",
        radiusValue: -120,
      },
    };

    const motionStyles = {
      forward: {
        stroke: "#198754",
        strokeWidth: "6",
        dasharray: "",
        marker: "url(#arc-demo-arrow-fwd)",
        label: "едет вперед по дуге",
        angleValue: 90,
      },
      backward: {
        stroke: "#b26a00",
        strokeWidth: "5",
        dasharray: "9 7",
        marker: "url(#arc-demo-arrow-back)",
        label: "едет назад по дуге",
        angleValue: -90,
      },
    };

    function getCheckedValue(inputs) {
      const checked = Array.from(inputs).find((input) => input.checked);
      return checked ? checked.value : null;
    }

    function render() {
      const side = getCheckedValue(radiusInputs) || "right";
      const motion = getCheckedValue(motionInputs) || "forward";

      const sideData = geometry[side];
      const motionData = motionStyles[motion];

      circle.setAttribute("cx", String(sideData.centerX));
      circle.setAttribute("cy", String(sideData.centerY));

      radiusLine.setAttribute("x1", "180");
      radiusLine.setAttribute("y1", "130");
      radiusLine.setAttribute("x2", String(sideData.centerX));
      radiusLine.setAttribute("y2", String(sideData.centerY));

      centerDot.setAttribute("cx", String(sideData.centerX));
      centerDot.setAttribute("cy", String(sideData.centerY));

      centerLabel.setAttribute("x", String(sideData.labelX));
      centerLabel.setAttribute("y", String(sideData.labelY));

      path.setAttribute("d", sideData.paths[motion]);
      path.setAttribute("stroke", motionData.stroke);
      path.setAttribute("stroke-width", motionData.strokeWidth);
      path.setAttribute("marker-end", motionData.marker);
      if (motionData.dasharray) {
        path.setAttribute("stroke-dasharray", motionData.dasharray);
      } else {
        path.removeAttribute("stroke-dasharray");
      }

      callCode.textContent = `drive_base.arc(${sideData.radiusValue}, angle=${motionData.angleValue})`;
      currentText.textContent = `${sideData.label}, ${motionData.label}`;
    }

    radiusInputs.forEach((input) => input.addEventListener("change", render));
    motionInputs.forEach((input) => input.addEventListener("change", render));

    render();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initArcDemos);
} else {
  initArcDemos();
}
