// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "无机盐",
		imgurl: "/assets/friends/wujiyan.png",
		desc: "无机盐大手子",
		siteurl: "https://bajiu9.github.io/gggit/",
		tags: ["Blog"],
	},
	{
		id: 2,
		title: "Converter258",
		imgurl: "/assets/friends/converter258.jpg",
		desc: "王神，pwn大手子",
		siteurl: "https://www.converter258.cn",
		tags: ["Blog"],
	},
	{
		id: 3,
		title: "玉米",
		imgurl: "/assets/friends/p0pc03n.png",
		desc: "🌽",
		siteurl: "https://p0pc03n.cn/",
		tags: ["Blog"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
