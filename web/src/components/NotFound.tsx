export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-[#F9F9FF] text-[#141B2B] selection:bg-emerald-500 selection:text-white">
            {/* Main */}
            <main className="flex min-h-[110vh] flex-1 items-center justify-center px-6 pt-24 pb-16">
                <div className="w-full max-w-4xl text-center">
                    <div className="mb-12 -mt-30">
                        <h1 className="text-[170px] font-extrabold leading-none tracking-tight text-emerald-600/15 md:text-[200px]">
                            404
                        </h1>
                    </div>

                    <h2 className="mb-4 text-4xl font-semibold text-slate-900">
                        페이지를 찾을 수 없습니다.
                    </h2>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-slate-600">
                        이동하려던 페이지가 없거나 삭제된 것 같아요.
                    </p>

                    <a
                        href="/"
                        className="inline-flex items-center rounded-full bg-[#005236] px-8 py-3.5 font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
                    >
                        ← 돌아가기
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white py-12">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-emerald-600">
                            SDG Pulse
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            © 2024 SDG Pulse. Purposeful Precision for Global
                            Goals.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <a
                            href="#"
                            className="transition hover:text-emerald-600"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="#"
                            className="transition hover:text-emerald-600"
                        >
                            Terms of Service
                        </a>

                        <a
                            href="#"
                            className="transition hover:text-emerald-600"
                        >
                            SDG Framework
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
