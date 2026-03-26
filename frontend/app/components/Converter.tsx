"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const SUPPORTED = ["image/png", "image/jpeg", "image/webp"];

type State =
  | { kind: "idle" }
  | { kind: "converting" }
  | { kind: "done"; svgText: string; pathCount: number; complexityWarning: boolean }
  | { kind: "error"; message: string };

export default function Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [svgBlobUrl, setSvgBlobUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [colorPrecision, setColorPrecision] = useState(6);
  const [filterSpeckle, setFilterSpeckle] = useState(4);
  const [pathPrecision, setPathPrecision] = useState(3);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.kind === "done") {
      const blob = new Blob([state.svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      setSvgBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSvgBlobUrl(null);
    }
  }, [state]);

  const handleFile = useCallback((f: File) => {
    if (!SUPPORTED.includes(f.type)) {
      setState({ kind: "error", message: "PNG, JPG, WebP만 가능해요." });
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setState({ kind: "error", message: "10MB 이하 파일만 가능해요." });
      return;
    }
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setState({ kind: "idle" });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const convert = async () => {
    if (!file) return;
    setState({ kind: "converting" });

    const form = new FormData();
    form.append("file", file);
    form.append("color_precision", String(colorPrecision));
    form.append("filter_speckle", String(filterSpeckle));
    form.append("path_precision", String(pathPrecision));
    form.append("remove_background", removeBg ? "true" : "false");

    try {
      const res = await fetch(`${API_BASE}/api/convert`, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(65000),
      });

      if (res.status === 429) {
        setState({ kind: "error", message: "잠시 후 다시 시도해주세요. (1분에 5회 제한)" });
        return;
      }
      if (res.status === 408) {
        setState({ kind: "error", message: "이미지가 너무 복잡해요. 해상도를 줄여 다시 시도해보세요." });
        return;
      }
      if (!res.ok) {
        setState({ kind: "error", message: "변환에 실패했어요. 다른 이미지로 시도해보세요." });
        return;
      }

      const svgText = await res.text();
      const pathCount = parseInt(res.headers.get("X-Path-Count") ?? "0", 10);
      const complexityWarning = res.headers.get("X-Complexity-Warning") === "true";
      setState({ kind: "done", svgText, pathCount, complexityWarning });
    } catch {
      setState({ kind: "error", message: "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요." });
    }
  };

  const copySvg = async () => {
    if (state.kind !== "done") return;
    await navigator.clipboard.writeText(state.svgText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (state.kind !== "done") return;
    const blob = new Blob([state.svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name.replace(/\.[^.]+$/, "") ?? "image") + ".svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isConverting = state.kind === "converting";

  return (
    <>
      {/* Drop Zone */}
      <section className="relative max-w-4xl mx-auto">
        <div className="bg-[#f5f2ff] rounded-[32px] p-4 md:p-12 editorial-shadow">
          <div
            className="drop-zone-dashed rounded-[24px] bg-white flex flex-col items-center justify-center min-h-[360px] cursor-pointer transition-all duration-500 hover:bg-[#fbf8ff]"
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="text-center space-y-2 p-6">
                <div className="w-16 h-16 bg-[#383fd9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[#383fd9] text-3xl">check_circle</span>
                </div>
                <p className="text-[#1b1b24] font-semibold font-headline text-lg">{file.name}</p>
                <p className="text-[#454555] text-sm">클릭해서 다른 파일 선택</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#383fd9]/10 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#383fd9] text-4xl">upload_file</span>
                </div>
                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold font-headline text-[#1b1b24]">
                    이미지를 드래그 앤 드롭하거나 클릭해서 선택
                  </h2>
                  <p className="text-[#454555] font-medium">PNG · JPG · WebP · 최대 10MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="mt-10 px-8 py-4 bg-[#383fd9] text-white rounded-full font-bold text-lg flex items-center gap-3 editorial-shadow hover:opacity-90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  파일 선택하기
                </button>
              </>
            )}
          </div>
        </div>

        {/* Floating decoration cards */}
        <div className="hidden lg:block absolute -left-24 top-1/2 w-48 p-4 bg-white rounded-2xl editorial-shadow animate-bounce-slow pointer-events-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600 text-sm">imagesmode</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#454555]">Input</span>
          </div>
          <div className="w-full aspect-square rounded-xl bg-[#efecf9] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#383fd9]/40 text-4xl">image</span>
          </div>
        </div>

        <div className="hidden lg:block absolute -right-24 top-1/2 w-48 p-4 bg-white rounded-2xl editorial-shadow animate-bounce-slow-delayed pointer-events-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-sm">polyline</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#454555]">Output</span>
          </div>
          <div className="w-full aspect-square rounded-xl bg-[#efecf9] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#383fd9] text-5xl">polyline</span>
          </div>
        </div>
      </section>

      {/* Settings + Convert Button */}
      {file && (
        <div className="max-w-4xl mx-auto mt-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e3e1ee] p-5 space-y-4 editorial-shadow">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                disabled={isConverting}
                className="w-4 h-4 accent-[#383fd9]"
              />
              <span className="text-[#1b1b24] text-sm font-medium">배경 제거</span>
            </label>

            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-sm text-[#383fd9] hover:underline font-medium"
            >
              {showAdvanced ? "고급 설정 접기 ▲" : "고급 설정 ▼"}
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-[#e3e1ee]">
                <Slider label="색상 정밀도" value={colorPrecision} min={1} max={8}
                  onChange={setColorPrecision} disabled={isConverting}
                  hint="낮을수록 단순, 높을수록 상세" />
                <Slider label="노이즈 제거" value={filterSpeckle} min={1} max={100}
                  onChange={setFilterSpeckle} disabled={isConverting}
                  hint="높을수록 작은 점 무시" />
                <Slider label="패스 부드러움" value={pathPrecision} min={3} max={8}
                  onChange={setPathPrecision} disabled={isConverting}
                  hint="높을수록 선이 부드러움" />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={convert}
              disabled={isConverting}
              className="px-10 py-4 bg-gradient-to-br from-[#383fd9] to-[#535bf2] text-white font-bold text-lg rounded-full editorial-shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center gap-3"
            >
              {isConverting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  변환 중…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_awesome</span>
                  SVG로 변환
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {state.kind === "error" && (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
          <p className="text-red-600 text-sm font-medium">{state.message}</p>
        </div>
      )}

      {/* Result */}
      {state.kind === "done" && (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
          {state.complexityWarning && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <p className="text-amber-700 text-sm font-medium">
                SVG에 path가 {state.pathCount}개예요. Figma에서 편집이 느릴 수 있어요.
                노이즈 제거를 높이거나 색상 정밀도를 낮춰보세요.
              </p>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-white border border-[#e3e1ee] rounded-2xl p-4 editorial-shadow">
              <p className="text-xs text-[#454555] mb-2 font-bold uppercase tracking-wider font-headline">원본</p>
              {preview && <img src={preview} alt="업로드된 원본 이미지" className="w-full object-contain max-h-72" />}
            </div>
            <div className="flex-1 bg-white border border-[#e3e1ee] rounded-2xl p-4 editorial-shadow">
              <p className="text-xs text-[#454555] mb-2 font-bold uppercase tracking-wider font-headline">
                SVG ({state.pathCount} paths)
              </p>
              {svgBlobUrl && (
                <img src={svgBlobUrl} alt="변환된 SVG 결과물" className="w-full object-contain max-h-72" />
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={download}
              className="px-6 py-3 bg-[#1b1b24] text-white font-semibold rounded-full hover:bg-[#1b1b24]/80 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              SVG 다운로드
            </button>
            <button
              onClick={copySvg}
              className="px-6 py-3 border-2 border-[#c6c5d8] text-[#1b1b24] font-semibold rounded-full hover:bg-[#f5f2ff] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">{copied ? "check" : "content_copy"}</span>
              {copied ? "복사됨" : "SVG 코드 복사"}
            </button>
            <button
              onClick={convert}
              disabled={isConverting}
              className="px-6 py-3 border-2 border-[#c6c5d8] text-[#1b1b24] font-semibold rounded-full hover:bg-[#f5f2ff] disabled:opacity-50 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              재변환
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Slider({
  label, value, min, max, onChange, disabled, hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled: boolean;
  hint: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-[#1b1b24]">{label}</span>
        <span className="text-sm font-mono text-[#454555]">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full accent-[#383fd9]"
      />
      <p className="text-xs text-[#454555] mt-0.5">{hint}</p>
    </div>
  );
}
