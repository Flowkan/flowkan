export const input = [
	"src/**/*.{js,jsx,ts,tsx}",
	"!/src/locales/**",
	"!**/node_modules/**",
];
export const output = "./src/locales/";
export const options = {
	debug: true,
	func: {
		list: ["i18next.t", "i18n.t", "t", "__"],
		extensions: [".ts", ".tsx"],
	},
	lngs: ["es", "en"],
	ns: ["translation"],
	defaultLng: "es",
	defaultNs: "translation",
	resource: {
		loadPath: "{{lng}}/{{ns}}.json",
		savePath: "{{lng}}.json",
		jsonIndent: 2,
		lineEnding: "\n",
	},
	plural: true,
	context: true,
	resetDefaultValue: false,
};
