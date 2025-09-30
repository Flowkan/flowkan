export const formattedToHTML = (description: string) => {
	// --- Formateando Markdown a HTML ---
	let formatted = description;

	// headings
	formatted = formatted
		.replace(/^# (.+)$/gm, "<h1>$1</h1>")
		.replace(/^## (.+)$/gm, "<h2>$1</h2>")
		.replace(/^### (.+)$/gm, "<h3>$1</h3>")
		.replace(/^#### (.+)$/gm, "<h4>$1</h4>");

	// texto que llega en negrita y cursiva
	formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");

	// Listas que empiecen por * o - al inicio
	const lines = formatted.split("\n");
	let inList = false;
	formatted = lines
		.map((line) => {
			const listItemMatch = line.match(/^\s*[\*\-]\s+(.*)$/);
			if (listItemMatch) {
				if (!inList) {
					inList = true;
					formatted = formatted.replace(/(?<!<\/h3>|<\/li>)\n/g, "<br>");
					return "<ul><li>" + listItemMatch[1] + "</li>";
				} else {
					return "<li>" + listItemMatch[1] + "</li>";
				}
			} else {
				if (inList) {
					inList = false;
					return "</ul>" + line;
				}
				return line;
			}
		})
		.join("\n");

	// Saltos de línea fuera de h3/li
	formatted = formatted.replace(/(?<!<\/h3>|<\/li>)\n/g, "<br>");
	return formatted;
};
