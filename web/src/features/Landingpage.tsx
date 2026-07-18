import {
    Smartphone,
    BookOpen,
    Flame,
    ArrowRight,
    Star,
    Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import Footer from "../components/Footer";

export default function Landingpage() {
    document.title = "MoveUp - 청소년 웰니스 웹";
    const navigator = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-900">
            {/* Top Navbar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-md shadow-emerald-500/10 transition-transform group-hover:scale-105">
                            M
                        </div>
                        <span className="font-lexend font-extrabold text-xl tracking-tight text-slate-900">
                            Move<span className="text-emerald-600">Up</span>
                        </span>
                    </div>
                    <Link
                        to="/auth"
                        className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-700 hover:shadow-md active:scale-95"
                    >
                        무료로 시작하기
                    </Link>
                </div>
            </header>
            <div className="space-y-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Accent Banner (100% css/svg visual illustration instead of an external image) */}
                <div className="relative bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        <div className="lg:col-span-7 space-y-6 text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-lexend tracking-wide">
                                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                                청소년 웰니스 웹
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white tracking-tight">
                                귀찮은 운동은 끝! <br />
                                습관을{" "}
                                <span className="text-emerald-400 relative inline-block">
                                    게임처럼 즐겁게
                                    <span className="absolute bottom-1 left-0 w-full h-1 bg-emerald-400/30 rounded-full"></span>
                                </span>
                            </h1>

                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
                                MoveUp은 지루한 잔소리 대신,{" "}
                                <strong>일일 퀘스트</strong>와{" "}
                                <strong>랭킹 대결</strong>을 통해 청소년 스스로
                                건강한 신체와 마음을 가꾸는 놀이터입니다.
                            </p>

                            <div className="pt-2 flex flex-wrap gap-4">
                                <button
                                    className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold px-7 py-4 rounded-2xl text-sm md:text-base transition-all flex items-center gap-2.5 shadow-lg shadow-emerald-500/20"
                                    onClick={() => navigator("/auth")}
                                >
                                    웹에서 바로 미션 깨기
                                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive CSS Graphic Representation of the Gamified dashboard (Zero-image representation) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-float">
                                {/* Fake notification */}
                                <div className="absolute -top-3 -right-3 bg-linear-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <Flame className="w-3 h-3 fill-slate-950" />
                                    <span>7일 연속 성공!</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                                M
                                            </div>
                                            <span className="font-bold text-xs text-slate-200">
                                                오늘의 퀘스트
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hydration progress mock */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">
                                                💧 수분 충전하기
                                            </span>
                                            <span className="text-emerald-400 font-bold">
                                                3 / 5 잔
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-400 h-full w-[60%] rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Steps progress mock */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">
                                                🚶 등하굣길 걷기
                                            </span>
                                            <span className="text-emerald-400 font-bold">
                                                3,500 / 3,000 걸음
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-400 h-full w-full rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Tree preview mock */}
                                    <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
                                            🌱
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 block">
                                                내 건강 캐릭터
                                            </span>
                                            <span className="text-xs font-bold text-slate-200">
                                                2단계 아기 새싹 성장 중
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-500">
                            위 UI 내용은 실제와 다를 수 있습니다.
                        </span>
                    </div>
                </div>

                {/* Problem Area: 요즘 우리 청소년들의 실태 */}
                <div className="space-y-8 max-w-[1400px] mx-auto">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            Teenager Lifestyle
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                            요즘 청소년들, 정말 건강하게 지내고 있을까?
                        </h2>
                        <p className="text-sm md:text-base text-slate-500">
                            스마트폰 과다 사용과 학업 스트레스로 늘 피곤해하는
                            우리들의 진짜 실태입니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:-translate-y-1.5 transition-all max-w-sm mx-auto">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-extrabold text-slate-800 font-lexend mb-1">
                                4.5
                                <span className="text-sm font-bold text-slate-500 ml-0.5">
                                    시간
                                </span>
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mb-2">
                                스마트폰 과의존
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                하루 평균 스마트폰 사용 시간의 증가로 신체
                                활동량이 지속적으로 감소하고 있습니다.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:-translate-y-1.5 transition-all max-w-sm mx-auto">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-extrabold text-slate-800 font-lexend mb-1">
                                70
                                <span className="text-sm font-bold text-slate-500 ml-0.5">
                                    %
                                </span>
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mb-2">
                                학업 및 학원 스트레스
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                장시간 의자에 앉아있는 불균형한 습관과 누적된
                                공부 스트레스로 만성 피로가 쌓입니다.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:-translate-y-1.5 transition-all max-w-sm mx-auto">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                                <Flame className="w-6 h-6" />
                            </div>
                            <span className="text-3xl font-extrabold text-slate-800 font-lexend mb-1">
                                15
                                <span className="text-sm font-bold text-slate-500 ml-0.5">
                                    %
                                </span>
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mb-2">
                                하루 권장 운동량 달성
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                매일 30분 이상 가벼운 걷기나 스트레칭을
                                정기적으로 수행하는 청소년의 비중이 턱없이
                                부족합니다.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Gamification Rules & Steps */}
                <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-3xl p-8 md:p-12 max-w-[1400px] mx-auto space-y-10">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            How It Works
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">
                            하루 딱 5분, MoveUp 건강 레벨업 프로세스
                        </h2>
                        <p className="text-sm text-slate-500">
                            앱을 내려받지 않고 웹에서 클릭 몇 번만으로 끝내는
                            재미있는 건강 습관
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center font-lexend text-base shadow-md">
                                1
                            </div>
                            <h4 className="font-bold text-slate-800 text-base">
                                소소한 퀘스트 체크하기
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                물 마시기, 가볍게 동네 한바퀴 걷기, 3분 스트레칭
                                타이머를 켜두고 활동하는 등 매일의 가벼운 미션을
                                기록해보세요.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center font-lexend text-base shadow-md">
                                2
                            </div>
                            <h4 className="font-bold text-slate-800 text-base">
                                경험치 획득
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                각 미션을 성공할 때마다 경험치(XP)를 즉시
                                보상으로 받습니다.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center font-lexend text-base shadow-md">
                                3
                            </div>
                            <h4 className="font-bold text-slate-800 text-base">
                                랭킹전 기여
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                나의 개인 활동 성과를 다른 이용자들과
                                경쟁하세요!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center py-10">
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
                        지금 바로 레벨업에 참여해봐!
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        로그인이나 다운로드 없이 즉시 시작하는 1분 퀘스트
                    </p>
                    <button
                        className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-10 py-4.5 rounded-2xl text-base transition-all shadow-xl shadow-purple-200"
                        onClick={() => navigator("/auth")}
                    >
                        무료로 오늘의 퀘스트 시작하기
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
