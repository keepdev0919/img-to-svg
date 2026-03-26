import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../app/page";

// 브라우저 API 목업
beforeEach(() => {
  vi.clearAllMocks();
  global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = vi.fn();
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

// ── 파일 유효성 검사 ──────────────────────────────────────────────────────────

describe("파일 유효성 검사", () => {
  it("지원하지 않는 형식(gif)을 거부한다", async () => {
    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["data"], "test.gif", { type: "image/gif" });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText("PNG, JPG, WebP만 가능해요.")).toBeInTheDocument();
  });

  it("10MB 초과 파일을 거부한다", async () => {
    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const bigData = new ArrayBuffer(11 * 1024 * 1024);
    const file = new File([bigData], "large.png", { type: "image/png" });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText("10MB 이하 파일만 가능해요.")).toBeInTheDocument();
  });

  it("유효한 PNG 파일을 수락하고 파일명을 표시한다", async () => {
    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["fake-png"], "my-image.png", {
      type: "image/png",
    });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByText("my-image.png")).toBeInTheDocument();
    expect(screen.getByText("SVG로 변환")).toBeInTheDocument();
  });

  it("파일 교체 시 이전 preview URL을 해제한다", async () => {
    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file1 = new File(["a"], "a.png", { type: "image/png" });
    const file2 = new File(["b"], "b.png", { type: "image/png" });

    await act(async () => {
      fireEvent.change(input, { target: { files: [file1] } });
    });
    await act(async () => {
      fireEvent.change(input, { target: { files: [file2] } });
    });

    // 두 번째 파일 선택 시 첫 번째 blob URL이 해제되어야 함
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });
});

// ── 변환 에러 상태 ────────────────────────────────────────────────────────────

describe("변환 에러 상태", () => {
  async function uploadFile() {
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["data"], "test.png", { type: "image/png" });
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
  }

  it("429 응답 시 rate limit 에러 메시지를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429 })
    );
    render(<Home />);
    await uploadFile();

    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });

    expect(screen.getByText(/1분에 5회 제한/)).toBeInTheDocument();
  });

  it("408 응답 시 타임아웃 에러 메시지를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 408 })
    );
    render(<Home />);
    await uploadFile();

    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });

    expect(screen.getByText(/해상도를 줄여/)).toBeInTheDocument();
  });

  it("네트워크 오류(fetch throw) 시 연결 오류 메시지를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error"))
    );
    render(<Home />);
    await uploadFile();

    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });

    expect(screen.getByText(/서버에 연결할 수 없어요/)).toBeInTheDocument();
  });

  it("기타 오류(500) 시 변환 실패 메시지를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );
    render(<Home />);
    await uploadFile();

    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });

    expect(screen.getByText(/다른 이미지로 시도/)).toBeInTheDocument();
  });
});

// ── 변환 성공 상태 ────────────────────────────────────────────────────────────

describe("변환 성공 상태", () => {
  const mockSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>';

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(mockSvg),
        headers: {
          get: (key: string) => {
            if (key === "X-Path-Count") return "3";
            if (key === "X-Complexity-Warning") return "false";
            return null;
          },
        },
      })
    );
  });

  async function uploadAndConvert() {
    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["data"], "test.png", { type: "image/png" });
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });
  }

  it("변환 성공 시 path count를 표시한다", async () => {
    await uploadAndConvert();
    expect(screen.getByText(/SVG \(3 paths\)/)).toBeInTheDocument();
  });

  it("변환 성공 시 다운로드 버튼을 표시한다", async () => {
    await uploadAndConvert();
    expect(screen.getByText("SVG 다운로드")).toBeInTheDocument();
  });

  it("변환 성공 시 'SVG 코드 복사' 버튼을 표시한다", async () => {
    await uploadAndConvert();
    expect(screen.getByText("SVG 코드 복사")).toBeInTheDocument();
  });

  it("path count > 500이면 complexity warning을 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(mockSvg),
        headers: {
          get: (key: string) => {
            if (key === "X-Path-Count") return "501";
            if (key === "X-Complexity-Warning") return "true";
            return null;
          },
        },
      })
    );

    render(<Home />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(["data"], "test.png", { type: "image/png" });
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    await act(async () => {
      fireEvent.click(screen.getByText("SVG로 변환"));
    });

    expect(screen.getByText(/501개/)).toBeInTheDocument();
  });
});
