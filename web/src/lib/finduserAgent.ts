export const getDeviceType = () => {
	const userAgent = navigator.userAgent;

	// iOS 기기 판별
	if (/iPad|iPhone|iPod/.test(userAgent)) {
		if (/CriOS/.test(userAgent)) {
			return "iOS Chrome";
		} else if (/Safari/.test(userAgent) && !/CriOS/.test(userAgent)) {
			return "iOS Safari";
		} else if (/KAKAOTALK/.test(userAgent)) {
			return "iOS Kakao";
		} else {
			return "iOS";
		}
	}

	// Android 기기 판별
	if (/android/i.test(userAgent)) {
		if (/Chrome/.test(userAgent)) {
			return "Android Chrome";
		} else if (/SamsungBrowser/.test(userAgent)) {
			return "Android Samsung Browser";
		} else if (/KAKAOTALK/.test(userAgent)) {
			return "Android Kakao";
		} else {
			return "Android";
		}
	}

	// 웹 브라우저 판별
	return "Web";
};
