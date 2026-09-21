import { getResilientImageState } from "../resilient-image";

describe("getResilientImageState", () => {
  it("uses the fallback when the image URL is missing", () => {
    expect(getResilientImageState("")).toEqual({
      imageSrc: null,
      showFallback: true,
    });
    expect(getResilientImageState(null)).toEqual({
      imageSrc: null,
      showFallback: true,
    });
  });

  it("uses the fallback after an image URL fails", () => {
    expect(getResilientImageState("https://example.com/image.jpg", "https://example.com/image.jpg")).toEqual({
      imageSrc: "https://example.com/image.jpg",
      showFallback: true,
    });
  });

  it("keeps a valid image visible until it fails", () => {
    expect(getResilientImageState("https://example.com/image.jpg", null)).toEqual({
      imageSrc: "https://example.com/image.jpg",
      showFallback: false,
    });
  });
});
