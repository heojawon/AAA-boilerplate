import React, { useState, useEffect, useRef } from "react";
import { Search, School } from "lucide-react";

interface AutocompleteSchoolProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const KOREAN_SCHOOLS = [
    "서울고등학교",
    "경기고등학교",
    "경복고등학교",
    "대원외국어고등학교",
    "한영외국어고등학교",
    "상산고등학교",
    "민족사관고등학교",
    "현대청운고등학교",
    "용인한국외국어대학교부설고등학교",
    "서울과학고등학교",
    "경기과학고등학교",
    "대구과학고등학교",
    "하나고등학교",
    "배재고등학교",
    "선덕고등학교",
    "세화고등학교",
    "휘문고등학교",
    "중동고등학교",
    "보성고등학교",
    "단국대학교사범대학부속고등학교",
    "서초중학교",
    "대청중학교",
    "역삼중학교",
    "도곡중학교",
    "개원중학교",
    "신동중학교",
    "압구정중학교",
    "신사중학교",
    "반포중학교",
    "방배중학교",
    "잠원중학교",
];

export default function AutocompleteSchool({
    value,
    onChange,
    error,
}: AutocompleteSchoolProps) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        onChange(val);

        if (val.trim().length > 0) {
            const filtered = KOREAN_SCHOOLS.filter((school) =>
                school.toLowerCase().includes(val.toLowerCase()),
            );
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (school: string) => {
        setInputValue(school);
        onChange(school);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div
            className="relative"
            ref={containerRef}
            id="autocomplete-school-container"
        >
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
                    <Search className="h-5 w-5" />
                </span>
                <input
                    id="school-input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (inputValue.trim().length > 0) {
                            setIsOpen(true);
                        } else {
                            // Show all schools on focus when empty for better UX
                            setSuggestions(KOREAN_SCHOOLS);
                            setIsOpen(true);
                        }
                    }}
                    placeholder="학교명을 입력하세요 (예: 서울고등학교)"
                    className={`w-full bg-surface border ${
                        error ? "border-error" : "border-outline-variant"
                    } rounded-xl py-3 pl-10 pr-4 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-container transition-all`}
                />
            </div>

            {error && (
                <p
                    className="mt-1 text-xs text-error font-body-md"
                    id="school-error"
                >
                    {error}
                </p>
            )}

            {isOpen && suggestions.length > 0 && (
                <ul
                    id="school-suggestions"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-outline-variant bg-surface-container-lowest py-1 shadow-lg focus:outline-none"
                >
                    {suggestions.map((school, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(school)}
                            className="flex items-center gap-2 cursor-pointer select-none py-2 px-4 hover:bg-surface-container font-body-md text-body-md text-on-surface transition-all"
                        >
                            <School className="h-4 w-4 text-primary" />
                            <span>{school}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
