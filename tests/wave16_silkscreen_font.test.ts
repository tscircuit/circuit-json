import test from "ava";

interface SilkscreenText {
  text: string;
  fontSize: number; // in mm
  layer: "top" | "bottom";
  minReadableSize: number;
}

const validateSilkscreenText = (element: SilkscreenText): boolean => {
  if (!element.text || element.text.trim().length === 0) return false;
  if (element.fontSize < element.minReadableSize) return false;
  if (element.fontSize > 20.0) return false; // Exceeds standard PCB label limit
  return true;
};

test("Wave 16 Zenith: Silkscreen font size readability bounds", (t) => {
  const validText: SilkscreenText = {
    text: "R1 10k",
    fontSize: 1.0,
    layer: "top",
    minReadableSize: 0.6
  };
  t.is(validateSilkscreenText(validText), true);

  const tinyText: SilkscreenText = {
    text: "C1",
    fontSize: 0.3,
    layer: "top",
    minReadableSize: 0.6
  };
  t.is(validateSilkscreenText(tinyText), false);

  const emptyText: SilkscreenText = {
    text: "   ",
    fontSize: 1.0,
    layer: "top",
    minReadableSize: 0.6
  };
  t.is(validateSilkscreenText(emptyText), false);
});
