"use client";

import { useEffect } from "react";
import { useRive, useViewModel, useViewModelInstance, useViewModelInstanceNumber } from "@rive-app/react-webgl2";
import { Fit, Alignment, Layout } from "@rive-app/webgl2";

export default function RiveCharacter({ className = "", mouseX, mouseY }: { className?: string; mouseX: number; mouseY: number }) {
  const { rive, RiveComponent } = useRive({
    src: "/animations/look-login.riv",
    artboard: "Main",
    stateMachines: ["State Machine 1"],
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.Center }),
  });

  const viewModel = useViewModel(rive, { name: "GazeControl" });
  const viewModelInstance = useViewModelInstance(viewModel, { rive });
  const xAxis = useViewModelInstanceNumber("xAxis", viewModelInstance);
  const yAxis = useViewModelInstanceNumber("yAxis", viewModelInstance);

  useEffect(() => {
    if (xAxis.value !== null) xAxis.setValue(mouseX);
    if (yAxis.value !== null) yAxis.setValue(mouseY);
  }, [mouseX, mouseY, xAxis, yAxis]);

  return (
    <div className={`relative ${className}`}>
      {!rive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-black/5" />
        </div>
      )}
      <RiveComponent className="h-full w-full" aria-label="A character that follows your cursor" />
    </div>
  );
}
