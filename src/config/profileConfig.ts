import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Byte",
	bio: "Security, code, and notes from the byte side.",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/ret2Byte",
		},
		{
			name: "推特",
			icon: "fa7-brands:x-twitter",
			url: "https://x.com/0xByteOfficial",
		},
		{
			name: "哔哩哔哩",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/419131265?spm_id_from=333.1007.0.0",
		},
	],
};
