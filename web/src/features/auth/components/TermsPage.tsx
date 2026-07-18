import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-surface-bright px-6 py-10 text-on-surface">
            <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-lg">
                <Link
                    to="/auth"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant bg-surface px-3 py-2 text-sm font-body-md text-on-surface-variant transition-all hover:bg-surface-container"
                >
                    <ArrowLeft className="h-4 w-4" />
                    돌아가기
                </Link>

                <div className="space-y-3">
                    <h1 className="font-display-lg text-2xl font-bold text-primary">
                        이용약관 및 개인정보 처리방침
                    </h1>
                    <p className="text-sm leading-7 text-on-surface-variant">
                        본 서비스는 사용자가 입력한 이메일, 닉네임, 건강 목표
                        정보 등을 회원 관리 및 맞춤형 서비스 제공 목적으로
                        수집합니다. 수집된 정보는 서비스 운영, 보안, 품질 개선,
                        알림 발송에만 사용되며, 제3자에게 제공되지 않습니다.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-base font-bold text-on-surface">
                        1. 수집 정보
                    </h2>
                    <p className="text-sm leading-7 text-on-surface-variant">
                        이메일 주소, 비밀번호(인증 서버에 안전하게 저장됨),
                        닉네임, 선택 입력 정보, 건강 관련 설정 정보 등이 포함될
                        수 있습니다.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-base font-bold text-on-surface">
                        2. 이용 목적
                    </h2>
                    <p className="text-sm leading-7 text-on-surface-variant">
                        로그인 유지, 맞춤형 AI 추천, 퀘스트 제공, 알림 발송,
                        서비스 안정성 확보를 위해 사용됩니다.
                    </p>
                </div>

                <div className="space-y-2">
                    <h2 className="text-base font-bold text-on-surface">
                        3. 이용자의 권리
                    </h2>
                    <p className="text-sm leading-7 text-on-surface-variant">
                        사용자는 언제든지 계정 삭제 요청을 통해 개인 정보를
                        관리할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
