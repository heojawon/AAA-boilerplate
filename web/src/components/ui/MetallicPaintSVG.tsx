import { useState, useEffect } from "react";
import MetallicPaint, { parseLogoImage } from "./MetallicPaint";

const MetallicSVG = ({ svgString }: { svgString: string }) => {
	const [imageData, setImageData] = useState<ImageData | null>(null);

	useEffect(() => {
		async function loadSVG() {
			try {
				// SVG 문자열을 data URL로 변환
				const svgBlob = new Blob([svgString], {
					type: "image/svg+xml",
				});
				const url = URL.createObjectURL(svgBlob);

				// fetch로 읽어서 File처럼 만들기
				const response = await fetch(url);
				const blob = await response.blob();
				const file = new File([blob], "svgfile.svg", {
					type: blob.type,
				});

				const parsed = await parseLogoImage(file);
				setImageData(parsed?.imageData ?? null);

				URL.revokeObjectURL(url);
			} catch (e) {
				console.error(e);
			}
		}

		loadSVG();
	}, [svgString]);

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<MetallicPaint
				imageData={imageData ?? new ImageData(1, 1)}
				params={{
					edge: 2,
					patternBlur: 0.005,
					patternScale: 2,
					refraction: 0.015,
					speed: 0.3,
					liquid: 0.07,
				}}
			/>
		</div>
	);
};

export default MetallicSVG;
