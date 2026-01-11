import React, { useState, useEffect, useRef } from "react";
import {
  RecipeStep,
  CookieConfig,
  TOPPING_OPTIONS,
  SEASONING_OPTIONS,
} from "./types";

const App: React.FC = () => {
  const [step, setStep] = useState<RecipeStep>(RecipeStep.SEARCHING);
  const [isShowingResult, setIsShowingResult] = useState(false);
  const [searchInfo, setSearchInfo] = useState<{
    text: string;
    sources: any[];
  } | null>(null);
  const [config, setConfig] = useState<CookieConfig>({
    toppings: [],
    seasoning: "코코아 파우더",
    message: "",
  });

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const doSearch = async () => {
      try {
        // const info = await searchDubaiCookie();
        setSearchInfo({
          text: "DUBAI",
          sources: null,
        });
        setStep(RecipeStep.INTRO);
      } catch (error) {
        setStep(RecipeStep.INTRO);
      }
    };
    doSearch();
  }, []);

  const resetApp = () => {
    setStep(searchInfo ? RecipeStep.INTRO : RecipeStep.SEARCHING);
    setIsShowingResult(false);
    setConfig({
      toppings: [],
      seasoning: "코코아 파우더",
      message: "",
    });
    setFinalImageUrl(null);
  };

  const getStepImageUrl = (currentStep: RecipeStep): string => {
    // These should ideally be replaced with your actual image file paths
    const images: Record<string, string> = {
      [RecipeStep.MELT_BUTTER]: "public/images/melting_butter.png",
      [RecipeStep.FRY_KADAIF]: "public/images/cadaif.jpg",
      [RecipeStep.MIX_PISTACHIO]: "public/images/mixed.jpg",
      [RecipeStep.SHAPE_BALLS]: "public/images/shape_balls.jpg",
      [RecipeStep.MELT_MARSHMALLOW]: "public/images/mashmellow.jpg",
      [RecipeStep.ADD_SEASONING]: getSeasoningPhoto(),
    };
    return images[currentStep] || "public/images/dark_result.jpg";
  };
  const getSeasoningPhoto = () => {
    switch (config.seasoning) {
      case "코코아 파우더":
        return "public/images/dark_result.jpg";
      case "말차 파우더":
        return "public/images/green_result.jpg";
      case "고춧가루":
        return "public/images/red_result.jpg";
      case "시나몬 파우더":
        return "public/images/sinamon_result.jpg";
      case "슈가 파우더":
        return "public/images/white_result.jpg";
    }
    setFinalImageUrl(config.seasoning);
    return "public/images/dark_result.jpg";
  };

  const handleNext = () => {
    if (!isShowingResult) {
      setIsShowingResult(true);
    } else {
      const steps = Object.values(RecipeStep);
      const currentIndex = steps.indexOf(step);
      if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1]);
        setIsShowingResult(false);
      }
    }
  };

  const drawFinalCanvas = (withPackage: boolean, message: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cookieBase = new Image();
    cookieBase.crossOrigin = "anonymous";
    cookieBase.src = getSeasoningPhoto();

    cookieBase.onload = () => {
      canvas.width = 800;
      canvas.height = 800;
      ctx.drawImage(cookieBase, 0, 0, 800, 800);

      if (withPackage) {
        // Premium Border
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = 50;
        ctx.strokeRect(25, 25, 750, 750);

        // Label/Tag area
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.roundRect(200, 600, 400, 80, 15);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Custom Message
        if (message) {
          ctx.fillStyle = "#1c1917";
          ctx.font = 'bold 32px "CookieRun-Regular"';
          ctx.textAlign = "center";
          ctx.fillText(message, 400, 650);
        }
      }
      setFinalImageUrl(canvas.toDataURL("image/png"));
    };
  };

  const startPackaging = () => {
    setStep(RecipeStep.PACKAGING);
    drawFinalCanvas(true, config.message);
  };

  const applyMessageFinal = () => {
    setStep(RecipeStep.FINAL);
    drawFinalCanvas(true, config.message);
  };

  const saveToGallery = () => {
    if (!finalImageUrl) return;
    const link = document.createElement("a");
    link.href = finalImageUrl;
    link.download = `dubai-cookie-gift.png`;
    link.click();
  };

  const renderStep = () => {
    if (
      isShowingResult &&
      step !== RecipeStep.SEARCHING &&
      step !== RecipeStep.INTRO &&
      step !== RecipeStep.FINISHED
    ) {
      return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl text-center animate-in fade-in zoom-in duration-500 w-full max-w-[90vw]">
          <h2 className="text-xl font-bold text-amber-900 mb-6 tracking-tight">
            잘하셨어요!
          </h2>
          <div className="relative aspect-square mb-8 overflow-hidden rounded-[2rem] border-4 border-amber-50 shadow-xl">
            <img
              src={getStepImageUrl(step)}
              alt="Step Result"
              className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
            />
          </div>
          <button onClick={handleNext} className="btn-next">
            다음 단계로
          </button>
        </div>
      );
    }

    switch (step) {
      case RecipeStep.SEARCHING:
        return (
          <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-amber-600 mb-6"></div>
            <h2 className="text-xl font-black text-amber-900 uppercase tracking-widest">
              Researching...
            </h2>
            <p className="text-stone-400 text-[10px] mt-2 italic font-bold">
              OPTIMIZING DUBAI RECIPE
            </p>
          </div>
        );

      case RecipeStep.INTRO:
        return (
          <div
            className="relative h-[85vh] w-full max-w-md bg-cover bg-center rounded-[3rem] shadow-2xl overflow-hidden flex flex-col justify-end p-8"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url('public/images/background.jpg')`,
            }}
          >
            <div className="text-white mb-6">
              <span className="bg-amber-600 text-[10px] font-black tracking-widest py-1 px-3 rounded-full uppercase mb-4 inline-block">
                Premium Bakery
              </span>
              <h1 className="text-4xl font-black mb-3 leading-tight tracking-tighter">
                DUBAI
                <br />
                JJONDEUK
              </h1>
              <p className="text-white/70 text-sm font-medium">
                너무 비싸서 사먹을 순 없지만, 만들어볼 수는 있잖아?
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-amber-50 transition-all shadow-xl active:scale-95"
            >
              쿠키 만들기 시작
            </button>
          </div>
        );

      case RecipeStep.MELT_BUTTER:
      case RecipeStep.FRY_KADAIF:
      case RecipeStep.MIX_PISTACHIO:
      case RecipeStep.SHAPE_BALLS:
      case RecipeStep.MELT_MARSHMALLOW:
      case RecipeStep.SHAPE_BALLS:
        const stepMeta = {
          [RecipeStep.MELT_BUTTER]: {
            t: "버터 녹이기",
            i: "🧈",
            d: "고소한 무염 버터를 팬에 약불로 부드럽게 녹여줍니다.",
          },
          [RecipeStep.FRY_KADAIF]: {
            t: "카다이프 볶기",
            i: "🌾",
            d: "녹은 버터에 카다이프를 넣어 황금빛이 돌 때까지 볶으세요.",
          },
          [RecipeStep.MIX_PISTACHIO]: {
            t: "피스타치오 페이스트와 잘 섞어주기",
            i: "🥜",
            d: "볶은 카다이프를 피스타치오 페이스트와 비벼~!",
          },
          [RecipeStep.SHAPE_BALLS]: {
            t: "동그랗게 빚기",
            i: "👐",
            d: "피스타치오와 잘 섞인 반죽을 한입 크기로 빚어줍니다.",
          },
          [RecipeStep.MELT_MARSHMALLOW]: {
            t: "마시멜로우 녹이기",
            i: "☁️",
            d: "쫀득한 식감의 핵심! 마시멜로우를 부드럽게 녹여요.",
          },
        }[step as keyof typeof RecipeStep];

        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-[90vw] mx-auto">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <span className="text-4xl">{stepMeta?.i}</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 mb-3">
              {stepMeta?.t}
            </h2>
            <p className="text-stone-400 text-sm mb-10 leading-relaxed font-medium">
              {stepMeta?.d}
            </p>
            <button onClick={handleNext} className="btn-next">
              다음 단계로
            </button>
          </div>
        );

      case RecipeStep.ADD_SEASONING:
        return (
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-[90vw]">
            <h2 className="text-2xl font-black mb-6 text-center text-stone-900">
              ✨ 시즈닝 파우더를 골라, 반죽과 섞으면 두쫀쿠 완성!
            </h2>
            <div className="space-y-3 mb-8">
              {SEASONING_OPTIONS.map((s) => (
                <button
                  key={s.name}
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, seasoning: s.name }))
                  }
                  className={`w-full flex items-center p-5 rounded-[1.5rem] border-2 transition-all active:scale-95 ${
                    config.seasoning === s.name
                      ? "border-amber-600 bg-amber-50 shadow-md"
                      : "border-stone-100 bg-white"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${s.color} mr-4 border border-stone-200`}
                  ></div>
                  <span className="font-black text-sm text-stone-700">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setStep(RecipeStep.FINISHED);
                drawFinalCanvas(false, "");
              }}
              className="btn-next"
            >
              쿠키 완성하기
            </button>
          </div>
        );

      case RecipeStep.FINISHED:
        return (
          <div className="bg-white p-6 rounded-[3rem] shadow-2xl text-center w-full max-w-[90vw]">
            <h2 className="text-2xl font-black mb-6 text-amber-950 italic">
              완성했어요!
            </h2>
            <div className="relative mb-8 group">
              <img
                src={getStepImageUrl(RecipeStep.ADD_SEASONING)}
                className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl border-8 border-white"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[2rem] flex items-end justify-center pb-6">
                <span className="text-white text-[10px] font-black tracking-widest uppercase opacity-70">
                  Ready to pack
                </span>
              </div>
            </div>
            <button onClick={startPackaging} className="btn-next">
              🎁 포장하기
            </button>
          </div>
        );

      case RecipeStep.PACKAGING:
        return (
          <div className="bg-white p-6 rounded-[3rem] shadow-2xl text-center w-full max-w-[90vw]">
            <h2 className="text-xl font-black mb-6 text-amber-700 tracking-[0.2em] uppercase">
              Box Design
            </h2>
            <img
              src={finalImageUrl || ""}
              className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl mb-8 scale-105 transform"
            />
            <button
              onClick={() => setStep(RecipeStep.MESSAGE)}
              className="btn-next"
            >
              📝 문구 남기기
            </button>
          </div>
        );

      case RecipeStep.MESSAGE:
        return (
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-[90vw] text-center">
            <h2 className="text-2xl font-black mb-3 text-stone-900">
              MESSAGES
            </h2>
            <p className="text-stone-400 text-[10px] font-bold mb-8 tracking-widest uppercase">
              Personalize your gift
            </p>
            <input
              type="text"
              maxLength={15}
              value={config.message}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="여기에 문구를 입력하세요"
              className="w-full py-5 px-4 border-b-2 border-stone-100 text-center outline-none text-xl font-bold mb-10 placeholder:text-stone-200"
            />
            <button onClick={applyMessageFinal} className="btn-next">
              적용하기
            </button>
          </div>
        );

      case RecipeStep.FINAL:
        return (
          <div className="bg-white p-6 rounded-[3rem] shadow-2xl text-center w-full max-w-[90vw]">
            <h2 className="text-2xl font-black text-amber-950 mb-2 italic">
              ENJOY DUBAI
            </h2>
            <p className="text-stone-400 text-[10px] font-bold mb-8 tracking-widest uppercase">
              Your creation is ready
            </p>
            <img
              src={finalImageUrl || ""}
              className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl mb-10 border-8 border-white rotate-1"
            />
            <div className="flex flex-col gap-4">
              <button
                onClick={saveToGallery}
                className="btn-next shadow-amber-200"
              >
                📥 갤러리에 저장
              </button>
              <button
                onClick={resetApp}
                className="text-stone-300 text-[10px] font-black tracking-[0.2em] hover:text-stone-600 transition-colors py-4 uppercase"
              >
                New Cookie
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Decorative Orbs for aesthetic background */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-green-50/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Persistent Reset Button for Mobile */}
      {step !== RecipeStep.SEARCHING && step !== RecipeStep.INTRO && (
        <div className="fixed top-8 left-0 right-0 px-6 flex justify-end z-[100] max-w-md mx-auto">
          <button
            onClick={resetApp}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-stone-400 hover:text-amber-700 hover:bg-white transition-all shadow-xl border border-white uppercase active:scale-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            처음부터
          </button>
        </div>
      )}

      <div className="w-full max-w-md relative flex items-center justify-center">
        {renderStep()}
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <footer className="mt-10 text-stone-300 text-[9px] font-black tracking-[0.4em] uppercase text-center opacity-50">
        Dubai Cookie Factory AI
      </footer>

      <style>{`
        .btn-next {
          width: 100%;
          padding: 1.25rem;
          background-color: #1c1917;
          color: white;
          border-radius: 1.5rem;
          font-weight: 900;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.4);
        }
        .btn-next:hover {
          background-color: #000;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 25px 45px -12px rgba(0,0,0,0.5);
        }
        .btn-next:active {
          transform: translateY(1px) scale(0.96);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
