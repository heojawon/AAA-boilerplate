"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "./ui/navbar";
import { useState } from "react";
import { useNavigate } from "react-router";

export function NavigationBar() {
    const navItems = [
        {
            name: "소개",
            link: "/about",
        },
        {
            name: "서비스",
            link: "#pricing",
        },
        {
            name: "요금제",
            link: "#contact",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="relative w-full mt-6">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        <NavbarButton
                            variant="secondary"
                            onClick={() => navigate("/account/join")}
                        >
                            회원가입
                        </NavbarButton>
                        <NavbarButton
                            variant="primary"
                            onClick={() => navigate("/account/login")}
                        >
                            로그인
                        </NavbarButton>
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                                navigate("/");
                            }}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            <NavbarButton
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate("/account/join");
                                }}
                                variant="secondary"
                                className="w-full"
                            >
                                회원가입
                            </NavbarButton>
                            <NavbarButton
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    navigate("/account/login");
                                }}
                                variant="primary"
                                className="w-full"
                            >
                                로그인
                            </NavbarButton>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
            {/* Navbar */}
        </div>
    );
}
