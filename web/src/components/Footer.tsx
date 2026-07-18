export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 md:flex-row">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold text-emerald-600">
                        MoveUp
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        © 2026 MoveUp. All Rights Reserved. <br />
                        MoveUp is a project that aims to promote youth wellness
                        and help them achieve their Goals.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                    <a
                        href="/terms/privacy"
                        className="transition hover:text-emerald-600"
                    >
                        Privacy Policy
                    </a>

                    <a
                        href="/terms/terms"
                        className="transition hover:text-emerald-600"
                    >
                        Terms of Service
                    </a>

                    <a
                        href="/terms/otherapps"
                        className="transition hover:text-emerald-600"
                    >
                        Other Apps
                    </a>
                </div>
            </div>
        </footer>
    );
}
