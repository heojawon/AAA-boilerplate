export default function Dashboard() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            {/* Navigation */}
            <header className="bg-surface shadow-sm sticky top-0 z-50">
                <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop h-16 max-w-7xl mx-auto">
                    <div className="text-headline-lg font-headline-lg font-extrabold text-primary">MoveUp</div>
                    <nav className="hidden md:flex gap-8">
                        <a href="#" className="text-primary font-bold border-b-2 border-primary pb-1 text-label-md font-label-md">홈</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#">랭킹</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md" href="#">커뮤니티</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="interactive-element w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
                            <img alt="사용자 프로필" className="w-full h-full object-cover" data-alt="A profile picture of a teenager smiling, bright studio lighting, energetic vibe, solid vibrant background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8D0EG3xwoVY7hPXLqUiF14nEDmGi-5PLIbGsiuwQxV950-VRtcTJbVtDVyLOGpy9Yn210k-a7OvKYB3dKRR_s0Z7Kqql0E0Emskjekd6YWFRAM0SAdtFys1Vw-tPI8wjTMRKwJbHIQRsbEfqQjBG-tieLbxNp_nOMT3gaBhBMBWOGz0XGLA0wMkDxn5I7BVSZZUjePRSjcXPUN_zcuhNlEySVu5Xv2zA_hPMyPotlIFlOuQgzZVSaIoKYZWe1iqq_HRGNRfYtgff" />
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow max-w-7xl mx-auto w-full px-container-padding-mobile md:px-container-padding-desktop py-8">
                {/* Header Section */}
                <section className="mb-stack-md flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <p className="text-label-md font-label-md text-on-surface-variant mb-1">2024년 5월 20일 월요일</p>
                        <h1 className="text-display-lg font-display-lg text-on-surface">
                            안녕하세요, <span className="text-primary">지훈</span>님! <br className="hidden md:block" />
                            오늘 하루도 건강하게 시작해볼까요?
                        </h1>
                    </div>
                </section>
                {/* Bento Grid Dashboard */}
                <div className="bento-grid grid grid-cols-12 gap-4">
                    {/* 1. Health Score Card */}
                    <div className="col-span-12 md:col-span-8 lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden h-80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-bl-full opacity-20 -z-10 blur-2xl"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-headline-md font-headline-md text-on-surface">건강 점수</h2>
                                <p className="text-body-md font-body-md text-on-surface-variant mt-1">상위 15% 진입을 향해!</p>
                            </div>
                            <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">
                                Lv.3 어린 나무
                            </div>
                        </div>
                        <div className="flex-grow flex items-center justify-center gap-6">
                            <div className="text-center">
                                <span className="text-display-lg font-display-lg font-extrabold text-primary">86</span>
                                <span className="text-headline-md font-headline-md text-on-surface-variant">/ 100</span>
                                <p className="text-label-md font-label-md text-primary mt-2 flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span> +3점 상승
                                </p>
                            </div>
                            <div className="w-32 h-32 relative flex items-center justify-center">
                                <div className="bg-cover bg-center w-full h-full rounded-2xl drop-shadow-md" data-alt="A stylized 3D illustration of a healthy, glowing young sapling plant growing out of clean white soil. Bright, optimistic lighting, soft pill-like geometric leaves. Vibrant green and subtle blue tones, modern gamified UI aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1MpaFLhx-lIIzESIrT9531Thye1YoodFM8DV98C4qJNbPP0USIvRdht3yYT1boSUvAB1EewTXVaVO980JwCExWVWyQBnsARghCFWv0u0UF1BOFea8xsQ6OcNyuV6af2NFqfE0gvgSy5Mv3DmNKuuESo6478vS1br69sWLeDsneRLT1ZLQBwKh9PmSke7gLzE_rxjtF___QGhz8QuV_HRh5wgPbx7NH8GQjygWbrMpF3v8PFa4Ct0rRoSBb__LBqxLtd4MMlIzhN8p')" }}></div>
                            </div>
                        </div>
                    </div>
                    {/* 2. Today's Quests */}
                    <div className="col-span-12 md:col-span-4 lg:col-span-4 bg-surface-container-lowest rounded-3xl p-6 shadow-sm h-80 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-headline-md font-headline-md text-on-surface">오늘의 퀘스트</h2>
                            <span className="text-label-sm font-label-sm text-secondary-container font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span> 3일 연속
                            </span>
                        </div>
                        <div className="flex-grow flex flex-col gap-3 overflow-y-auto pr-2">
                            {/* Quest Item 1 (Done) */}
                            <label className="flex items-center gap-3 p-3 bg-surface-container rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                                <input defaultChecked className="w-6 h-6 rounded-full border-2 border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" type="checkbox" />
                                <span className="text-body-md font-body-md text-on-surface-variant line-through opacity-70">6000보 걷기</span>
                                <div className="ml-auto w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-sm">directions_walk</span>
                                </div>
                            </label>
                            {/* Quest Item 2 (Done) */}
                            <label className="flex items-center gap-3 p-3 bg-surface-container rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                                <input defaultChecked className="w-6 h-6 rounded-full border-2 border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" type="checkbox" />
                                <span className="text-body-md font-body-md text-on-surface-variant line-through opacity-70">물 8잔 마시기</span>
                                <div className="ml-auto w-8 h-8 rounded-full bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
                                    <span className="material-symbols-outlined text-sm">water_drop</span>
                                </div>
                            </label>
                            {/* Quest Item 3 (Pending) */}
                            <label className="flex items-center gap-3 p-3 bg-surface rounded-xl cursor-pointer hover:bg-surface-container transition-colors border border-surface-variant">
                                <input className="w-6 h-6 rounded-full border-2 border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" type="checkbox" />
                                <span className="text-body-md font-body-md text-on-surface font-medium">스트레칭 10분</span>
                                <div className="ml-auto w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                                    <span className="material-symbols-outlined text-sm">self_improvement</span>
                                </div>
                            </label>
                            {/* Quest Item 4 (Pending) */}
                            <label className="flex items-center gap-3 p-3 bg-surface rounded-xl cursor-pointer hover:bg-surface-container transition-colors border border-surface-variant">
                                <input className="w-6 h-6 rounded-full border-2 border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all cursor-pointer" type="checkbox" />
                                <span className="text-body-md font-body-md text-on-surface font-medium">30분 운동하기</span>
                                <div className="ml-auto w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center text-error">
                                    <span className="material-symbols-outlined text-sm">fitness_center</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    {/* 3. Steps Card & 4. AI Recommendation (Stacked) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-80">
                        {/* Steps */}
                        <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex-1 flex flex-col items-center justify-center relative">
                            <h3 className="text-label-md font-label-md text-on-surface-variant absolute top-5 left-5 font-bold">걸음 수</h3>
                            <div className="progress-circle mt-4">
                                <div className="progress-circle-inner flex flex-col items-center">
                                    <span className="material-symbols-outlined text-primary mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>directions_walk</span>
                                    <span className="text-label-md font-label-md font-extrabold text-on-surface">4500</span>
                                </div>
                            </div>
                            <p className="text-label-sm font-label-sm text-on-surface-variant mt-3 text-center">목표 6000보까지<br />조금만 더!</p>
                        </div>
                        {/* AI Rec */}
                        <div className="bg-gradient-to-br from-tertiary-fixed-dim to-tertiary-fixed rounded-3xl p-5 shadow-sm flex-1 flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                                <span className="text-label-sm font-label-sm font-bold text-on-tertiary-container">AI 코치 추천</span>
                            </div>
                            <p className="text-body-md font-body-md text-on-tertiary-container font-medium leading-snug">
                                "오늘은 비가 오니<br />실내 스트레칭 15분을<br />추천합니다."
                            </p>
                        </div>
                    </div>
                    {/* 5. Weekly Stats */}
                    <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 shadow-sm h-64 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-headline-md font-headline-md text-on-surface">이번 주 통계</h2>
                            <div className="flex gap-2">
                                <span className="text-label-sm font-label-sm flex items-center gap-1 text-on-surface-variant"><div className="w-3 h-3 rounded-full bg-primary-container"></div>걸음 수</span>
                            </div>
                        </div>
                        <div className="flex-grow flex items-end justify-between px-2 gap-2">
                            {/* M */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-primary-container w-full rounded-t-sm" style={{ height: "60%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">월</span>
                            </div>
                            {/* T */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-primary-container w-full rounded-t-sm" style={{ height: "80%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">화</span>
                            </div>
                            {/* W */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-primary-container w-full rounded-t-sm" style={{ height: "40%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">수</span>
                            </div>
                            {/* T */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-primary-container w-full rounded-t-sm" style={{ height: "90%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">목</span>
                            </div>
                            {/* F */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-primary-container w-full rounded-t-sm" style={{ height: "100%" }}></div>
                                <span className="text-label-sm font-label-sm text-primary font-bold">금</span>
                            </div>
                            {/* S */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-surface-variant w-full rounded-t-sm" style={{ height: "10%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">토</span>
                            </div>
                            {/* S */}
                            <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                <div className="bar bg-surface-variant w-full rounded-t-sm" style={{ height: "10%" }}></div>
                                <span className="text-label-sm font-label-sm text-on-surface-variant">일</span>
                            </div>
                        </div>
                    </div>
                    {/* 6. School Ranking */}
                    <div className="col-span-12 lg:col-span-5 bg-primary text-on-primary rounded-3xl p-6 shadow-sm h-64 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-xl"></div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-primary-fixed">leaderboard</span>
                                <span className="text-label-sm font-label-sm font-bold text-primary-fixed">실시간 이용자 랭킹</span>
                            </div>
                            <h2 className="text-headline-md font-headline-md mb-2">이용자 랭킹</h2>
                            <p className="text-body-md font-body-md opacity-90">이번 주 가장 활동적인 이용자들과 경쟁해보세요!</p>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 z-10">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center font-bold text-label-md">4</div>
                                    <div className="flex flex-col">
                                        <p className="text-label-md font-bold">김지훈 (나)</p>
                                        <p className="text-label-sm opacity-80">8,420 걸음</p>
                                    </div>
                                </div>
                                <span className="text-label-sm font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">상위 5%</span>
                            </div>
                            <div className="flex flex-col gap-2 opacity-80 pl-1">
                                <div className="flex items-center justify-between px-3 py-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center font-bold text-label-md">1</div>
                                        <p className="text-label-md">이수아</p>
                                    </div>
                                    <p className="text-label-sm">12,500 걸음</p>
                                </div>
                                <div className="flex items-center justify-between px-3 py-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center font-bold text-label-md">2</div>
                                        <p className="text-label-md">박민수</p>
                                    </div>
                                    <p className="text-label-sm">11,200 걸음</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Badges Section */}
                <section className="mt-stack-lg">
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-stack-md flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                        최근 획득한 업적
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                        {/* Badge 1 */}
                        <div className="min-w-[140px] bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col items-center text-center interactive-element">
                            <div className="w-16 h-16 rounded-full border-4 border-secondary-container flex items-center justify-center bg-secondary-fixed/30 mb-3">
                                <span className="material-symbols-outlined text-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                            </div>
                            <span className="text-label-md font-label-md font-bold text-on-surface">3일 연속 달성</span>
                            <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">방금 전</span>
                        </div>
                        {/* Badge 2 */}
                        <div className="min-w-[140px] bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col items-center text-center interactive-element">
                            <div className="w-16 h-16 rounded-full border-4 border-primary-container flex items-center justify-center bg-primary-container/20 mb-3">
                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
                            </div>
                            <span className="text-label-md font-label-md font-bold text-on-surface">첫 만보 걷기</span>
                            <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">어제</span>
                        </div>
                        {/* Badge 3 */}
                        <div className="min-w-[140px] bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col items-center text-center interactive-element opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                            <div className="w-16 h-16 rounded-full border-4 border-outline-variant flex items-center justify-center bg-surface-variant mb-3">
                                <span className="material-symbols-outlined text-on-surface-variant text-3xl">park</span>
                            </div>
                            <span className="text-label-md font-label-md font-bold text-on-surface">건강 나무 성장</span>
                            <span className="text-label-sm font-label-sm text-on-surface-variant mt-1">진행 중 (86%)</span>
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center w-full py-stack-md px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto gap-4">
                    <div className="text-headline-md font-headline-md font-bold text-on-surface-variant">MoveUp</div>
                    <div className="flex gap-4">
                        <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="#">서비스 소개</a>
                        <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="#">이용약관</a>
                        <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface hover:underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity" href="#">개인정보처리방침</a>
                    </div>
                    <p className="text-label-sm font-label-sm text-secondary opacity-80">© 2024 MoveUp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
